const tcp = require('net');
const Parser = require('./parser');
const EventEmitter = require('events');
const to = require('flush-write-stream');

class IRC extends EventEmitter {
  constructor(options) {
    super();
    Object.assign(this, options);
    this.socket = new tcp.Socket();
    this.socket.pipe(Parser()).pipe(to.obj((message, enc, cb) => {
      const { prefix, command, parameters } = message;
      this.emit(command, parameters);
      cb()
    }));
  }
  connect() {
    const { host, port } = this;
    return new Promise(resolve => {
      this.socket.connect(port, host, resolve);
    });
  }
  write(command, parameters) {
    this.socket.write([command].concat(parameters).join(' ') + '\r\n');
    return this;
  }
  nick() {
    const user = this;
    return this.write('NICK', [user.nickname]);
  }
  user() {
    const user = this;
    const { username, hostname = '0', servername = '*', realname } = user;
    return this.write('USER', [username, hostname, servername, `:${realname}`]);
  }
  join(channel) {
    return this.write('JOIN', [channel]);
  }
  send(message, to) {
    return this.write('PRIVMSG', [to, `:${message}`]);
  }
  ping() {
    const now = Date.now();
    return this.write('PING', [now]);
  }
  pong(x) {
    return this.write('PING', x);
  }
  notice(message, to) {
    return this.write('NOTICE', [to, `:${message}`]);
  }
  part(channel, message) {
    return this.write('PART', [channel, message]);
  }
  quit(message) {
    return this.write('QUIT', [`:${message}`]);
  }
}

IRC.Server = require('./server');
IRC.createServer = options => {
  return new IRC.Server(options);
};

module.exports = IRC;