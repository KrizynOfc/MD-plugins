let handler = async (m, { isOwner, text, isAdmin }) => {
  let who
  if (m.isGroup) {
    if (!(isAdmin || isOwner)) {
      global.dfail('admin', m, conn)
      throw false
    }
    if (isOwner) who = m.mentionedJid ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.chat
    who = m.chat
  } else {
    if (!isOwner) {
      global.dfail('owner', m, conn)
      throw false
    }
    who = text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.chat
  }
  try {
    if (who.endsWith('g.us')) global.db.data.chats[who].isBanned = false
    else global.db.data.users[who].banned = false
    m.reply(`Done Unban!\n${await conn.user.name} aktif dichat ${await conn.getName(who) == undefined ? 'ini' : await conn.getName(who)}.`)
  } catch (e) {
    throw `nomor tidak ada didatabase!`
  }
}
handler.help = ['unban']
handler.tags = ['owner', 'group']
handler.command = /^unban(chat)?$/i

module.exports = handler
