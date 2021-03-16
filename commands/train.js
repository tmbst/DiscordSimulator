const Markov = require("js-markov");
const Discord = require("discord.js");
var markov = new Markov();
let chains;
const MESSAGELIMIT = 9000;

module.exports = {
  name: "train",
  description:
    "Read previous messages on the server and train markov chains for each user",
  guildOnly: true,
  cooldown: 10,
  execute(message, args) {
    let reply = "";
    chains = new Map();
    let allMessages = new Discord.Collection();

    let channels = message.guild.channels.cache.filter((ch) => {
      return ch.type === "text" && ch.viewable;
    });
    console.log(
      "channels: ",
      channels.map((ch) => {
        return ch.name;
      })
    );

    function fetchChannelMsgs(channel, limit = 100, before = null) {
      return channel.messages
        .fetch({ limit, before })
        .then((msgs) => {
          if (msgs.size === 0) {
            return;
          }
          allMessages = allMessages.concat(msgs);
          const limit = Math.min(100, MESSAGELIMIT - allMessages.size);
          const before = msgs.last().id;
          if (limit > 0) {
            return fetchChannelMsgs(channel, limit, before);
          }
        })
        .catch((err) => {
          //idk what errors might appear
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
      allMessages.forEach((msg) => {
        const id = msg.author.id;
        const content = msg.content;
        if (!chains.has(id)) {
          chains.set(id, new Markov());
        }
        chains.get(id).addStates(content);
      });
      console.log("Training...");
      chains.forEach((chain, id) => {
        console.log({ id });
        const user = message.client.users.cache.get(id);
        if (!user) {
          return;
        }
        const name = user.username || "";
        chain.train(3);
        result = chain.generateRandom(300);
        result = result.replace("`", "");
        result = result || "Empty result!";
        console.log({ name, result });
        reply += `${name}: \`${result}\`\n`;
      });
      message.channel.send(reply);
    });
  },
};
