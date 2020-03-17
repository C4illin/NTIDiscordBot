const Discord = require("discord.js")
const config = require("./config.json")

const bot = new Discord.Client()
const prefix = "!"
const botToken = config.discord

// Invite: https://discordapp.com/oauth2/authorize?client_id=689153258648109151&scope=bot&permissions=268445696

bot.on("ready", () => {
  bot.user.setActivity('!elev', { type: 'LISTENING' })
  console.log("Discord.js Connected")
})

const klasser = ["1A", "1B", "1C", "1D", "1E", "2A", "2B", "2C", "2D", "2E", "3A", "3B", "3C", "3D", "3E"]

bot.on("message", (message) => {
  if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return

  var split = message.content.substring(prefix.length).split(" ")
  switch (split[0].toLowerCase()) {
  case "h":
  case "help":
    message.channel.send({
      embed: new Discord.MessageEmbed()
        .addField("Allmäna kommandon:", "!help - visar denna meny\n!elev - bli elev\n!klass [klass] - gå med i en klass")
        .setColor("0x111111")
    })
    break
  case "klass":
    var klass = split[1].toUpperCase()
    message.delete()
    if (klasser.includes(klass)){
      if (message.member.roles.cache.some(role => role.name !== 'Elev')) {
        const elev = message.guild.roles.cache.find(role => role.name === 'Elev')
        message.member.roles.add(elev)
      }

      if (message.member.roles.cache.some(role => klasser.includes(role.name))) {
        message.reply("du är redan med i en klass")
          .then(msg => {
            msg.delete({timeout:5000, reason:"Redan klasskamrat"})
          })
      } else {
        const klassRoll = message.guild.roles.cache.find(role => role.name === klass)
        message.member.roles.add(klassRoll)
          .then(message.reply(`du är nu med i klass ${klass}`).then(msg => {
            msg.delete({timeout:5000, reason:"Gick med i klass " + klass})
          }))
          .catch(err => {
            console.log(err)
            message.reply(`Fel inträffande vid givande av roll ${klass}, avbryter.`)
              .then(msg => {
                msg.delete({timeout:5000, reason:"Kunde inte ge roll"})
              })
          })
      }
    } else {
      message.reply(klass+" är ingen giltig klass")
        .then(msg => {
          msg.delete({timeout:5000, reason:"Ej giltig klass"})
        })
    }
    break
  case "e":
  case "elev":
    message.delete()
    if (message.member.roles.cache.some(role => role.name === 'Elev')) {
      message.reply("du är redan elev")
        .then(msg => {
          msg.delete({timeout:5000, reason:"Redan elev"})
        })
    } else {
      const elev = message.guild.roles.cache.find(role => role.name === 'Elev')
      message.member.roles.add(elev)
    }
    break
  case "vecka":
    Date.prototype.getWeek = function() {
      var onejan = new Date(this.getFullYear(), 0, 1)
      return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7)
    }
    var weekNumber = (new Date()).getWeek()
    message.channel.send(weekNumber)
    break
  }
})

bot.login(botToken)