const Markov = require("js-markov");
var markov = new Markov();

module.exports = {
  name: "train",
  description:
    "Read previous messages on the server and train markov chains for each user",
  guildOnly: true,
  cooldown: 10,
  execute(message, args) {
    const author = message.author;
    message.channel.messages
      .fetch({ limit: 100 })
      .then(messages => {
        messages
          .filter(m => m.author.id === author.id)
          .forEach(m => {
            markov.addStates(m.content);
          });
        console.log("states added. training...");
        markov.train();
        console.log("trained!");
        message.channel.send("Here are some results:");
        for (let i = 0; i < 5; i++) {
          let text = "";
          let attemptCount = 0;
          while (text.length === 0 && attemptCount < 500) {
            attemptCount++;
            text = markov.generateRandom(300);
          }
          message.channel.send(text);
        }
      })
      .catch(err => {
        console.error({ err });
      });
  }
};
