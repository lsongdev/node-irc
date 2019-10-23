const {
  RPL_WHOISUSER,
  RPL_WHOISSERVER,
  RPL_ENDOFWHOIS,
  ERR_NOSUCHNICK
} = require('../replies');
/**
 * https://tools.ietf.org/html/rfc1459#section-4.5.2
 */
function whois ({ user, server, parameters: [ nickmask ] }) {
  const target = server.findUser(nickmask)
  if (target) {
    user.send(server, RPL_WHOISUSER, [ user.nickname, target.username, target.hostname, '*', `:${user.realname}` ])
    user.send(server, RPL_WHOISSERVER, [ user.nickname, target.username, target.servername, target.servername ])
    user.send(server, RPL_ENDOFWHOIS, [ user.nickname, target.username, ':End of /WHOIS list.' ])
  } else {
    user.send(server, ERR_NOSUCHNICK, [ user.nickname, nickmask, ':No such nick/channel.' ])
    user.send(server, RPL_ENDOFWHOIS, [ user.nickname, nickmask, ':End of /WHOIS list.' ])
  }
}

module.exports = whois;