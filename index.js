const Discord = require("discord.js");
const { prefix, token, debug } = require("./config.json");
const fs = require("fs");

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

client.once("ready", () => {
  console.log("Starting DiscordSimulator...");
});

const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("message", message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  if (command.guildOnly && message.channel.type !== "text") {
    return message.reply("Please use this command in a server.");
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      if (debug) {
        return message.reply(
          `Debug: command on timeout for ${timeLeft} seconds`
        );
      } else {
        return;
      }
    }
  } else {
    timestamps.set(message.author.id, now);
    setTimeout(() => {
      timestamps.delete(message.author.id, cooldownAmount);
    }, cooldownAmount);
  }

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    if (debug) {
      message.reply("there was an error with this command: " + error);
    }
  }
});

client.login(token);
