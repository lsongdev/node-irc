const {
  RPL_NAMREPLY,
  RPL_ENDOFNAMES
} = require('../replies')

module.exports = function names ({ user, server, parameters: [ channelName ] }) {
  let channel = server.findChannel(channelName)
  if (channel) {
    let names = channel.users.map((u) => {
      let mode = ''
      if (channel.hasOp(u)) mode += '@'
      else if (channel.hasVoice(u)) mode += '+'
      return mode + u.nickname
    })

    const myMode = channel.hasOp(user) ? '@'
      : channel.hasVoice(user) ? '+' : '='

    user.send(server, RPL_NAMREPLY, [ user.nickname, myMode, channel.name, ...names ])
    user.send(server, RPL_ENDOFNAMES, [ user.nickname, channel.name, ':End of /NAMES list.' ])
  }
}
