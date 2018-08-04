const { debuglog } = require('util');
const debug = debuglog('ircs:Command:PING');

function PING({ server, user, parameters }){
  debug('received ping', parameters);
}

module.exports = PING;