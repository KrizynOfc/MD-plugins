let { MessageType } = require('@adiwajshing/baileys-md')
const potion = 5000
const Spotion = 2500
const limit = 50000
const Slimit = 10000
const Bdiamond = 35000
const Sdiamond = 20000
const Bcommon = 4500
const Scommon = 2000
const Suncommon = 6000
const Buncommon = 4500
const Bmythic = 10000
const Smythic = 5000
const Blegendary = 20000
const Slegendary = 10000
const Bfish = 85000
const Baxe = 85000
const Semerald = 35000
const Sgold = 30000
const Bsampah = 50
const Ssampah = 30
let handler  = async (m, { conn, command, args, usedPrefix, DevMode }) => {
    const _armor = global.db.data.users[m.sender].armor
    const _sword = global.db.data.users[m.sender].sword
    const armor = (_armor == 0 ? 20000 : '' || _armor == 1 ? 49999 : '' || _armor == 2 ? 99999 : '' || _armor == 3 ? 149999 : '' || _armor == 4 ? 299999 : '')
    const sword = (_sword == 0 ? 20000 : '' || _sword == 1 ? 49999 : '' || _sword == 2 ? 99999 : '' || _sword == 3 ? 149999 : '' || _sword == 4 ? 299999 : '')
    let type = (args[0] || '').toLowerCase()
    let _type = (args[1] || '').toLowerCase()
    let jualbeli = (args[0] || '').toLowerCase()
    const Kchat = `
Contoh penggunaan: *${usedPrefix}shop buy potion 1*\n\n
List Barang:\n${readMore}\n
*Barang   |  Harga beli*\n
Potion:       ${potion}
Limit:.        ${limit}
Diamond:     ${Bdiamond}
Common:     ${Bcommon}
Uncommon:  ${Buncommon}
Mythic:     ${Bmythic}
Fishingrod:  ${Bfish}
Pickaxe:    ${Baxe}
Legendary: ${Blegendary}
Sampah:     ${Bsampah}
Armor:       ${armor}
Sword:       ${sword}\n\n
*Barang   | Harga Jual*\n
Potion:       ${Spotion}
Limit:          ${Slimit}
Diamond:     ${Sdiamond}
Common:     ${Scommon}
Uncommon:  ${Suncommon}
Mythic:     ${Smythic}
Emerald:    ${Semerald}
Gold:       ${Sgold}
Legendary: ${Slegendary}
Sampah:     ${Ssampah}\n\n
`.trim()
    try {
        if (/shop|toko/i.test(command)) {
            const count = args[2] && args[2].length > 0 ? Math.min(99999999, Math.max(parseInt(args[2]), 1)) : !args[2] || args.length < 4 ? 1 :Math.min(1, count)
            const sampah = global.db.data.users[m.sender].sampah
            switch (jualbeli) {
            case 'buy':
                switch (_type) {
                    case 'potion':
                            if (global.db.data.users[m.sender].money >= potion * count) {
                                global.db.data.users[m.sender].money -= potion * count
                                global.db.data.users[m.sender].potion += count * 1
                                conn.reply(m.chat, `Succes membeli ${count} Potion dengan harga ${potion * count} money\n\nGunakan potion dengan ketik: *${usedPrefix}use potion <jumlah>*`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Potion dengan harga ${potion * count} money`,)
                        break
                    case 'limit':
                             if (global.db.data.users[m.sender].exp >= limit * count) {
                             	global.db.data.users[m.sender].exp -= limit * count
                                 global.db.data.users[m.sender].limit += count * 1
                                 conn.reply(m.chat, `Sukses membeli ${count} limit dengan harga ${limit * count} exp`, m)
                              } else conn.reply(m.chat, `Exp kamu tidak cukup untuk membeli ${count} limit dengan harga ${limit * count} exp`, m)
                           break
                    case 'diamond':
                            if (global.db.data.users[m.sender].money >= Bdiamond * count) {
                                global.db.data.users[m.sender].diamond += count * 1
                                global.db.data.users[m.sender].money -= Bdiamond * count
                                conn.reply(m.chat, `Succes membeli ${count} Diamond dengan harga ${Bdiamond * count} money`, m)
                            } else conn.reply(m.chat, `Money anda tidak cukup`, m)
                        
                        break
                      case 'fishingrod':
                            if (count > 1) return conn.reply(m.chat, 'Hanya Dapat membeli 1 Fishingrod!', m)
                            if (global.db.data.users[m.sender].fishingrod == 1) return conn.reply(m.chat, 'Anda Sudah Memiliki fishingrod Di inventory anda!\nCek Dengan cara *#inv*', m)
                            if (global.db.data.users[m.sender].money >= Bfish * 1) {
                                global.db.data.users[m.sender].fishingrod += 1
                                global.db.data.users[m.sender].fishingroddurability = 100
                                global.db.data.users[m.sender].money -= Bfish * 1
                                conn.reply(m.chat, `Succes membeli 1 Fishingrod dengan harga ${Bfish * 1} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli 1 Fishingrod dengan harga ${Bfish * 1} money\n\nAmbil gaji dengan cara ketik: *${usedPrefix}gaji*\nAtau ambil bonus mingguan & bulanan dengan cara *#weekly* dan *#monthly*`, m)
                        
                        break 
                    case 'pickaxe':
                            if (count > 1) return conn.reply(m.chat, 'Hanya Dapat membeli 1 Pickaxe!', m)
                            if (global.db.data.users[m.sender].pickaxe == 1) return conn.reply(m.chat, 'Anda Sudah Memiliki pickaxe Di inventory anda!\nCek Dengan cara *#inv*', m)
                            if (global.db.data.users[m.sender].money >= Baxe * 1) {
                                global.db.data.users[m.sender].pickaxe += 1
                                global.db.data.users[m.sender].pickaxedurability = 100
                                global.db.data.users[m.sender].money -= Baxe * 1
                                conn.reply(m.chat, `Succes membeli 1 Pickaxe dengan harga ${Baxe * 1} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli 1 Pickaxe dengan harga ${Baxe * 1} money\n\nAmbil gaji dengan cara ketik: *${usedPrefix}gaji*\nAtau ambil bonus mingguan & bulanan dengan cara *#weekly* dan *#monthly*`, m)
                        
                        break    
                    case 'common':
                            if (global.db.data.users[m.sender].money >= Bcommon * count) {
                                global.db.data.users[m.sender].common += count * 1
                                global.db.data.users[m.sender].money -= Bcommon * count
                                conn.reply(m.chat, `Succes membeli ${count} Common crate dengan harga ${Bcommon * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Common crate dengan harga ${Bcommon * count} money\n\nBuka crate dengan ketik: *${usedPrefix}open common*`, m)
                        
                        break
                    case 'uncommon':
                            if (global.db.data.users[m.sender].money >= Buncommon * count) {
                                global.db.data.users[m.sender].uncommon += count * 1
                                global.db.data.users[m.sender].money -= Buncommon * count
                                conn.reply(m.chat, `Succes membeli ${count} Uncommon crate dengan harga ${Buncommon * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Uncommon crate dengan harga ${Buncommon * count} money\n\nBuka crate dengan ketik: *${usedPrefix}open uncommon*`, m)
                        
                        break
                    case 'mythic':
                            if (global.db.data.users[m.sender].money >= Bmythic * count) {
                                    global.db.data.users[m.sender].mythic += count * 1
                                global.db.data.users[m.sender].money -= Bmythic * count
                                conn.reply(m.chat, `Succes membeli ${count} Mythic crate dengan harga ${Bmythic * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Mythic crate dengan harga ${Bmythic* count} money\n\nBuka crate dengan ketik: *${usedPrefix}open mythic*`, m)
                        
                        break
                    case 'legendary':
                            if (global.db.data.users[m.sender].money >= Blegendary * count) {
                                global.db.data.users[m.sender].legendary += count * 1
                                global.db.data.users[m.sender].money -= Blegendary * count
                                conn.reply(m.chat, `Succes membeli ${count} Legendary crate dengan harga ${Blegendary * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Legendary crate dengan harga ${Blegendary * count} money\n\nBuka crate dengan ketik: *${usedPrefix}open legendary*`, m)
                        
                        break
                    case 'sampah':
                            if (global.db.data.users[m.sender].money >= Bsampah * count) {
                                global.db.data.users[m.sender].sampah += count * 1
                                global.db.data.users[m.sender].money -= Bsampah * count
                                conn.reply(m.chat, `Succes membeli ${count} Sampah dengan harga ${Bsampah * count} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Sampah dengan harga ${Bsampah * count} money`.trim(), m)
                        
                        break
                    case 'sword':
                            if (global.db.data.users[m.sender].sword == 5) return conn.reply(m.chat, 'swordmu sudah *Level Max*', m)
                            if (global.db.data.users[m.sender].money > sword) {
                                global.db.data.users[m.sender].sword += 1
                                global.db.data.users[m.sender].money -= sword * 1
                                conn.reply(m.chat, `Succes membeli sword seharga ${sword} money` ,m)
                            } else conn.reply(m.chat, `uang mu tidak cukup untuk membeli sword seharga ${sword} money`, m)
                     
                        break
                    case 'armor':
                            if (global.db.data.users[m.sender].armor == 5) return conn.reply(m.chat, 'Armormu sudah *Level Max*', m)
                            if (global.db.data.users[m.sender].money > armor) {
                                global.db.data.users[m.sender].armor += 1
                                global.db.data.users[m.sender].money -= armor * 1
                                conn.reply(m.chat, `Succes membeli armor seharga ${armor} money` ,m)
                            } else conn.reply(m.chat, `uang mu tidak cukup untuk membeli armor seharga ${armor} money`, m)
                        
                        break
                    case 'budak':
                            if (global.db.data.users[m.sender].budak == 5) return conn.reply(m.chat, 'Budakmu sudah *Level Max*', m)
                            if (global.db.data.users[m.sender].money > budak) {
                                global.db.data.users[m.sender].budak += 1
                                global.db.data.users[m.sender].money -= budak * 1
                                conn.reply(m.chat, `Succes membeli budak seharga ${budak} money` ,m)
                            } else conn.reply(m.chat, `uang mu tidak cukup untuk membeli budak seharga ${budak} money`, m)
                        
                        break
                    default:
                        return conn.reply(m.chat, Kchat, m)
                }
                break
            case 'sell': 
                switch (_type) {
                    case 'potion':
                        if (global.db.data.users[m.sender].potion >= count * 1) {
                            global.db.data.users[m.sender].money += Spotion * count
                            global.db.data.users[m.sender].potion -= count * 1
                            conn.reply(m.chat, `Succes menjual ${count} Potion dengan harga ${Spotion * count} money`.trim(), m)
                        } else conn.reply(m.chat, `Potion kamu tidak cukup`.trim(), m)
                        break
                   case 'limit':
                       if (global.db.data.users[m.sender].limit >= count * 1) {
                            global.db.data.users[m.sender].exp += Slimit * count
                            global.db.data.users[m.sender].limit -= count * 1
                            conn.reply(m.chat, `Sukses menjual ${count} limit dengan harga ${Slimit * count} exp`.trim(), m)
                         } else conn.reply(m.chat, `Limit kamu tidak cukup`.trim(), m)
                         break
                    case 'common':
                        if (global.db.data.users[m.sender].common >= count * 1) {
                            global.db.data.users[m.sender].money += Scommon * count
                            global.db.data.users[m.sender].common -= count * 1
                            conn.reply(m.chat, `Succes menjual ${count} Common Crate dengan harga ${Scommon * count} money`.trim(), m)
                        } else conn.reply(m.chat, `Common Crate kamu tidak cukup`.trim(), m)
                        break
                    case 'uncommon':
                        if (global.db.data.users[m.sender].uncommon >= count * 1) {
                            global.db.data.users[m.sender].money += Suncommon * count
                            global.db.data.users[m.sender].uncommon -= count * 1
                            conn.reply(m.chat, `Succes menjual ${count} Uncommon Crate dengan harga ${Suncommon * count} money`.trim(), m)
                        } else conn.reply(m.chat, `Uncommon Crate kamu tidak cukup`.trim(), m)
                        break
                    case 'mythic':
                        if (global.db.data.users[m.sender].mythic >= count * 1) {
                            global.db.data.users[m.sender].money += Smythic * count
                            global.db.data.users[m.sender].mythic -= count * 1
                            conn.reply(m.chat, `Succes menjual ${count} Mythic Crate dengan harga ${Smythic * count} money`.trim(), m)
                        } else conn.reply(m.chat, `Mythic Crate kamu tidak cukup`.trim(), m)
                        break
                    case 'legendary':
                        if (global.db.data.users[m.sender].legendary >= count * 1) {
                            global.db.data.users[m.sender].money += Slegendary * count
                            global.db.data.users[m.sender].legendary -= count * 1
                            conn.reply(m.chat, `Succes menjual ${count} Legendary Crate dengan harga ${Slegendary * count} money`.trim(), m)
                        } else conn.reply(m.chat, `Legendary Crate kamu tidak cukup`.trim(), m)
                        break
                    case 'sampah':
                        if (global.db.data.users[m.sender].sampah >= count * 1) {
                            global.db.data.users[m.sender].sampah -= count * 1
                            global.db.data.users[m.sender].money += Ssampah * count
                            conn.reply(m.chat, `Succes menjual ${count} sampah, dan anda mendapatkan ${Ssampah * count} money`, m)
                        } else conn.reply(m.chat, `Sampah anda tidak cukup`, m)
                        break
                    case 'diamond':
                        if (global.db.data.users[m.sender].diamond >= count * 1) {
                            global.db.data.users[m.sender].diamond -= count * 1
                            global.db.data.users[m.sender].money += Sdiamond * count
                            conn.reply(m.chat, `Succes menjual ${count} Diamond, dan anda mendapatkan ${Sdiamond * count} money`, m)
                        } else conn.reply(m.chat, `Diamond anda tidak cukup`, m)
                        break
                      case 'emerald':
                        if (global.db.data.users[m.sender].emerald >= count * 1) {
                            global.db.data.users[m.sender].emerald -= count * 1
                            global.db.data.users[m.sender].money += Semerald * count
                            conn.reply(m.chat, `Succes menjual ${count} Emerald, dan anda mendapatkan ${Semerald * count} money`, m)
                        } else conn.reply(m.chat, `Emerald anda tidak cukup`, m)
                        break 
                     case 'gold':
                        if (global.db.data.users[m.sender].gold >= count * 1) {
                            global.db.data.users[m.sender].gold -= count * 1
                            global.db.data.users[m.sender].money += Sgold * count
                            conn.reply(m.chat, `Succes menjual ${count} Gold, dan anda mendapatkan ${Sgold * count} money`, m)
                        } else conn.reply(m.chat, `Gold anda tidak cukup`, m)
                        break 
                    default:
                        return conn.reply(m.chat, Kchat, m)
                }
                break
            default:
                return conn.reply(m.chat, Kchat, m)
            }
        } else if (/beli|buy/i.test(command)) {
            const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count)
            switch (type) {
                case 'potion':
                        if (global.db.data.users[m.sender].money >= potion * count) {
                            global.db.data.users[m.sender].money -= potion * count
                            global.db.data.users[m.sender].potion += count * 1
                            conn.reply(m.chat, `Succes membeli ${count} Potion dengan harga ${potion * count} money\n\nGunakan potion dengan ketik: *${usedPrefix}use potion <jumlah>*`, m)
                        } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Potion dengan harga ${potion * count} money`,m)
                    
                    break
               case 'limit':
                        if (global.db.data.users[m.sender].exp >= limit * count) {
                        	global.db.data.users[m.sender].exp -= limit * count
                            global.db.data.users[m.sender].limit += count * 1
                            conn.reply(m.chat, `Sukses membeli ${count} limit dengan harga ${limit * count} exp`, m)
                         } else conn.reply(m.chat, `Exp kamu tidak cukup untuk membeli ${count} limit dengan harga ${limit * count} exp`, m)
                         break
                case 'diamond':
                        if (global.db.data.users[m.sender].money >= Bdiamond * count) {
                            global.db.data.users[m.sender].diamond += count * 1
                            global.db.data.users[m.sender].money -= Bdiamond * count
                            conn.reply(m.chat, `Succes membeli ${count} Diamond dengan harga ${Bdiamond * count} money`, m)
                        } else conn.reply(m.chat, `Money anda tidak cukup`, m)
                    
                    break
                   case 'fishingrod':
                            if (count > 1) return conn.reply(m.chat, 'Hanya Dapat membeli 1 Fishingrod!', m)
                            if (global.db.data.users[m.sender].fishingrod == 1) return conn.reply(m.chat, 'Anda Sudah Memiliki fishingrod Di inventory anda!\nCek Dengan cara *#inv*', m)
                            if (global.db.data.users[m.sender].money >= Bfish * 1) {
                                global.db.data.users[m.sender].fishingrod += 1
                                global.db.data.users[m.sender].fishingroddurability = 100
                                global.db.data.users[m.sender].money -= Bfish * 1
                                conn.reply(m.chat, `Succes membeli 1 Fishingrod dengan harga ${Bfish * 1} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli 1 Fishingrod dengan harga ${Bfish * 1} money\n\nAmbil gaji dengan cara ketik: *${usedPrefix}gaji*\nAtau ambil bonus mingguan & bulanan dengan cara *#weekly* dan *#monthly*`, m)
                        
                        break 
                     case 'pickaxe':
                            if (count > 1) return conn.reply(m.chat, 'Hanya Dapat membeli 1 Pickaxe!', m)
                            if (global.db.data.users[m.sender].pickaxe == 1) return conn.reply(m.chat, 'Anda Sudah Memiliki pickaxe Di inventory anda!\nCek Dengan cara *#inv*', m)
                            if (global.db.data.users[m.sender].money >= Baxe * 1) {
                                global.db.data.users[m.sender].pickaxe += 1
                                global.db.data.users[m.sender].pickaxedurability = 100
                                global.db.data.users[m.sender].money -= Baxe * 1
                                conn.reply(m.chat, `Succes membeli 1 Pickaxe dengan harga ${Baxe * 1} money`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli 1 Pickaxe dengan harga ${Baxe * 1} money\n\nAmbil gaji dengan cara ketik: *${usedPrefix}gaji*\nAtau ambil bonus mingguan & bulanan dengan cara *#weekly* dan *#monthly*`, m)
                        
                        break 
                case 'common':
                        if (global.db.data.users[m.sender].money >= Bcommon * count) {
                            global.db.data.users[m.sender].common += count * 1
                            global.db.data.users[m.sender].money -= Bcommon * count
                            conn.reply(m.chat, `Succes membeli ${count} Common crate dengan harga ${Bcommon * count} money`, m)
                        } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Common crate dengan harga ${Bcommon * count} money\n\nBuka crate dengan ketik: *${usedPrefix}open common*`, m)
                    
                    break
                case 'uncommon':
                        if (global.db.data.users[m.sender].money >= Buncommon * count) {
                            global.db.data.users[m.sender].uncommon += count * 1
                            global.db.data.users[m.sender].money -= Buncommon * count
                            conn.reply(m.chat, `Succes membeli ${count} Uncommon crate dengan harga ${Buncommon * count} money`, m)
                        } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Uncommon crate dengan harga ${Buncommon * count} money\n\nBuka crate dengan ketik: *${usedPrefix}open uncommon*`, m)
                   
                    break
                case 'mythic':
                        if (global.db.data.users[m.sender].money >= Bmythic * count) {
                            global.db.data.users[m.sender].mythic += count * 1
                            global.db.data.users[m.sender].money -= Bmythic * count
                            conn.reply(m.chat, `Succes membeli ${count} Mythic crate dengan harga ${Bmythic * count} money`, m)
                        } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Mythic crate dengan harga ${Bmythic* count} money\n\nBuka crate dengan ketik: *${usedPrefix}open mythic*`, m)
                    
                    break
                case 'legendary':
                        if (global.db.data.users[m.sender].money >= Blegendary * count) {
                            global.db.data.users[m.sender].legendary += count * 1
                            global.db.data.users[m.sender].money -= Blegendary * count
                            conn.reply(m.chat, `Succes membeli ${count} Legendary crate dengan harga ${Blegendary * count} money`, m)
                        } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Legendary crate dengan harga ${Blegendary * count} money\n\nBuka crate dengan ketik: *${usedPrefix}open legendary*`, m)
                    
                    break
                case 'sampah':
                        if (global.db.data.users[m.sender].money >= Bsampah * count) {
                            global.db.data.users[m.sender].sampah += count * 1
                            global.db.data.users[m.sender].money -= Bsampah * count
                            conn.reply(m.chat, `Succes membeli ${count} Sampah dengan harga ${Bsampah * count} money`, m)
                        } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Sampah dengan harga ${Bsampah * count} money`.trim(), m)
                    
                    break
                case 'sword':
                        if (global.db.data.users[m.sender].sword == 5) return conn.reply(m.chat, 'swordmu sudah *Level Max*', m)
                        if (global.db.data.users[m.sender].money > sword * 1) {
                            global.db.data.users[m.sender].sword += 1
                            global.db.data.users[m.sender].money -= sword * 1
                            conn.reply(m.chat, `Succes membeli armor seharga ${sword} money` ,m)
                          
                        } else conn.reply(m.chat, `uang mu tidak cukup untuk membeli sword seharga ${sword} money`, m)
                    
                    break
                case 'armor':
                        if (global.db.data.users[m.sender].armor == 5) return conn.reply(m.chat, 'Armormu sudah *Level Max*', m)
                        if (global.db.data.users[m.sender].money > armor * 1) {
                            global.db.data.users[m.sender].armor += 1
                            global.db.data.users[m.sender].money -= armor * 1
                            conn.reply(m.chat, `Succes membeli armor seharga ${armor} money` ,m)
                          
                        } else conn.reply(m.chat, `uang mu tidak cukup untuk membeli armor seharga ${armor} money`, m)
                    
                    break
                case 'budak':
                        if (global.db.data.users[m.sender].budak == 5) return conn.reply(m.chat, 'Budakmu sudah *Level Max*', m)
                        if (global.db.data.users[m.sender].money > budak * 1) {
                            global.db.data.users[m.sender].budak += 1
                            global.db.data.users[m.sender].money -= budak * 1
                            conn.reply(m.chat, `Succes membeli budak seharga ${budak} money` ,m)
                          
                        } else conn.reply(m.chat, `uang mu tidak cukup untuk membeli budak seharga ${budak} money`, m)
                    
                    break
                default:
                    return conn.reply(m.chat, Kchat, m)
            }
        } else if (/sell|jual|/i.test(command)) {
            const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count)
            switch (type) {
                case 'potion':
                    if (global.db.data.users[m.sender].potion >= count * 1) {
                        global.db.data.users[m.sender].money += Spotion * count
                        global.db.data.users[m.sender].potion -= count * 1
                        conn.reply(m.chat, `Succes menjual ${count} Potion dengan harga ${Spotion * count} money`.trim(), m)
                    } else conn.reply(m.chat, `Potion kamu tidak cukup`.trim(), m)
                    break
                case 'limit':
                    if (global.db.data.users[m.sender].limit >= count * 1) {
                        global.db.data.users[m.sender].exp += Slimit * count
                        global.db.data.users[m.sender].limit -= count * 1
                        conn.reply(m.chat, `Succes menjual ${count} limit dengan harga ${Slimit * count} exp`.trim(), m)
                    } else conn.reply(m.chat, `Limit kamu tidak cukup`.trim(), m)
                    break
                case 'common':
                    if (global.db.data.users[m.sender].common >= count * 1) {
                        global.db.data.users[m.sender].money += Scommon * count
                        global.db.data.users[m.sender].common -= count * 1
                        conn.reply(m.chat, `Succes menjual ${count} Common Crate dengan harga ${Scommon * count} money`.trim(), m)
                    } else conn.reply(m.chat, `Common Crate kamu tidak cukup`.trim(), m)
                    break
                case 'uncommon':
                    if (global.db.data.users[m.sender].uncommon >= count * 1) {
                        global.db.data.users[m.sender].money += Suncommon * count
                        global.db.data.users[m.sender].uncommon -= count * 1
                        conn.reply(m.chat, `Succes menjual ${count} Uncommon Crate dengan harga ${Suncommon * count} money`.trim(), m)
                    } else conn.reply(m.chat, `Uncommon Crate kamu tidak cukup`.trim(), m)
                    break
                case 'mythic':
                    if (global.db.data.users[m.sender].mythic >= count * 1) {
                        global.db.data.users[m.sender].money += Smythic * count
                        global.db.data.users[m.sender].mythic -= count * 1
                        conn.reply(m.chat, `Succes menjual ${count} Mythic Crate dengan harga ${Smythic * count} money`.trim(), m)
                    } else conn.reply(m.chat, `Mythic Crate kamu tidak cukup`.trim(), m)
                    break
                case 'legendary':
                    if (global.db.data.users[m.sender].legendary >= count * 1) {
                        global.db.data.users[m.sender].money += Slegendary * count
                        global.db.data.users[m.sender].legendary -= count * 1
                        conn.reply(m.chat, `Succes menjual ${count} Legendary Crate dengan harga ${Slegendary * count} money`.trim(), m)
                    } else conn.reply(m.chat, `Legendary Crate kamu tidak cukup`.trim(), m)
                    break
                case 'sampah':
                    if (global.db.data.users[m.sender].sampah >= count * 1) {
                        global.db.data.users[m.sender].sampah -= count * 1
                        global.db.data.users[m.sender].money += Ssampah * count
                        conn.reply(m.chat, `Succes menjual ${count} sampah, dan anda mendapatkan ${Ssampah * count} money`.trim(), m)
                    } else conn.reply(m.chat, `Sampah anda tidak cukup`.trim(), m)
                    break
                case 'diamond':
                    if (global.db.data.users[m.sender].diamond >= count * 1) {
                        global.db.data.users[m.sender].diamond -= count * 1
                        global.db.data.users[m.sender].money += Sdiamond * count
                        conn.reply(m.chat, `Succes menjual ${count} Diamond, dan anda mendapatkan ${Sdiamond * count} money`, m)
                    } else conn.reply(m.chat, `Diamond anda tidak cukup`, m)
                    break
                  case 'emerald':
                        if (global.db.data.users[m.sender].emerald >= count * 1) {
                            global.db.data.users[m.sender].emerald -= count * 1
                            global.db.data.users[m.sender].money += Semerald * count
                            conn.reply(m.chat, `Succes menjual ${count} Emerald, dan anda mendapatkan ${Semerald * count} money`, m)
                        } else conn.reply(m.chat, `Emerald anda tidak cukup`, m)
                        break 
                     case 'gold':
                        if (global.db.data.users[m.sender].gold >= count * 1) {
                            global.db.data.users[m.sender].gold -= count * 1
                            global.db.data.users[m.sender].money += Sgold * count
                            conn.reply(m.chat, `Succes menjual ${count} Gold, dan anda mendapatkan ${Sgold * count} money`, m)
                        } else conn.reply(m.chat, `Gold anda tidak cukup`, m)
                        break  
                default:
                    return conn.reply(m.chat, Kchat, m)
            }
        }
    } catch (e) {
        conn.reply(m.chat, Kchat, m)
        console.log(e)
        if (DevMode) {
            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                conn.sendMessage(jid, 'shop.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', MessageType.text)
            }
        }
    }
}

handler.help = ['shop <sell|buy> <args>', 'toko <sell|buy> <args>']
handler.tags = ['rpg']
handler.register = true
    
handler.command = /^(shop|toko|buy|beli|sell|jual)$/i
module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)