const store = require("../store/store");
const { strToUserID } = require("../util");

module.exports = {
  name: "generate",
  description:
    "Generate a message of a user after training a markov chain for them",
  guildOnly: true,
  cooldown: 2,
  execute(message, args) {
    console.log({ message, args });
    if (args.length !== 1) {
      return message.channel.send(
        "Please specify one user to generate a message for"
      );
    }
    const id = strToUserID(args[0]);
    console.log({ id });
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
