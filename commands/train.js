const Markov = require("js-markov");
const Discord = require("discord.js");
const store = require("../store/store");
const { strToUserID } = require("../util");
let chains;
const MESSAGELIMIT = 1000;

module.exports = {
  name: "train",
  description:
    "Read previous messages on the server from a specific user and train a model for them",
  guildOnly: true,
  cooldown: 10,
  execute(message, args) {
    chains = new Map();
    const guildID = message.guild.id;
    const members = message.guild.members.cache;
    const ids = args
      .map((str) => strToUserID(str))
      .filter((id) => members.has(id));
    if (ids.length === 0) {
      return message.channel.send(
        "Please specify a user or users to train upon"
      );
    }
    let channelIDs = store.getChannels(guildID);
    if (channelIDs.length === 0) {
      return message.channel.send(
        "No channels have been enabled. Use the toggle command to enable some text channels for training."
      );
    }
    let channels = channelIDs.map((id) => {
      return message.guild.channels.cache.find((ch) => {
        return ch.id === id;
      });
    });
    let allMessages = new Discord.Collection();

    function fetchChannelMsgs(channel, limit = 100, before = null) {
      return channel.messages
        .fetch({ limit, before })
        .then((msgs) => {
          if (msgs.size === 0) {
            return;
          }
          console.log(`${((allMessages.size * 1.0) / MESSAGELIMIT) * 100}%`);
          allMessages = allMessages.concat(msgs);
          const limit = Math.min(100, MESSAGELIMIT - allMessages.size);
          const before = msgs.last().id;
          if (limit > 0) {
            return fetchChannelMsgs(channel, limit, before);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }

    // indicate start of training

    console.log("Fetching messages...");
    Promise.all(
      channels.map((ch) => {
        return fetchChannelMsgs(ch);
      })
    ).then(() => {
      console.log("Total messages:", allMessages.size);
      console.log("Building chains...");

      ids.forEach((id) => {
        msgs = allMessages.filter((msg) => msg.author.id === id);
        msgs.forEach((msg) => {
          const content = msg.content;
          if (!chains.has(id)) {
            chains.set(id, new Markov());
          }
          chains.get(id).addStates(content);
        });
      });
      console.log("Training...");
      const usernames = [];
      chains.forEach((chain, id) => {
        const user = message.client.users.cache.get(id);
        if (!user) {
          return;
        }
        const name = user.username || "";
        usernames.push(name);
        chain.train(5);
        store.setUserChain(message.guild.id, id, chain);
      });
      message.channel.send(
        `Success. Trained models for: ${usernames.join(", ")}`
      );
    });
  },
};
