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
    let idSet = new Set(); // temporary while confirming that msgs.last() is the oldest message
    let fails = 0;
    const messageManager = message.channel.messages;

    function fetchAllMsgs(limit = 100, before = null) {
      return messageManager
        .fetch({ limit, before })
        .then(msgs => {
          if (msgs.size === 0) {
            return;
          }
          allMessages = allMessages.concat(msgs);
          //temp
          msgs.forEach(msg => {
            if (idSet.has(msg.id)) {
              fails++;
            }
            idSet.add(msg.id);
          });
          const limit = Math.min(100, MESSAGELIMIT - allMessages.size);
          const before = msgs.last().id;
          if (limit > 0) {
            return fetchAllMsgs(limit, before);
          }
        })
        .catch(err => {
          //idk what errors might appear
          console.error(err);
        });
    }

    // indicate start of training

    console.log("Fetching messages...");
    fetchAllMsgs().then(() => {
      console.log("messages size: ", allMessages.size);
      console.log("Building chains...");
      allMessages.forEach(msg => {
        const id = msg.author.id;
        const content = msg.content;
        if (!chains.has(id)) {
          chains.set(id, new Markov());
        }
        chains.get(id).addStates(content);
      });
      console.log("Training...");
      chains.forEach((chain, id) => {
        const name = message.client.users.cache.get(id).username;
        console.log({ name });
        chain.train(3);
        result = chain.generateRandom(300);
        reply += `${name}: ${result}\n`;
        // console.log("user obj:", message.client.users.cache.get(id));
        // console.log("chain:", chain);
      });
      message.channel.send(reply);
    });
  }
};
