const { debuglog } = require('util');
const pkg = require('../package.json')
const { 
  ERR_NEEDMOREPARAMS 
} = require('../replies');

const debug = debuglog('ircs:commands:user')
/**
 * Command: USER
   Parameters: <username> <hostname> <servername> <realname>
 */
function USER({ user, server, parameters }) {

  if(parameters.length !== 4){
    return user.send(server, ERR_NEEDMOREPARAMS, [ 'USER', ':Not enough parameters' ]);
  }

  const [ username, hostname, servername, realname ] = parameters;
  debug('USER', user.mask(), username, hostname, servername, realname);

  user.username = username;
  user.realname = realname;
  user.servername = servername;

  user.send(server, '001', [ user.nickname, ':Welcome' ]);
  user.send(server, '002', [ user.nickname, `:Your host is ${server.hostname} running version ${pkg.version}` ]);
  user.send(server, '003', [ user.nickname, `:This server was created ${server.created}` ]);
  user.send(server, '004', [ user.nickname, pkg.name, pkg.version ]);
  user.send(server, 'MODE', [ user.nickname, '+w' ]);
}

module.exports = USER;