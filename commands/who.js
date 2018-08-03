const {
  RPL_WHOREPLY,
  RPL_ENDOFWHO
} = require('../replies')

module.exports = function who ({ user, server, parameters: [ channelName ] }) {
  let channel = server.findChannel(channelName)
  if (channel) {
    channel.users.forEach((u) => {
      let mode = 'H'
      if (channel.hasOp(u)) mode += '@'
      else if (channel.hasVoice(u)) mode += '+'
      user.send(server, RPL_WHOREPLY, [
        user.nickname, channel.name, u.username,
        u.hostname, u.servername, u.nickname,
        mode, ':0', u.realname
      ])
    })
    user.send(server, RPL_ENDOFWHO, [ user.nickname, channelName, ':End of /WHO list.' ])
  }
}
