const store = require("../store/store");

module.exports = {
  name: "toggle",
  description:
    "Enables or disables a text channel to be used for training data",
  guildOnly: true,
  cooldown: 1,
  execute(message, args) {
    const possibleChannels = message.guild.channels.cache.filter((channel) => {
      return channel.type === "text" && channel.viewable;
    });
    const toggleChannels = message.mentions.channels
      .filter((ch) => {
        return possibleChannels.has(ch.id);
      })
      .map((ch) => ch.id);
    if (toggleChannels.length === 0) {
      return message.channel.send("Please specify some text channels");
    }
    toggleChannels.forEach((id) => {
      store.toggleChannel(message.guild.id, id);
    });
  },
};
