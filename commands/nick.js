const {
  ERR_NONICKNAMEGIVEN,
  ERR_NICKNAMEINUSE
} = require('../replies')
const {debuglog} = require('util');
const debug = debuglog('ircs:commands:nick')

module.exports = function nick ({ user, server, parameters: [ nickname ] }) {
  nickname = nickname.trim()

  debug('NICK', user.mask(), nickname)

  if (nickname === user.nickname) {
    // ignore
    return
  }
  if (!nickname || nickname.length === 0) {
    return user.send(server, ERR_NONICKNAMEGIVEN, [ 'No nickname given' ]);
  }

  let lnick = nickname.toLowerCase()
  if (server.users.some((us) => us.nickname &&
                                us.nickname.toLowerCase() === lnick &&
                                us !== user)) {
    return user.send(server, ERR_NICKNAMEINUSE,
      [ user.nickname, nickname, ':Nickname is already in use' ])
  }

  user.send(user, 'NICK', [ nickname ])
  user.channels.forEach((chan) => {
    chan.broadcast(user, 'NICK', [ nickname ])
  })
  user.nickname = nickname
}
