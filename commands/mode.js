const {
  ERR_CHANOPRIVSNEEDED,
  ERR_NOSUCHCHANNEL,
  RPL_CHANNELMODEIS
} = require('../replies')

module.exports = function mode ({ user, server, parameters: [ target, modes = '', ...params ] }) {
  const channel = server.findChannel(target)
  if (!channel) {
    user.send(server, ERR_NOSUCHCHANNEL,
      [ user.nickname, target, ':No such channel' ])
    return
  }

  if (!modes) {
    // bare /MODE: return current modes
    const modeString = channel.modes.toString()
    user.send(server, RPL_CHANNELMODEIS,
      [ user.nickname, target, ...modeString.split(' ') ])
    return
  }

  const action = modes[0]
  const modeChars = modes.slice(1).split('')

  if (!channel.hasOp(user)) {
    user.send(server, ERR_CHANOPRIVSNEEDED,
      [ user.nickname, channel.name, ':You\'re not channel operator' ])
    return
  }

  modeChars.forEach((mode) => {
    if (action === '+') {
      channel.modes.add(mode, params)
    } else if (action === '-') {
      channel.modes.remove(mode, params)
    }
  })

  channel.send(user, 'MODE', [ target, modes, ...params ])
}
