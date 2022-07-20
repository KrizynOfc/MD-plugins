const {
    default: makeWASocket,
    proto,
    downloadContentFromMessage,
    getBinaryNodeChild,
    jidDecode,
    areJidsSameUser,
    WAMessageStubType,
    WA_DEFAULT_EPHEMERAL,
    MessageType, 
    MessageOptions, 
    Mimetype,
    generateForwardMessageContent,
    generateMessageID,
    prepareWAMessageMedia,
    generateWAMessageFromContent
} = require('@adiwajshing/baileys-md')
const { toAudio, toPTT, toVideo } = require('./converter')
const chalk = require('chalk')
const fetch = require('node-fetch')
const FileType = require('file-type')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./exif')
const PhoneNumber = require('awesome-phonenumber')
const fs = require('fs')
const path = require('path')

exports.makeWASocket = (...args) => {
    let conn = makeWASocket(...args)
    
   conn.loadMessage = (messageID) => {
        return Object.entries(conn.chats)
            .filter(([_, { messages }]) => typeof messages === 'object')
            .find(([_, { messages }]) => Object.entries(messages)
            .find(([k, v]) => (k === messageID || v.key?.id === messageID)))
            ?.[1].messages?.[messageID]
    }

    conn.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }
    if (conn.user && conn.user.id) conn.user.jid = conn.decodeJid(conn.user.id)
    conn.chats = {}
    conn.contacts = {}
    
   /**
     * Parses string into mentionedJid(s)
     * @param {String} text
     */
    conn.parseMention = (text = '') => {
        return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    }

    function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
    }
    
   function ucapan() {
    const time = require('moment-timezone').tz('Asia/Jakarta').format('HH')
    res = "Selamat dinihari 🌅"
    if (time >= 4) {
    res = "Selamat pagi 🏙"
    }
    if (time > 10) {
    res = "Selamat siang 🌄"
    }
    if (time >= 15) {
    res = "Selamat sore 🌇"
    }
    if (time >= 18) {
    res = "Selamat malam 🌌"
    }
   return res
 }

    function updateNameToDb(contacts) {
        if (!contacts) return
        for (let contact of contacts) {
            let id = conn.decodeJid(contact.id)
            if (!id) continue
            let chats = conn.contacts[id]
            if (!chats) chats = { id }
            let chat = {
                ...chats,
                ...({
                    ...contact, id, ...(id.endsWith('@g.us') ?
                        { subject: contact.subject || chats.subject || '' } :
                        { name: contact.notify || chats.name || chats.notify || '' })
                } || {})
            }
            conn.contacts[id] = chat
        }
    }
    conn.ev.on('contacts.upsert', updateNameToDb)
    conn.ev.on('groups.update', updateNameToDb)
    conn.ev.on('group-participants.update', async function updateParticipantsToDb({ id, participants, action }) {
        id = conn.decodeJid(id)
        if (!(id in conn.contacts)) conn.contacts[id] = { id }
        let groupMetadata = Object.assign((conn.contacts[id].metadata || {}), await conn.groupMetadata(id))
        for (let participant of participants) {
            participant = conn.decodeJid(participant)
            switch (action) {
                case 'add': {
                    if (participant == conn.user.jid) groupMetadata.readOnly = false
                    let same = (groupMetadata.participants || []).find(user => user && user.id == participant)
                    if (!same) groupMetadata.participants.push({ id, admin: null })
                }
                    break
                case 'remove': {
                    if (participant == conn.user.jid) groupMetadata.readOnly = true
                    let same = (groupMetadata.participants || []).find(user => user && user.id == participant)
                    if (same) {
                        let index = groupMetadata.participants.indexOf(same)
                        if (index !== -1) groupMetadata.participants.splice(index, 1)
                    }
                }
                    break
            }
        }
        conn.contacts[id] = {
            ...conn.contacts[id],
            subject: groupMetadata.subject,
            desc: groupMetadata.desc?.toString(),
            metadata: groupMetadata
        }
    })

    conn.ev.on('groups.update', function groupUpdatePushToDb(groupsUpdates) {
        for (let update of groupsUpdates) {
            let id = conn.decodeJid(update.id)
            if (!id) continue
            if (!(id in conn.contacts)) conn.contacts[id] = { id }
            if (!conn.contacts[id].metadata) conn.contacts[id].metadata = {}
            let subject = update.subject
            if (subject) conn.contacts[id].subject = subject
            let announce = update.announce
            if (announce) conn.contacts[id].metadata.announce = announce
        }
    })
    conn.ev.on('chats.upsert', function chatsUpsertPushToDb(chats_upsert) {
        console.log({ chats_upsert })
    })
    conn.ev.on('presence.update', function presenceUpdatePushToDb({ id, presences }) {
        let sender = Object.keys(presences)[0] || id
        let _sender = conn.decodeJid(sender)
        let presence = presences[sender]['lastKnownPresence'] || 'composing'
        if (!(_sender in conn.contacts)) conn.contacts[_sender] = {}
        conn.contacts[_sender].presences = presence
    })

    conn.logger = {
        ...conn.logger,
        info(...args) { console.log(chalk.bold.rgb(57, 183, 16)(`INFO [${chalk.rgb(255, 255, 255)(new Date())}]:`), chalk.cyan(...args)) },
        error(...args) { console.log(chalk.bold.rgb(247, 38, 33)(`ERROR [${chalk.rgb(255, 255, 255)(new Date())}]:`), chalk.rgb(255, 38, 0)(...args)) },
        warn(...args) { console.log(chalk.bold.rgb(239, 225, 3)(`WARNING [${chalk.rgb(255, 255, 255)(new Date())}]:`), chalk.keyword('orange')(...args)) }
    }

    /**
     * getBuffer hehe
     * @param {String|Buffer} path
     * @param {Boolean} returnFilename
     */
    conn.getFile = async (PATH, returnAsFilename) => {
        let res, filename
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
        let type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        let go = new Date * 1
        if (data && returnAsFilename && !filename) (filename = path.join(__dirname, '../tmp/' + go + '.' + type.ext), await fs.promises.writeFile(filename, data))
        return {
            res,
            filename,
            ...type,
            data
        }
    }

    /**
     * waitEvent
     * @param {*} eventName 
     * @param {Boolean} is 
     * @param {Number} maxTries 
     * @returns 
     */
    conn.waitEvent = (eventName, is = () => true, maxTries = 25) => {
        return new Promise((resolve, reject) => {
            let tries = 0
            let on = (...args) => {
                if (++tries > maxTries) reject('Max tries reached')
                else if (is()) {
                    conn.ev.off(eventName, on)
                    resolve(...args)
                }
            }
            conn.ev.on(eventName, on)
        })
    }

    /**
    * Send Media/File with Automatic Type Specifier
    * @param {String} jid
    * @param {String|Buffer} path
    * @param {String} filename
    * @param {String} caption
    * @param {Object} quoted
    * @param {Boolean} ptt
    * @param {Object} options
    */
    conn.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
        let type = await conn.getFile(path, true)
        let { res, data: file, filename: pathFile } = type
        if (res && res.status !== 200 || file.length <= 65536) {
            try { throw { json: JSON.parse(file.toString()) } }
            catch (e) { if (e.json) throw e.json }
        }
        let opt = { filename }
        if (quoted) opt.quoted = quoted
        if (!type) if (options.asDocument) options.asDocument = true
        let mtype = '', mimetype = type.mime
        if (/webp/.test(type.mime)) mtype = 'sticker'
        else if (/image/.test(type.mime)) mtype = 'image'
        else if (/video/.test(type.mime)) mtype = 'video'
        else if (/audio/.test(type.mime)) (
            convert = await (ptt ? toPTT : toAudio)(file, type.ext),
            file = convert.data,
            pathFile = convert.filename,
            mtype = 'audio',
            mimetype = 'audio/ogg; codecs=opus'
        )
        else mtype = 'document'
        return await conn.sendMessage(jid, {
            ...options,
            caption,
            ptt,
            [mtype]: { url: pathFile },
            mimetype
        }, {
            ...opt,
            ...options
        })
    }
    
   conn.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }

        await conn.sendMessage(jid, { sticker: buffer, ...options }, { quoted })
        return buffer
    }
    
    conn.link = (message) => {
    	if (message.url && message.mediaKey) {
    		const mediakei = Buffer.from(message.mediaKey).toString('base64')
    		return `https://mmg.soff.tk/d/f/${message.url.split('/d/f/')[1]}/${encodeURIComponent(mediakei)}?type=${message.mimetype.split('/')[0]}`	
    	}
    	const psn = message.message[message.mtype]
    	const urlmsg = psn?.url
    	if (!urlmsg) return
    	const mediakei = Buffer.from(psn.mediaKey).toString('base64')
    	return `https://mmg.soff.tk/d/f/${urlmsg.split('/d/f/')[1]}/${encodeURIComponent(mediakei)}?type=${psn.mimetype.split('/')[0]}`
    }

     /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    conn.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options)
        } else {
            buffer = await videoToWebp(buff)
        }

        await conn.sendMessage(jid, { sticker: buffer, ...options }, { quoted })
        return buffer
    }

    /**
     * Send Contact
     * @param {String} jid 
     * @param {String} number 
     * @param {String} name 
     * @param {Object} quoted 
     * @param {Object} options 
     */
    conn.sendContact = async (jid, number, name, quoted, options) => {
        number = number.replace(/[^0-9]/g, '')
        let njid = number + '@s.whatsapp.net'
        let vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${name.replace(/\n/g, '\\n')}
TEL;type=CELL;type=VOICE;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
END:VCARD
    `
        return await conn.sendMessage(jid, {
            contacts: {
                displayName: name,
                contacts: [{ vcard }],
                quoted, ...options
            },
            quoted, ...options
        })
    }

    /**
     * Reply to a message
     * @param {String} jid
     * @param {String|Object} text
     * @param {Object} quoted
     * @param {Object} options
     */
    conn.reply = (jid, text = '', quoted, options) => {
        let a = ['1', '2', '3', '4', '5', 'ku', 'shiraori', '6', '7', '8', '9', '10', '11']
        let b = a[Math.floor(Math.random() * a.length)]
        return conn.sendMessage(jid, { text, mentions: conn.parseMention(text), contextInfo: {
    externalAdReply :{
    sourceUrl: `https://instagram.com`,
    previewType: "PHOTO",
    title: `${global.wm}\n${ucapan()}️`,
    body: `Aktif Selama: ${clockString(process.uptime() * 1000)}`,
    thumbnail: fs.readFileSync(`./media/${b}.jpg`),
   }} }, { quoted, ...options })
 }

   conn.fakeReply = (jid, text = '', fakeJid = conn.user.jid, fakeText = '', fakeGroupJid, options) => {
        return conn.sendMessage(jid, { text: text }, { ephemeralExpiration: 86400, quoted: { key: { fromMe: fakeJid == conn.user.jid, participant: fakeJid, ...(fakeGroupJid ? { remoteJid: fakeGroupJid } : {}) }, message: { conversation: fakeText }, ...options } })
    }
    
    conn.but = async (jid, text, fot, mens, but1, id1, opts, quo) => {
       let butt = [
                  {buttonId: id1, buttonText: {displayText: but1}, type: 1}];
           if (!opts) {     
     conn.sendMessage(jid, { caption: text, location: { jpegThumbnail: fs.readFileSync('./media/tqto.jpg') }, buttons: butt, footer: fot, headerType: 'LOCATION', mentions: [mens] })
          }
       else if (opts) {
      conn.sendMessage(jid, { image: { url: opts }, caption: text, buttons: butt, footer: fot, headerType: 'IMAGE', mentions: [mens] }, { quoted: quo })
        }
     }
     
      conn.sendBD = async (jid, contentText, footer, doc, buttons, quoted, options) => {
        let message = {
            document: { url: doc },
            ...options,
            caption: contentText,
            headerType: 4,
            footer: footer,
            buttons: buttons.map(mk => {
                return {
                    buttonId: mk[1] || mk[0] || '',
                    buttonText: {
                        displayText: mk[0] || mk[1] || ''
                    }
                }
            })
        }
        return await conn.sendMessage(jid, message, { quoted: quoted, ...options })
    }  
     
     conn.butct = async (jid, text, fot, mens, buf, but1, id1) => {
      let buttt = [
                  {buttonId: id1, buttonText: {displayText: but1}, type: 1}];    
      conn.sendMessage(jid, { caption: text, location: { jpegThumbnail: buf }, buttons: buttt, footer: fot, headerType: 'LOCATION', mentions: [mens] })
      }            

    /**
    * cMod
    * @param {String} jid 
    * @param {*} message 
    * @param {String} text 
    * @param {String} sender 
    * @param {*} options 
    * @returns 
    */
    conn.cMod = async (jid, message, text = '', sender = conn.user.jid, options = {}) => {
        if (options.mentions && !Array.isArray(options.mentions)) options.mentions = [options.mentions]
        let copy = message.toJSON()
        delete copy.message.messageContextInfo
        delete copy.message.senderKeyDistributionMessage
        let mtype = Object.keys(copy.message)[0]
        let msg = copy.message
        let content = msg[mtype]
        if (typeof content === 'string') msg[mtype] = text || content
        else if (content.caption) content.caption = text || content.caption
        else if (content.text) content.text = text || content.text
        if (typeof content !== 'string') {
            msg[mtype] = { ...content, ...options }
            msg[mtype].contextInfo = {
                ...(content.contextInfo || {}),
                mentionedJid: options.mentions || content.contextInfo?.mentionedJid || []
            }
        }
        if (copy.participant) sender = copy.participant = sender || copy.participant
        else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
        if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
        else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
        copy.key.remoteJid = jid
        copy.key.fromMe = areJidsSameUser(sender, conn.user.id) || false
        return proto.WebMessageInfo.fromObject(copy)
    }

    /**
     * Exact Copy Forward
     * @param {String} jid
     * @param {Object} message
     * @param {Boolean|Number} forwardingScore
     * @param {Object} options
     */
    conn.copyNForward = async (jid, message, forwardingScore = true, options = {}) => {
        let m = generateForwardMessageContent(message, !!forwardingScore)
        let mtype = Object.keys(m)[0]
        if (forwardingScore && typeof forwardingScore == 'number' && forwardingScore > 1) m[mtype].contextInfo.forwardingScore += forwardingScore
        m = generateWAMessageFromContent(jid, m, { ...options, userJid: conn.user.id })
        await conn.relayMessage(jid, m.message, { messageId: m.key.id, additionalAttributes: { ...options } })
        return m
    }
    /**
     * Download media message
     * @param {Object} m
     * @param {String} type 
     * @param {fs.PathLike|fs.promises.FileHandle} filename
     * @returns {Promise<fs.PathLike|fs.promises.FileHandle|Buffer>}
     */
    conn.downloadM = async (m, type, filename = '') => {
        if (!m || !(m.url || m.directPath)) return Buffer.alloc(0)
        const stream = await downloadContentFromMessage(m, type)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        if (filename) await fs.promises.writeFile(filename, buffer)
        return filename && fs.existsSync(filename) ? filename : buffer
    }

    /**
     * Read message
     * @param {String} jid 
     * @param {String|undefined|null} participant 
     * @param {String} messageID 
     */
    conn.chatRead = async (jid, participant, messageID) => {
        return await conn.sendReadReceipt(jid, participant, [messageID])
    }
  
    /**
     * Get name from jid
     * @param {String} jid
     * @param {Boolean} withoutContact
     */
    conn.getName = (jid, withoutContact = false) => {
        jid = conn.decodeJid(jid)
        withoutContact = this.withoutContact || withoutContact
        let v
        if (jid?.endsWith('@g.us')) return new Promise(async (resolve) => {
            v = conn.contacts[jid] || {}
            if (!(v.name || v.subject)) v = await conn.groupMetadata(jid) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = jid === '0@s.whatsapp.net' ? {
            jid,
            vname: 'WhatsApp'
        } : jid === conn.user.jid ?
            conn.user :
            (conn.contacts[jid] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.vname || v.notify || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }

    /**
    * Send a list message
    * @param jid the id to send to
    * @param button the optional button text, title and description button
    * @param rows the rows of sections list message
    */
    conn.sendListM = async (jid, button, rows, quoted, options = {}) => {
        const sections = [
            {
                title: button.title,
                rows: [...rows]
            }
        ]
        const listMessage = {
            text: button.description,
            footer: button.footerText,
            mentions: await conn.parseMention(button.description),
            ephemeralExpiration: 86400,
            title: '',
            buttonText:button.buttonText,
            sections
        }
        conn.sendMessage(jid, listMessage, {
            quoted,
            ephemeralExpiration: 86400,
            contextInfo: {
                forwardingScore: 999999,
                isForwarded: true,
                mentions: await conn.parseMention(button.description + button.footerText),
                ...options
            }
        })
    }
     /**
     * send Button
     * @param {String} jid 
     * @param {String} contentText 
     * @param {String} footer
     * @param {Buffer|String} buffer 
     * @param {String[]} buttons 
     * @param {Object} quoted 
     * @param {Object} options 
     */
     conn.sendButton = async (jid, content, footer, button1, row1, quoted) => {
      return await conn.sendMessage(jid, {
        text: content,
        footer: footer,
        buttons: [
          { buttonId: row1, buttonText: { displayText: button1 }, type: 1 }
        ],
        headerType: 'TEXT',
        mentions: conn.parseMention(content + footer) }, { quoted: quoted })
     }
     
    conn.send2Button = async(jid, content, footer, button1, row1, button2, row2, q) => {
	  const buttons = [
	   { buttonId: row1, buttonText: { displayText: button1 }, type: 1 },
          { buttonId: row2, buttonText: { displayText: button2 }, type: 1 }
	  ]
const buttonMessage = {
    text: content,
    footer: footer,
    buttons: buttons,
    headerType: 'TEXT',
    mentions: conn.parseMention(content + footer)
}
return await conn.sendMessage(jid, buttonMessage, { quoted: q })
  }
  
   conn.send3Button = async(jid, content, footer, button1, row1, button2, row2, button3, row3, q) => {
	  const buttons = [
	  { buttonId: row1, buttonText: { displayText: button1 }, type: 1 },
          { buttonId: row2, buttonText: { displayText: button2 }, type: 1 },
          { buttonId: row3, buttonText: { displayText: button3 }, type: 1 }
	  ]
const buttonMessage = {
    text: content,
    footer: footer,
    buttons: buttons,
    headerType: 'TEXT',
    mentions: conn.parseMention(content + footer)
}
return await conn.sendMessage(jid, buttonMessage, { quoted: q })
  }
  
  
    /**
     * Send Button with Image
     * @param {String} jid
     * @param {Buffer} buffer
     * @param {String} content
     * @param {String} footer
     * @param {String} button1
     * @param {String} row1
     * @param {String} button2
     * @param {String} row2
     * @param {String} button3
     * @param {String} row3
     * @param {Object} quoted
     * @param {Object} options
     */
	 
  conn.sendButtonImg = async(jid, buffer, content, footer, button1, row1, q) => {
	  const buttons = [
	  {buttonId: row1, buttonText: {displayText: button1}, type: 1}
	  ]
const buttonMessage = {
    image: {url: buffer},
    jpegThumbnail: await (await fetch(buffer)).buffer(),
    caption: content,
    footer: footer,
    buttons: buttons,
    headerType: 1
}
return await conn.sendMessage(jid, buttonMessage, { quoted: q })
  }
  
   conn.send2ButtonImg = async(jid, buffer, content, footer, button1, row1, button2, row2, q) => {
	  const buttons = [
	   { buttonId: row1, buttonText: { displayText: button1 }, type: 1 },
          { buttonId: row2, buttonText: { displayText: button2 }, type: 1 }
	  ]
const buttonMessage = {
   image: {url: buffer},
   jpegThumbnail: await (await fetch(buffer)).buffer(),
    caption: content,
    footer: footer,
    buttons: buttons,
    headerType: 1
}
return await conn.sendMessage(jid, buttonMessage, { quoted: q })
  }
  
   conn.send3ButtonImg = async(jid, buffer, content, footer, button1, row1, button2, row2, button3, row3, q) => {
	  const buttons = [
	  { buttonId: row1, buttonText: { displayText: button1 }, type: 1 },
          { buttonId: row2, buttonText: { displayText: button2 }, type: 1 },
          { buttonId: row3, buttonText: { displayText: button3 }, type: 1 }
	  ]
const buttonMessage = {
    image: {url: buffer},
    jpegThumbnail: await (await fetch(buffer)).buffer(),
    caption: content,
    footer: footer,
    buttons: buttons,
    headerType: 1
}
return await conn.sendMessage(jid, buttonMessage, { quoted: q })
  }
  
conn.sendButtonLoc = async(jid, buffer, content, footer, button1, row1) => {
	  const buttons = [
	   { buttonId: row1, buttonText: { displayText: button1 }, type: 1 }
	  ]
const buttonMessage = {
    location: {jpegThumbnail: buffer},
    caption: content,
    footer: footer,
    buttons: buttons,
    headerType: 6
}
return await conn.sendMessage(jid, buttonMessage)
  }
  
 conn.send2ButtonLoc = async(jid, buffer, content, footer, button1, row1, button2, row2) => {
	  const buttons = [
	   { buttonId: row1, buttonText: { displayText: button1 }, type: 1 },
          { buttonId: row2, buttonText: { displayText: button2 }, type: 1 }
	  ]
const buttonMessage = {
    location: {jpegThumbnail: buffer},
    caption: content,
    footer: footer,
    buttons: buttons,
    headerType: 6
}
return await conn.sendMessage(jid, buttonMessage)
  }
  
 conn.send3ButtonLoc = async(jid, buffer, content, footer, button1, row1, button2, row2, button3, row3) => {
	  const buttons = [
	  { buttonId: row1, buttonText: { displayText: button1 }, type: 1 },
          { buttonId: row2, buttonText: { displayText: button2 }, type: 1 },
          { buttonId: row3, buttonText: { displayText: button3 }, type: 1 }
	  ]
const buttonMessage = {
    location: {jpegThumbnail: buffer},
    caption: content,
    footer: footer,
    buttons: buttons,
    headerType: 6
}
return await conn.sendMessage(jid, buttonMessage)
  }
  
 /**
     * Send Hydrate Button
     * @param {String} jid
     * @param {String} content
     * @param {String} footer
     * @param {String} displayText
     * @param {String} link
     * @param {Object} displayCall
     * @param {Object} number
	 * @param {Object} quickReplyText
     * @param {Object} id
	 * @param {Object} quickReplyText2
     * @param {Object} id2
	 * @param {Object} quickReplyText3
     * @param {Object} id3
	 * @param {Object} quoted
     */
	 
	conn.sendHydrate = async (jid, content, footer, displayText, link, displayCall, number, quickReplyText, id, quoted) => {
		let template = generateWAMessageFromContent(jid, proto.Message.fromObject({
			         templateMessage: {
             hydratedTemplate: {
                 hydratedContentText: content,
                 hydratedFooterText: footer,
                 hydratedButtons: [{
                     urlButton: {
                         displayText: displayText,
                         url: link
                     }
                 }, {
                     urlButton: {
                         displayText: displayCall,
                         url: number
                     }
                 },
                 {
                     quickReplyButton: {
                         displayText: quickReplyText,
                         id: id
                     }
                 }
                 ]
             }
         }
     }), { userJid: conn.user.jid, quoted: quoted});
     return await conn.relayMessage(
         jid,
         template.message,
         { messageId: template.key.id }
     )
	}
	
	conn.sendHydrate2 = async (jid, content, displayText, link, displayCall, number, quickReplyText, id, quickReplyText2, id2, quoted) => {
		let template = generateWAMessageFromContent(jid, proto.Message.fromObject({
			         templateMessage: {
             hydratedTemplate: {
                 hydratedContentText: content,
                 hydratedButtons: [{
                     urlButton: {
                         displayText: displayText,
                         url: link
                     }
                 }, {
                     callButton: {
                         displayText: displayCall,
                         phoneNumber: number
                     }
                 },
                 {
             quickReplyButton: {
               displayText: quickReplyText,
               id: id,
             }

           },
               {
             quickReplyButton: {
               displayText: quickReplyText2,
               id: id2,
             }
		   }]
         }
       }
     }), { userJid: conn.user.jid, quoted: quoted});
     return await conn.relayMessage(
         jid,
         template.message,
         { messageId: template.key.id }
     )
	}
	
	
	conn.sendGroupV4Invite = async (jid, participant, inviteCode, inviteExpiration, groupName = 'unknown subject', caption = 'Invitation to join my WhatsApp group', options = {}) => {
        let msg = proto.Message.fromObject({
            groupInviteMessage: proto.GroupInviteMessage.fromObject({
                inviteCode,
                inviteExpiration: parseInt(inviteExpiration) || + new Date(new Date + (3 * 86400000)),
                groupJid: jid,
                groupName: groupName ? groupName : this.getName(jid),
                caption
            })
        })
        let message = await this.prepareMessageFromContent(participant, msg, options)
        await this.relayWAMessage(message)
        return message
    }
	

    conn.saveName = async (id, name = '') => {
        if (!id) return
        id = conn.decodeJid(id)
        let isGroup = id.endsWith('@g.us')
        if (id in conn.contacts && conn.contacts[id][isGroup ? 'subject' : 'name'] && id in conn.chats) return
        let metadata = {}
        if (isGroup) metadata = await conn.groupMetadata(id)
        let chat = { ...(conn.contacts[id] || {}), id, ...(isGroup ? { subject: metadata.subject, desc: metadata.desc?.toString(), metadata } : { name }) }
        conn.contacts[id] = chat
        conn.chats[id] = chat
    }

    conn.pushMessage = (m) => {
        if (['senderKeyDistributionMessage', 'protocolMessage'].includes(m.mtype)) return 
        let id = m.chat
        let chats = conn.chats[id]
        if (!chats) chats = { id }
        if (!chats.messages) chats.messages = {}
        chats.messages[m.id] = JSON.stringify(m, null, 2)
    }
    
        /**
     * 
     * @param {Array} list 
     * @returns 
     */
    conn.random = (list) => {
        return list[Math.floor(list.length * Math.random())]
    }

    /**
     * 
     * @param {Number} ms 
     * @returns 
     */
    conn.delay = (ms) => {
        return new Promise((resolve, reject) => setTimeout(resolve, ms))
    }
    
    conn.setStatus = (status) => {
        conn.query({
            tag: 'iq',
            attrs: {
                to: '@s.whatsapp.net',
                type: 'set',
                xmlns: 'status',
            },
            content: [{
                tag: 'status',
                attrs: {},
                content: Buffer.from(status, 'utf-8')
            }]
        })
        return status
    }
    
    conn.getBusinessProfile = async (jid) => {
        const results = await conn.query({
            tag: 'iq',
            attrs: {
                to: 's.whatsapp.net',
                xmlns: 'w:biz',
                type: 'get'
            },
            content: [{
                tag: 'business_profile',
                attrs: { v: '244' },
                content: [{
                    tag: 'profile',
                    attrs: { jid }
                }]
            }]
        })
        const profiles = getBinaryNodeChild(getBinaryNodeChild(results, 'business_profile'), 'profile')
        if (!profiles) return {} // if not bussines
        const address = getBinaryNodeChild(profiles, 'address')
        const description = getBinaryNodeChild(profiles, 'description')
        const website = getBinaryNodeChild(profiles, 'website')
        const email = getBinaryNodeChild(profiles, 'email')
        const category = getBinaryNodeChild(getBinaryNodeChild(profiles, 'categories'), 'category')
        return {
            jid: profiles.attrs?.jid,
            address: address?.content.toString(),
            description: description?.content.toString(),
            website: website?.content.toString(),
            email: email?.content.toString(),
            category: category?.content.toString(),
        }
    }
    /**
     * Serialize Message, so it easier to manipulate
     * @param {Object} m
     */
    conn.serializeM = (m) => {
        return exports.smsg(conn, m)
    }

    Object.defineProperty(conn, 'name', {
        value: 'WASocket',
        configurable: true,
    })
    return conn
}
/**
 * Serialize Message
 * @param {WAConnection} conn 
 * @param {Object} m 
 * @param {Boolean} hasParent 
 */
exports.smsg = (conn, m, hasParent) => {
    if (!m) return m
    let M = proto.WebMessageInfo
    if (m.key) {
        m.id = m.key.id
        m.isBaileys = m.id && m.id.length === 16 || false
        m.chat = conn.decodeJid(m.key.remoteJid || m.msg && m.msg.groupId || '')
        m.isGroup = m.chat.endsWith('@g.us')
        m.fromMe = m.key.fromMe
        m.sender = conn.decodeJid(m.fromMe && conn.user.id || m.participant || m.key.participant || m.chat || '')
    }
    if (m.message) {
        let mtype = Object.keys(m.message)
        m.mtype = (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(mtype[0]) && mtype[0]) || // Sometimes message in the front
        (mtype.length >= 3 && mtype[1] !== 'messageContextInfo' && mtype[1]) || // Sometimes message in midle if mtype length is greater than or equal to 3!
        mtype[mtype.length - 1] // common case
        m.msg = m.message[m.mtype]
        if (m.chat == 'status@broadcast' && ['protocolMessage', 'senderKeyDistributionMessage'].includes(m.mtype)) m.chat = (m.key.remoteJid !== 'status@broadcast' && m.key.remoteJid) || m.sender
        // if (m.mtype === 'ephemeralMessage') {
        //     exports.smsg(conn, m.msg)
        //     m.mtype = m.msg.mtype
        //     m.msg = m.msg.msg
        //   }
        if (m.mtype == 'protocolMessage') {
            if (m.msg.key.remoteJid == 'status@broadcast') m.msg.key.remoteJid = m.chat
            if (!m.msg.key.participant || m.msg.key.participant == 'status_me') m.msg.key.participant = m.sender
            m.msg.key.fromMe = conn.decodeJid(m.msg.key.participant) === conn.decodeJid(conn.user.id)
            if (!m.msg.key.fromMe && m.msg.key.remoteJid === conn.decodeJid(conn.user.id)) m.msg.key.remoteJid = m.sender
        }
        m.text = m.msg.text || m.msg.caption || m.msg.contentText || m.msg || ''
        m.mentionedJid = m.msg && m.msg?.contextInfo && m.msg?.contextInfo?.mentionedJid && m.msg?.contextInfo?.mentionedJid.length && m.msg?.contextInfo?.mentionedJid || []
        let quoted = m.quoted = m.msg && m.msg.contextInfo && m.msg.contextInfo.quotedMessage ? m.msg.contextInfo.quotedMessage : null
        if (m.quoted) {
            let type = Object.keys(m.quoted)[0]
            m.quoted = m.quoted[type]
            if (typeof m.quoted === 'string') m.quoted = { text: m.quoted }
            m.quoted.mtype = type
            m.quoted.id = m.msg.contextInfo.stanzaId
            m.quoted.chat = conn.decodeJid(m.msg.contextInfo.remoteJid || m.chat || m.sender)
            m.quoted.isBaileys = m.quoted.id && m.quoted.id.length === 16 || false
            m.quoted.sender = conn.decodeJid(m.msg.contextInfo.participant)
            m.quoted.fromMe = m.quoted.sender === conn.user.jid
            m.quoted.text = m.quoted.text || m.quoted.caption || ''
            m.quoted.mentionedJid = m.quoted.contextInfo && m.quoted.contextInfo.mentionedJid && m.quoted.contextInfo.mentionedJid.length && m.quoted.contextInfo.mentionedJid || []
            let vM = m.quoted.fakeObj = M.fromObject({
                key: {
                    fromMe: m.quoted.fromMe,
                    remoteJid: m.quoted.chat,
                    id: m.quoted.id
                },
                message: quoted,
                ...(m.isGroup ? { participant: m.quoted.sender } : {})
            })
            m.getQuotedObj = m.getQuotedMessage = async () => {
                if (!m.quoted.id) return null
                let q = M.fromObject(await conn.loadMessage(m.quoted.id) || vM)
                return exports.smsg(conn, q ? q : vM)
            }

            if (m.quoted.url || m.quoted.directPath) m.quoted.download = () => conn.downloadM(m.quoted, m.quoted.mtype.toLowerCase().replace(/message/i, ''))

            /**
             * Reply to quoted message
             * @param {String|Object} text
             * @param {String|false} chatId
             * @param {Object} options
             */
            m.quoted.reply = (text, chatId, options) => conn.reply(chatId ? chatId : m.chat, text, vM, options)

            /**
             * Copy quoted message
             */
            m.quoted.copy = () => exports.smsg(conn, M.fromObject(M.toObject(vM)))

            /**
             * Exact Forward quoted message
             * @param {String} jid
             * @param {Boolean|Number} forceForward
             * @param {Object} options
            */
            m.quoted.copyNForward = (jid, forceForward = true, options = {}) => conn.copyNForward(jid, vM, forceForward, options)

            /**
             * Delete quoted message
             */
            m.quoted.delete = () => conn.sendMessage(m.quoted.chat, { delete: vM.key })
        }
    }
    m.name = m.pushName || conn.getName(m.sender)
    if (m.msg && m.msg.url) m.download = () => conn.downloadM(m.msg, m.mtype.toLowerCase().replace(/message/i, ''))
    /**
     * Reply to this message
     * @param {String|Object} text
     * @param {String|false} chatId
     * @param {Object} options
     */
    m.reply = (text, chatId, options) => conn.reply(chatId ? chatId : m.chat, text, m, options)
    
    /**
     * Exact Forward this message
     * @param {String} jid
     * @param {Boolean} forceForward
     * @param {Object} options
     */
    m.copyNForward = (jid = m.chat, forceForward = true, options = {}) => conn.copyNForward(jid, m, forceForward, options)

    /**
     * Modify this Message
     * @param {String} jid 
     * @param {String} text 
     * @param {String} sender 
     * @param {Object} options 
     */
    m.cMod = (jid, text = '', sender = m.sender, options = {}) => conn.cMod(jid, m, text, sender, options)

    /**
     * Delete this message
     */
    m.delete = () => conn.sendMessage(m.chat, { delete: m.key })

    try {
        conn.saveName(m.sender, m.name)
        conn.pushMessage(m)
        if (m.isGroup) conn.saveName(m.chat)
        if (m.msg && m.mtype == 'protocolMessage') conn.ev.emit('message.delete', m.msg.key)
    } catch (e) {
        console.error(e)
    }
    return m
}

exports.logic = (check, inp, out) => {
    if (inp.length !== out.length) throw new Error('Input and Output must have same length')
    for (let i in inp) if (util.isDeepStrictEqual(check, inp[i])) return out[i]
    return null
}
