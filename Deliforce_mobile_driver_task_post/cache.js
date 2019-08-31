const cache = {};
module.exports = {
  add: (key, value) => {
    cache[key] = value;
  },
  fetch: (key) => cache[key]

};

