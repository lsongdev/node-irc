module.exports = {
  NICK: require('./nick'),
  // Specifies username, hostname, servername and real name for a user.
  // Currently also sends a welcome message back to the user (should change)
  USER: require('./user'),
  // Shows a list of known channels.
  LIST: require('./list'),
  // Joins a channel.
  JOIN: require('./join'),
  // Parts a channel.
  PART: require('./part'),
  // Sets channel modes.
  MODE: require('./mode'),
  // Sets channel topics.
  TOPIC: require('./topic'),
  // Replies with the names of all users in a channel.
  NAMES: require('./names'),
  // Replies with more info about users in a channel.
  WHO: require('./who'),
  // IRC /WHOIS command.
  WHOIS: require('./whois'),
  // Sends a message to a user or channel.
  PRIVMSG: require('./privmsg'),
  // Sends a notice to a user or channel.
  NOTICE: require('./notice'),
  // ping
  PING: require('./ping'),
  // Disconnects.
  QUIT: require('./quit'),
};