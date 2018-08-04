const {
  RPL_LISTSTART,
  RPL_LIST,
  RPL_LISTEND
} = require('../replies')

module.exports = function list ({ user, server, parameters: [ channels ] }) {
  channels = channels ? channels.split(',') : null

  user.send(server, RPL_LISTSTART, [ user.nickname, 'Channel', ':Users  Name' ])

  server.channels.forEach((channel, name) => {
    if (channels && channels.indexOf(name) === -1) {
      return
    }

    if (channel.isSecret && !channel.hasUser(user)) {
      return
    }

    let response = [ user.nickname, channel.name, channel.users.length, channel.topic || '' ]
    if (channel.isPrivate && !channel.hasUser(user)) {
      response = [ user.nickname, 'Prv', channel.users.length, '' ]
    }
    user.send(server, RPL_LIST, response)
  })

  user.send(server, RPL_LISTEND, [ user.nickname, ':End of /LIST' ])
}
