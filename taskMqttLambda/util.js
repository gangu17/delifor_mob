const result = require('./result');
const constant = require('./constant')();

module.exports = {
  checkFromTrigger: (cb, event) => {
    if (event.fromTrigger) {
      result.fromTrigger(cb);
      return true;
    }
  },

  getBodyData: (event) => {
    const data = event.data;
    if (data) return data;
    else return null;
  }

};



