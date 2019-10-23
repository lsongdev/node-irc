const {
  ERR_NEEDMOREPARAMS,
  ERR_NOSUCHCHANNEL,
  ERR_CHANOPRIVSNEEDED,
  ERR_BADCHANMASK,
  ERR_NOTONCHANNEL,
} = require('../replies');

/**
 * @docs https://tools.ietf.org/html/rfc1459#section-4.2.8
 * Parameters: <channel> <user> [<comment>]
 */
const kick = ({ server, user, parameters }) => {
  let [ channelName, user, comment ] = parameters;
  
  if (!channelName || !user) {
    user.send(server, ERR_NEEDMOREPARAMS, [ 'KICK', ':Not enough parameters' ])
    return
  }

  const channel = server.findChannel(channelName)
  if (!channel) {
    user.send(user, ERR_NOSUCHCHANNEL, [ channelName, ':No such channel.' ])
    return
  }
  if (!channel.hasUser(user)) {
    user.send(user, ERR_NOTONCHANNEL, [ channelName, ':No such user.' ])
    return
  }

  channel.part(user)
};

module.exports = kick;