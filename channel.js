const Modes = require('./modes');
const Message = require('./message');

const debug = require('debug')('ircs:Channel')

/**
 * Represents an IRC Channel on the server.
 */
class Channel {
  /**
   * Create a new channel.
   *
   * @param {string} name Channel name. (Starting with # or &, preferably.)
   */
  constructor (name) {
    this.name = name
    this.users = []
    this.topic = null

    this.modes = new Modes(this)
  }

  static isValidChannelName (name) {
    // https://tools.ietf.org/html/rfc1459#section-1.3
    return name.length <= 200 &&
      (name[0] === '#' || name[0] === '&') &&
      name.indexOf(' ') === -1 &&
      name.indexOf(',') === -1 &&
      name.indexOf('\x07') === -1 // ^G
  }

  /**
   * Joins a user into this channel.
   *
   * @param {User} user Joining user.
   */
  join (user) {
    this.users.push(user)
    user.channels.push(this)

    if (this.users.length === 1) {
      this.addOp(user)
    }
  }

  /**
   * Parts a user from this channel.
   *
   * @param {User} user Parting user.
   */
  part (user) {
    let i = this.users.indexOf(user)
    if (i !== -1) {
      this.users.splice(i, 1)
    }
    i = user.channels.indexOf(this)
    if (i !== -1) {
      user.channels.splice(i, 1)
    }
  }

  /**
   * Checks if a user is in this channel.
   *
   * @param {User} user User to look for.
   *
   * @return boolean Whether the user is here.
   */
  hasUser (user) {
    return this.users.indexOf(user) !== -1
  }

  /**
   * Sends a message to all users in a channel, including the sender.
   *
   * @param {Message} message Message to send.
   */
  send (message) {
    if (!(message instanceof Message)) {
      message = new Message(...arguments)
    }
    debug(this.name, 'send', message.toString())
    this.users.forEach((u) => {
      u.send(message)
    })
  }

  /**
   * Broadcasts a message to all users in a channel, except the sender.
   *
   * @param {Message} message Message to send.
   */
  broadcast (message) {
    if (!(message instanceof Message)) {
      message = new Message(...arguments)
    }
    this.users.forEach((u) => {
      if (!u.matchesMask(message.prefix)) u.send(message)
    })
  }

  addOp (user) {
    if (!this.hasOp(user)) {
      this.modes.add('o', user.nickname)
    }
  }

  removeOp (user) {
    this.modes.remove('o', user.nickname)
  }

  hasOp (user) {
    return this.modes.has('o', user.nickname)
  }

  addVoice (user) {
    if (!this.hasVoice(user)) {
      this.modes.add('v', user.nickname)
    }
  }

  removeVoice (user) {
    this.modes.remove('v', user.nickname)
  }

  hasVoice (user) {
    return this.modes.has('v', user.nickname)
  }

  addFlag (flag) {
    this.modes.add(flag)
  }

  removeFlag (flag) {
    this.modes.remove(flag)
  }

  isPrivate () {
    return this.modes.has('p')
  }

  isSecret () {
    return this.modes.has('s')
  }

  isInviteOnly () {
    return this.modes.has('i')
  }

  isModerated () {
    return this.modes.has('m')
  }
}

module.exports = Channel;