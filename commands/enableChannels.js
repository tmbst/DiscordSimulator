const store = require("../store/store");

function strToChannelID(str) {
  const start = str.lastIndexOf("#");
  const end = str.lastIndexOf(">");
  if (start === -1 || end === -1) return "";
  return str.substring(start + 1, end);
}

module.exports = {
  name: "toggle",
  description:
    "Enables or disables a text channel to be used for training data",
  guildOnly: true,
  cooldown: 1,
  execute(message, args) {
    console.log({ args });
    if (args.length === 0) {
      return message.channel.send("Please specify some text channels");
    }
    guildChannels = message.guild.channels.cache.filter((channel) => {
      return channel.type === "text" && channel.viewable;
    });
    toggleChannels = args
      .map((arg) => {
        return strToChannelID(arg);
      })
      .filter((id) => {
        return guildChannels.has(id);
      });
    console.log({ toggleChannels });
    toggleChannels.forEach((id) => {
      store.toggleChannel(message.guild.id, id);
    });
  },
};
