const IRC = require('..');

const client = new IRC({
  port: 6668,
  host: 'lsong.me',
  username: 'lsong',
  nickname: 'lsong',
  realname: 'Liu song'
});

client.on('message', message => {
  console.log(message);
});

client.on('PRIVMSG', ([ from, message ]) => {
  console.log(from, message);
});

client.on('PING', x => {
  client.pong(x);
});

setInterval(() => {
  client.ping();
}, 30000);

(async () => {

  await client.connect();
  await client.nick();
  await client.user();
  await client.join('#nodejs');
  await client.send('hello world', '#nodejs');

})();