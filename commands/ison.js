const {
  RPL_ISON
} = require('../replies');

/**
 * ISON
 * @docs https://tools.ietf.org/html/rfc1459#section-5.8
 */
const ison = ({ user, server, parameters }) => {
  const users = parameters.filter(nickname => server.findUser(nickname));
  user.send(server, RPL_ISON, [user.nickname].concat(users));
};

module.exports = ison;