const store = require("../store/store");

module.exports = {
  name: "generate",
  description:
    "Generate a message of a user after training a markov chain for them",
  guildOnly: true,
  cooldown: 2,
  execute(message, args) {
    const mentions = message.mentions.users.array();
    if (mentions.length !== 1) {
      return message.channel.send(
        "Please specify one user to generate a message for"
      );
    }
    const id = mentions[0].id;
    if (!id) {
      return message.channel.send("Please specify a valid user");
    }
    const chain = store.getUserChain(message.guild.id, id);
    if (!chain) {
      return message.channel.send(
        "Please train a model for this user using the train command"
      );
    }
    return message.channel.send(chain.generateRandom(300));
  },
};
