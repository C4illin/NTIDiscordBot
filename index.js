const Discord = require("discord.js")
const config = require("./config.json")

const bot = new Discord.Client()
const prefix = "!"
const botToken = config.discord

// Invite: https://discordapp.com/oauth2/authorize?client_id=689153258648109151&scope=bot&permissions=268445696

bot.on("ready", () => {
  bot.user.setActivity('!elev för att bli elev', { type: 'LISTENING' })
  console.log("Discord.js Connected")
})

bot.on("message", (message) => {
  if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return

  var split = message.content.substring(prefix.length).split(" ")
  switch (split[0].toLowerCase()) {
  case "h":
  case "help":
    message.channel.send({
      embed: new Discord.MessageEmbed()
        .addField("Allmäna kommandon:", "!help - visar denna meny\n!elev - bli elev")
        .setColor("0x111111")
    })
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