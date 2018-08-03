const pkg = require('../../package.json')
const debug = require('debug')('ircs:commands:user')

module.exports = function user ({ user, server, parameters: [ username, hostname, servername, realname ] }) {
  debug('USER', user.mask(), username, hostname, servername, realname)

  user.username = username
  user.servername = server.hostname
  user.realname = realname

  user.send(server, '001', [ user.nickname, ':Welcome' ]);
  user.send(server, '002', [ user.nickname, `:Your host is ${server.hostname} running version ${pkg.version}` ]);
  user.send(server, '003', [ user.nickname, `:This server was created ${server.created}` ]);
  user.send(server, '004', [ user.nickname, pkg.name, pkg.version ]);
  user.send(server, 'MODE', [ user.nickname, '+w' ]);
}
