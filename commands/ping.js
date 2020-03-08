module.exports = {
  name: 'ping',
  description: 'Respond to "ping" with "Pong!"',
  execute(message, args) {
    message.channel.send('Pong!');
  },
};
