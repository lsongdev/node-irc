module.exports = function quit ({ user, server, parameters: [ message ] }) {
  message = message || user.nickname

  server.users.splice(server.users.indexOf(user), 1)
  user.channels.forEach(channel => {
    channel.part(user);
    channel.send(user, 'PART', [ channel.name, `:${message}` ])
  })
  user.end();
}
