const { debuglog } = require('util');
const debug = debuglog('ircs:Command:PING');
/**
 * Command: PONG
 * Parameters: <daemon> [<daemon2>]
 * @docs https://tools.ietf.org/html/rfc1459#section-4.6.3
 */
function PING({ server, user, parameters }) {
  debug('received ping', parameters);
  user.send(server, 'PONG', parameters);
}

module.exports = PING;