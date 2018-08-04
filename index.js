const EventEmitter = require('events');

class IRC extends EventEmitter {
  connect(){

  }
  join(){
    
  }
}

IRC.Server = require('./server');
IRC.createServer = options => {
  return new IRC.Server(options);
};

module.exports = IRC;