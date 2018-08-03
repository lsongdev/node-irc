const {
  ERR_NOSUCHCHANNEL,
  ERR_NOTONCHANNEL,
  ERR_NEEDMOREPARAMS
} = require('../replies')

module.exports = function part ({ user, server, parameters: [ channelName, message ] }) {
  if (!channelName) {
    user.send(server, ERR_NEEDMOREPARAMS, [ 'PART', ':Not enough parameters' ])
    return
  }

  const channel = server.findChannel(channelName)
  if (!channel) {
    user.send(user, ERR_NOSUCHCHANNEL, [ channelName, ':No such channel.' ])
    return
  }
  if (!channel.hasUser(user)) {
    user.send(user, ERR_NOTONCHANNEL, [ channelName, ':You\'re not on that channel.' ])
    return
  }

  channel.part(user)

  channel.send(user, 'PART', [ channel.name ])
  user.send(user, 'PART', [ channel.name ])
}
