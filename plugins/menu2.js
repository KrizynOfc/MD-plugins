let levelling = require('../lib/levelling')
let fs = require('fs')
let path = require('path')
let fetch = require('node-fetch')
let moment = require('moment-timezone')
const defaultMenu = {
  before: `
╭━〔╰ 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐔𝐒𝐄𝐑 ╯〕━✧
┃ *%ucapan*, %name 👋
┗┏━━━━━━━━━━━━━┈ ⳹
┏┤  〔╰ 𝐈𝐍𝐅𝐎 𝐔𝐒𝐄𝐑 ╯〕
┃┗━━━━━━━━━━━━━┈ ⳹
┃◎ 𝚄𝚂𝙴𝚁 : *%name*
┃◎ 𝚁𝙴𝙼𝙰𝙸𝙽𝙸𝙽𝙶 𝙻𝙸𝙼𝙸𝚃 : *%limit* 𝙻𝙸𝙼𝙸𝚃
┃◎ 𝚁𝙾𝙻𝙴 : *%role*
┃◎ 𝙻𝙴𝚅𝙴𝙻 : *%level (%exp / %maxexp)* 
┃◎ 𝚃𝙾𝚃𝙰𝙻 𝚇𝙿 : *%totalexp* 𝚇𝙿
┗┏━━━━━━━━━━━━━┈ ⳹
┏┤   〔╰ 𝐓 𝐎 𝐃 𝐀 𝐘 ╯〕
┃┗━━━━━━━━━━━━━┈ ⳹
┃◎ 𝚃𝙾𝙳𝙰𝚈 : *%week* 
┃◎ 𝙳𝙰𝚃𝙴 : *%date*
┃◎ 𝙳𝙰𝚃𝙴 𝙸𝚂𝙻𝙰𝙼𝙸𝙲 : *%dateIslamic*
┃◎ 𝚃𝙸𝙼𝙴 : *%time*
┗┏━━━━━━━━━━━━━┈ ⳹
┏┤   〔╰ 𝐃𝐀𝐓𝐀𝐁𝐀𝐒𝐄 ╯〕
┃┗━━━━━━━━━━━━━┈ ⳹
┃◎ ʟɪᴍɪᴛ   : *Ⓛ* 
┃◎ ᴘʀᴇᴍɪᴜᴍ : *Ⓟ* 
┃◎ 𝚄𝙿𝚃𝙸𝙼𝙴 : *%uptime*
┃◎ 𝙳𝙰𝚃𝙰𝙱𝙰𝚂𝙴 : %rtotalreg 𝚍𝚊𝚛𝚒 %totalreg 
╰━━━━━━━━━━━━━━┈✧
%readmore`.trimStart(), 
  header: '┏━━〔 ıll %category llı 〕━┈✧\n┃',
  body: '┃⫹⫺ %cmd %islimit %isPremium',
  footer: '┃\n┗━━━━━━━━━━━━┈✧\n', 
  footerText: 'Powered by ᯤ ᴋʀɪᴢʏɴ ᴏꜰᴄ',
  after: `
 ┏━━〔  THANKS TO  〕━┈✧
⫹⫺ Allah SWT
⫹⫺ Orang Tua
⫹⫺ Kesabaran
⫹⫺ Penyemangat
⫹⫺ Nurutomo
⫹⫺ Team Family-md
⫹⫺ KrizynOfc
┗━━━━━━━━━━━━━┈✧
`,
}
let handler = async (m, { conn, usedPrefix: _p, args, command }) => {

  let tags
  let ppmenu = `https://telegra.ph/file/50afa45acab662c8b9307.jpg`
  let teks = `${args[0]}`.toLowerCase()
  let arrayMenu = ['all', 'game', 'rpg', 'xp', 'stiker', 'kerangajaib', 'quotes', 'admin', 'grup', 'premium', 'internet', 'anonymous', 'nulis', 'downloader', 'tools', 'fun', 'database', 'quran', 'audio', 'jadibot', 'info', 'tanpakategori', 'owner']
  if (!arrayMenu.includes(teks)) teks = '404'
  if (teks == 'all') tags = {
    'main': 'UTAMA',
    'game': 'GAME',
    'rpg': 'RPG',
    'xp': 'EXP & LIMIT',
    'sticker': 'STICKER',
    'kerang': 'KERANG AJAIB',
    'quotes': 'QUOTES',
    'group': 'GROUP',
    'premium': 'PREMIUM',
    'internet': 'INTERNET',
    'anonymous': 'ANONYMOUS CHAT',
    'nulis': 'NULIS & LOGI',
    'downloader': 'DOWNLOADER',
    'tools': 'TOOLS',
    'fun': 'FUN',
    'database': 'DATABASE',
    'vote': 'VOTING',
    'absen': 'ABSEN',
    'quran': 'AL - QUR\'AN',
    'audio': 'AUDIO',
    'jadibot': 'JADI BOT',
    'info': 'INFO',
    '': 'NO FOUND',
  }
  if (teks == 'game') tags = {
    'game': 'GAME'
  }
  if (teks == 'xp') tags = {
    'xp': 'EXP & LIMIT'
  }
  if (teks == 'rpg') tags = {
    'rpg': 'RPG'
  }
  if (teks == 'stiker') tags = {
    'sticker': 'STICKER'
  }
  if (teks == 'kerangajaib') tags = {
    'kerang': 'KERANG AJAIB'
  }
  if (teks == 'quotes') tags = {
    'quotes': 'QUOTES'
  }
  if (teks == 'grup') tags = {
    'group': 'GROUP'
  }
  if (teks == 'premium') tags = {
    'premium': 'PREMIUM'
  }
  if (teks == 'internet') tags = {
    'internet': 'INTERNET'
  }
  if (teks == 'anonymous') tags = {
    'anonymous': 'ANONYMOUSE CHAT'
  }
  if (teks == 'nulis') tags = {
    'nulis': 'NULIS & LOGO'
  }
  if (teks == 'downloader') tags = {
    'downloader': 'DOWNLOADER'
  }
  if (teks == 'tools') tags = {
    'tools': 'TOOLS'
  }
  if (teks == 'fun') tags = {
    'fun': 'FUN'
  }
  if (teks == 'database') tags = {
    'database': 'DATABASE'
  }
  if (teks == 'vote') tags = {
    'vote': 'VOTE',
    'absen': 'ABSEN'
  }
  if (teks == 'quran') tags = {
    'quran': 'AL - QUR\'AN'
  }
  if (teks == 'audio') tags = {
    'audio': 'AUDIO'
  }
  if (teks == 'jadibot') tags = {
    'jadibot': 'JADIBOT'
  }
  if (teks == 'info') tags = {
    'info': 'INFO'
  }
  if (teks == 'owner') tags = {
    'owner': 'OWNER',
    'host': 'HOST',
    'advanced': 'ADVANCED'
 }
  if (teks == 'tanpakategori') tags = {
    '': 'NO FOUND'
  }

  //》》》》》》》》》》[ DATABASE USER ]《《《《《《《《《《//
  try {
    let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
    let { exp, limit, age, money, level, role, registered } = global.db.data.users[m.sender]
    let { min, xp, max } = levelling.xpRange(level, global.multiplier)
    let umur = `*${age == '-1' ? 'Belum Daftar*' : age + '* Thn'}`
    let name = registered ? global.db.data.users[m.sender].name : conn.getName(m.sender)

//》》》》》》》》》》[ TIMER ]《《《《《《《《《//
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    const wib = moment.tz('Asia/Jakarta').format('HH:mm:ss') 
    const wibh = moment.tz('Asia/Jakarta').format('HH') 
    const wibm = moment.tz('Asia/Jakarta').format('mm') 
    const wibs = moment.tz('Asia/Jakarta').format('ss') 
    const wit = moment.tz('Asia/Jayapura').format('HH:mm:ss') 
    const wita = moment.tz('Asia/Makassar').format('HH:mm:ss') 
    const wktuwib = `${wibh} H ${wibm} M ${wibs} S` 
    const hariRaya = new Date('January 1, 2023 23:59:59')
    const sekarang = new Date().getTime()
    const Selisih = hariRaya - sekarang
    const jhari = Math.floor( Selisih / (1000 * 60 * 60 * 24));
    const jjam = Math.floor( Selisih % (1000 * 60 * 60 * 24) / (1000 * 60 * 60))
    const mmmenit = Math.floor( Selisih % (1000 * 60 * 60) / (1000 * 60))
    const ddetik = Math.floor( Selisih % (1000 * 60) / 1000)
    const hariRayaramadan = new Date('April 21, 2023 23:59:59')
    const sekarangg = new Date().getTime()
    const lebih = hariRayaramadan - sekarangg
    const harii = Math.floor( lebih / (1000 * 60 * 60 * 24));
    const jamm = Math.floor( lebih % (1000 * 60 * 60 * 24) / (1000 * 60 * 60))
    const menitt = Math.floor( lebih % (1000 * 60 * 60) / (1000 * 60))
    const detikk = Math.floor( lebih % (1000 * 60) / 1000)
    const ultah = new Date('August 18, 2022 23:59:59')
    const sekarat = new Date().getTime() 
    const Kurang = ultah - sekarat
    const ohari = Math.floor( Kurang / (1000 * 60 * 60 * 24));
    const ojam = Math.floor( Kurang % (1000 * 60 * 60 * 24) / (1000 * 60 * 60))
    const onet = Math.floor( Kurang % (1000 * 60 * 60) / (1000 * 60))
    const detek = Math.floor( Kurang % (1000 * 60) / 1000)
    const fkon = { key: { fromMe: false, participant: '0@s.whatsapp.net', ...(m.chat ? { remoteJid: 'status@broadcast' } : {}) }, message: { contactMessage: { displayName: '𝗧 𝗜 𝗠 𝗘 : ' + wktuwib, vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`}}} 
    const ftoko = { 
     key: { 
     fromMe: false, 
     participant: `${m.sender.split`@`[0]}` + '@s.whatsapp.net', 
     remoteJid: 'status@broadcast', 
   }, 
   message: { 
   "productMessage": { 
   "product": { 
   "productImage":{ 
   "mimetype": "image/jpeg", 
   "jpegThumbnail": await (await fetch('https://telegra.ph/file/5dfd34a2044262ab463e8.jp')), 
     }, 
   "title": `${ucapan()}`, 
   "description": '𝗧 𝗜 𝗠 𝗘 : ' + wktuwib, 
   "currencyCode": "US", 
   "priceAmount1000": "100", 
   "retailerId": wm, 
   "productImageCount": 999 
         }, 
   "businessOwnerJid": `${m.sender.split`@`[0]}@s.whatsapp.net` 
   } 
   } 
   } 
    let pe = '```'
    let { premium, premiumTime } = global.db.data.users[m.sender]
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    global.jam = time
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    if (teks == '404') {
      let judul = `${global.ucapan}\nHello mypren👋, ${name} !`.trim()
      const sections = [
      {
        title: 'WELCOME TO LIST MENU',
        rows: [
          { title: '🧸 ⧽ ALL MENU', rowId: `${_p + command} all`, description: "⭜ This Menu to Display to the All Menu"},
          { title: '🎮 ⧽ GAME MENU', rowId: `${_p + command} game`, description: "⭜ This Menu to Display to the Game"},
          { title: '🎰 ⧽ RPG MENU', rowId: `${_p + command} rpg`, description: "⭜ This Menu to Display to the Rpg" },
          { title: '📈 ⧽ XP MENU', rowId: `${_p + command} xp`, description: "⭜ This Menu to Display to the Xp"},
          { title: '🖼 ⧽ STICKER MENU', rowId: `${_p + command} stiker`, description: "⭜ This Menu to Display to the Sticker"},
          { title: '🚀 ⧽ KERANG MENU', rowId: `${_p + command} kerangajaib`, description: "⭜ This Menu to Display to the Kerang"},
          { title: '📚 ⧽ QUOTES MENU', rowId: `${_p + command} quotes`, description: "⭜ This Menu to Display to the Quotes"},
          { title: '🎀 ⧽ GROUP MENU', rowId: `${_p + command} grup`, description: "⭜ This Menu to Display to the Group"},
          { title: '📊 ⧽ PREMIUM MENU', rowId: `${_p + command} premium`, description: "⭜ This Menu to Display to the Premium"},
          { title: '🌐 ⧽ INTERNET MENU', rowId: `${_p + command} internet`, description: "⭜ This Menu to Display to the Internet"},
          { title: '👥 ⧽ ANONYMOUS MENU', rowId: `${_p + command} anonymous`, description: "⭜ This Menu to Display to the Anonymous"},
          { title: '📕 ⧽ NULIS MENU', rowId: `${_p + command} nulis`, description: "⭜ This Menu to Display to the Nulis"},
          { title: '♨️ ⧽ DOWNLOAD MENU', rowId: `${_p + command} downloader`, description: "⭜ This Menu to Display to the Download"},
          { title: '🍻 ⧽ TOOLS MENU', rowId: `${_p + command} tools`, description: "⭜ This Menu to Display to the Tools"},
          { title: '🎲 ⧽ FUN MENU', rowId: `${_p + command} fun`, description: "⭜ This Menu to Display to the Fun"},
          { title: '📂 ⧽ DATABASE MENU', rowId: `${_p + command} database`, description: "⭜ This Menu to Display to the Database"},
          { title: '📥 ⧽ ABSEN MENU', rowId: `${_p + command} vote`, description: "⭜ This Menu to Display to the Absen"},
          { title: "💌 ⧽ AL-QUR\'AN MENU", rowId: `${_p + command} quran`, description: "⭜ This Menu to Display to the Alquran"},
          { title: '🎵 ⧽ AUDIO MENU', rowId: `${_p + command} audio`, description: "⭜ This Menu to Display to the Audio"},
          { title: '🤖 ⧽ BOT MENU', rowId: `${_p + command} jadibot`, description: "⭜ This Menu to Display to the Jadi Bot"},
          { title: '🗯 ⧽ INFO MENU', rowId: `${_p +command} info`, description: "⭜ This Menu to Display to the Info"},
          { title: '🤡 ⧽ OWNER MENU', rowId: `${_p + command} owner`, description: "⭜ This Menu to Display to the Owner"},
          { title: '💢 ⧽ NO FOUND', rowId: `${_p + command} tanpakategori`, description: "⭜ This Menu to Display to the No Found"},
        ]
      }
    ]
    
      const listMessage = {
      text: `╭━━━━━━┈┈┈━━━━━━╮ 
┃            〔 ıll T O D A Y llı 〕
┃━━━━━━┈┈┈━━━━━━╯
┃⌬ Day  : *${week}*
┃⌬ Time : *${time}*
┃⌬ Active : *${uptime}*
┃⌬ Date : *${date}*
┗┏━━━━━━━━━━━━┈✧
┏┤     〔 ıll INFO USER llı 〕
┃┗━━━━━━━━━━━━┈✧
┃⌬ Nama : *${name}*
┃⌬ Limit : *${limit} Limit*
┃⌬ Role : *${role}*
┃⌬ Level : *${level}*
┃⌬ Premium : *${premium ? `${conn.msToDate(premiumTime - new Date() * 1)}` : 'Free'}*
┃⌬ Total User : *${rtotalreg} dari ${totalreg}*
╰━━━━━━┈┈┈━━━━━━╯ `,
      footer: "📮 Silahkan Pilih Select dibawah ini",
      title: judul,
      buttonText: "Klik Disini",
      sections
    }
    return conn.sendMessage(m.chat, listMessage, { quoted: m, mentions: await conn.parseMention(judul), contextInfo: { forwardingScore: 99999, isForwarded: true }})
    
    }

    let groups = {}
    for (let tag in tags) {
      groups[tag] = []
      for (let plugin of help)
        if (plugin.tags && plugin.tags.includes(tag))
          if (plugin.help) groups[tag].push(plugin)
    }
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Dipersembahkan oleh https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%islimit/g, menu.limit ? '(Ⓛ)' : '')
                .replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      ucapan: global.ucapan,
      p: _p, uptime, muptime,
      me: conn.user.name,
      npmname: package.name,
      npmdesc: package.description,
      version: package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp <= 0 ? `Siap untuk *${_p}levelup*` : `${max - exp} XP lagi untuk levelup`,
      github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]',
      level, limit, name, umur, money, age, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    /*await conn.send3TemplateButtonImg(m.chat, `${global.ppmenu}`, text.trim(),  'NOTICE : Most Device masih dalam tahap pengembang\nJika menemukan bug atau sejenis nya lapor ke owner', `🍬 OWNER`, `${_p}owner`, `🍫 DONASI`, `${_p}donasi`, `🍭 CREDIT`, `${_p}tqto`)*/
   /*conn.sendHydrated(m.chat, `${global.ppmenu}`, text.trim(), '📮 NOTICE : Most Device masih dalam tahap pengembang\nJika menemukan bug atau sejenis nya lapor ke owner', null, `https://lynk.id/kri.com`, `WEBSITE`, `https://saweria.co/Kricom`, `SAWERIA`, [
      [`DONASI`, `.donasi`],
      [`SEWA`, `.sewa`],
      [`STATUS`, `.stat`]
    ], m)*/
    //============= BUTTON FAKE REPLY ==========//
    await conn.send3ButtonImg(m.chat, await (await fetch(ppmenu)).buffer(), text.trim(), wm, 'Donasi', '.donasi', 'Owner', '.owner', 'Status', '.stat', m, { 
     quoted: ftoko, 
     contextInfo: { forwardingScore: 99999, isForwarded: true, 
         externalAdReply: { 
             title: '✧ PRAMESH DEVICE Created By KrizynOfc', 
             body: `${pickRandom(['udah makan belum kak?', 'udh mandi belum kak?', 'Semangat ya kak!', 'Jangan begadang mulu ya!', 'jangan spam ya kak!', 'Jangan lupa donasi yak kak! >.<', 'Jaga kesehatan yaw kak!', 'Jangan lupa makan!', 'Jangan lupa istirahat yak! >.<', 'I Love you kak >.< 💗✨', 'Pr nya udh belum kak?', 'Jangan kebanyakan main hp yk! nanti sakit :‹'])}`, 
             description: `${pickRandom(['udah makan belum kak?', 'udh mandi belum kak?', 'Semangat ya kak!', 'Jangan begadang mulu ya!', 'jangan spam ya kak!', 'Jangan lupa donasi yak kak! >.<', 'Jaga kesehatan yaw kak!', 'Jangan lupa makan!', 'Jangan lupa istirahat yak! >.<', 'I Love you kak >.< 💗✨', 'Pr nya udh belum kak?', 'Jangan kebanyakan main hp yk! nanti sakit :‹'])}`, 
             mediaType: 2, 
           thumbnail: await (await fetch('https://telegra.ph/file/8aa7803c5049270561291.jpg')),
          mediaUrl: `${pickRandom([`https://www.instagram.com/mhdfakri_`, `https://youtube.com/c/hokenbeusz`])}` 
         } 
      } 
     })
    
    //*============ BUTTON TEMPLATE ===========*//
    /*let url = `https://telegra.ph/file/50afa45acab662c8b9307.jpg`.trim()
    let res = await fetch(url)
    let buffer = await res.buffer()
    let message = await prepareWAMessageMedia({ image: buffer }, { upload: conn.waUploadToServer })
                const template = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
                    templateMessage: {
                        hydratedTemplate: {
                            imageMessage: message.imageMessage,
                            hydratedContentText: text.trim(),
                            hydratedFooterText:'✧ MOST DEVICE Created By KrizynOfc',
                            hydratedButtons: [{
                                urlButton: {
                                    displayText: 'WEBSITE',
                                    url: 'https://lynk.id/kri.com'
                                }
                            }, {
                              urlButton: {
                                    displayText: 'SAWERIA',
                                    url: 'https://saweria.co/Kricom'
                                }
                            }, {
                                quickReplyButton: {
                                    displayText: 'DONASI',
                                    id: '/donasi'
                                }
                            }, {
                                quickReplyButton: {
                                    displayText: 'SEWA',
                                    id: '/sewa'
                                }  
                            }, {
                                quickReplyButton: {
                                    displayText: 'STATUS',
                                    id: '/stat'
                                }
                            }]
                        }
                    }
                }), { userJid: m.chat, quoted: m })
                conn.relayMessage(m.chat, template.message, { messageId: template.key.id })*/
  } catch (e) {
    conn.reply(m.chat, 'Maaf, menu sedang error', m)
    throw e
  }
}
handler.help = ['menu', 'help', '?']
handler.tags = ['main']
handler.command = /^(m(enu)?|help|\?)$/i
handler.register = true
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null
handler.exp = 3

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
function ucapan() {
  const time = moment.tz('Asia/Jakarta').format('HH')
  res = "Selamat dinihari🌓"
  if (time >= 4) {
    res = "Selamat pagi🌥"
  }
  if (time > 10) {
    res = "Selamat siang🌞"
  }
  if (time >= 15) {
    res = "Selamat sore🌤"
  }
  if (time >= 18) {
    res = "Selamat malam🌙"
  }
  return res
}
