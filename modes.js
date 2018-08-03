const flagModeChars = [ 'p', 's', 'i', 't', 'n', 'm' ]
const paramModeChars = [ 'l', 'k' ]
const listModeChars = [ 'o', 'v' ]

const isFlagMode = (mode) => flagModeChars.indexOf(mode) !== -1
const isParamMode = (mode) => paramModeChars.indexOf(mode) !== -1
const isListMode = (mode) => listModeChars.indexOf(mode) !== -1

class Modes {
  constructor () {
    this.flagModes = {}
    this.paramModes = {}
    this.listModes = {}
  }

  add (mode, params = []) {
    if (isFlagMode(mode)) {
      this.flagModes[mode] = true
    } else if (isParamMode(mode)) {
      this.paramModes[mode] = params[0]
    } else if (isListMode(mode)) {
      this.listModes[mode] = (this.listModes[mode] || []).concat(params)
    }
  }

  remove (mode, params = []) {
    if (isFlagMode(mode)) {
      delete this.flagModes[mode]
    } else if (isParamMode(mode)) {
      delete this.paramModes[mode]
    } else if (isListMode(mode)) {
      const shouldKeep = (param) => params.every((remove) => param !== remove)
      this.listModes[mode] = (this.listModes[mode] || []).filter(shouldKeep)
    }
  }

  get (mode) {
    if (isFlagMode(mode)) {
      return !!this.flagModes[mode]
    } else if (isParamMode(mode)) {
      return this.paramModes[mode]
    } else if (isListMode(mode)) {
      return this.listModes[mode]
    }
  }

  has (mode, param) {
    if (isFlagMode(mode)) {
      return this.get(mode)
    } else if (isParamMode(mode)) {
      return this.paramModes[mode] != null
    } else if (isListMode(mode) && param) {
      const list = this.listModes[mode]
      return list && list.indexOf(param) !== -1
    }
    return false
  }

  flags () {
    return Object.keys(this.flagModes)
  }

  toString () {
    let str = '+' + this.flags().join('')
    let params = []
    paramModeChars.forEach((mode) => {
      if (this.has(mode)) {
        str += mode
        params.push(this.get(mode))
      }
    })
    if (params.length > 0) {
      str += ' ' + params.join(' ')
    }
    return str
  }
}

Modes.isFlagMode = isFlagMode
Modes.isParamMode = isParamMode
Modes.isListMode = isListMode

module.exports = Modes;
