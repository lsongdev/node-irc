const to = require('to2');
const {debuglog} = require('util');
const Parser = require('./parser');
const Message = require('./message');
const { Duplex } = require('stream');

const debug = debuglog('ircs:User');
/**
 * Represents a User on the server.
 */
class User extends Duplex {
  /**
   * @param {stream.Duplex} sock Duplex Stream to read & write commands from & to.
   */
  constructor (sock) {
    super({
      readableObjectMode: true,
      writableObjectMode: true
    })

    this.socket = sock;
    this.channels = [];
    this.nickname = null;
    this.hostname = sock.remoteAddress;
    sock.pipe(Parser()).pipe(to.obj((message, enc, cb) => {
      this.onReceive(message)
      cb()
    }))
    sock.on('error', e => {
      debug('error', e);
    });
    sock.on('end', e => {
      this.onReceive(new Message(null, 'QUIT', []));
      this.emit('end', e);
    });
  }

  onReceive (message) {
    debug('receive', message + '')
    message.user = this
    message.prefix = this.mask()
    this.push(message)
  }

  _read () {
    //
  }

  _write (message, enc, cb) {
    debug('write', message + '')
    this.socket.write(`${message}\r\n`);
    cb()
  }

  join(channel){
    if(-1 === this.channels.indexOf(channel)){
      this.channels.push(channel);
    }else{
      throw new Error(`Already join channel: ${channel.name}`);
    }
    return this;
  }

  /**
   * Send a message to this user.
   *
   * @param {Message} message Message to send.
   */
  send (message) {
    if (!(message instanceof Message)) {
      message = new Message(...arguments)
    }
    debug('send', message + '')
    this.write(message);
  }

  /**
   * Check if this user is matched by a given mask.
   *
   * @param {string} mask Mask to match.
   *
   * @return {boolean} Whether the user is matched by the mask.
   */
  matchesMask (mask) {
    // simple & temporary
    return mask === this.mask();
  }

  /**
   * Gives this user's mask.
   *
   * @return {string|boolean} Mask or false if this user isn't really known yet.
   * @todo Just use a temporary nick or something, so we don't have to deal with `false` everywhere…
   */
  mask () {
    var mask = ''
    if (this.nickname) {
      mask += this.nickname;
      if (this.username) {
        mask += `!${this.username}`;
      }
      if (this.hostname) {
        mask += `@${this.hostname}`;
      }
    }
    return mask || false;
  }
  /**
   * end socket
   */
  end(){
    this.socket.end();
    return this;
  }
  
  toString(){
    return this.mask();
  }

  inspect(){
    return this.toString();
  }
}

module.exports = User;