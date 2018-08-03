const {
  RPL_TOPIC,
  RPL_NOTOPIC,
  ERR_NOTONCHANNEL,
  ERR_CHANOPRIVSNEEDED
} = require('../replies')

module.exports = function topic ({ user, server, parameters: [ channelName, topic ] }) {
  let channel = server.findChannel(channelName)
  if (channel) {
    // no new topic given, → check
    if (topic === undefined) {
      if (channel.topic) {
        user.send(server, RPL_TOPIC, [ user.nickname, channel.name, `:${channel.topic}` ])
      } else {
        user.send(server, RPL_NOTOPIC, [ user.nickname, channel.name, ':No topic is set.' ])
      }
      return
    }

    if (!channel.hasUser(user)) {
      user.send(server, ERR_NOTONCHANNEL, [ user.nickname, channel.name, ':You\'re not on that channel.' ])
      return
    }
    if (!channel.hasOp(user)) {
      user.send(server, ERR_CHANOPRIVSNEEDED, [ user.nickname, channel.name, ':You\'re not channel operator' ])
      return
    }
    // empty string for topic, → clear
    channel.topic = topic === '' ? null : topic
    channel.send(user, 'TOPIC', [ channel.name, topic === '' ? ':' : `:${topic}` ])
  }
}
