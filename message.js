/**
 * Represents an IRC message.
 */
class Message {
  /**
   * @param {string|Object|null} prefix Message prefix. (Optional.)
   * @param {string} command Command name.
   * @param {Array.<string>} parameters IRC Command parameters.
   */
  constructor (prefix, command, parameters) {
    if (prefix && typeof prefix.mask === 'function') {
      prefix = prefix.mask()
    }

    /**
     * Message Prefix. Basically just the sender nickmask.
     * @member {string}
     */
    this.prefix = prefix
    /**
     * Command, i.e. what this message actually means to us!
     * @member {string}
     */
    this.command = command
    /**
     * Parameters given to this command.
     * @member {Array.<string>}
     */
    this.parameters = parameters
  }

  /**
   * Compiles the message back down into an IRC command string.
   *
   * @return {string} IRC command.
   */
  toString () {
    return (this.prefix ? `:${this.prefix} ` : '') +
          this.command +
          (this.parameters.length ? ` ${this.parameters.join(' ')}` : '')
  }
}

module.exports = Message;