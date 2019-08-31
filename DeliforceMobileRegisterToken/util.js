const result = require('./result');
const constant = require('./constant')();

module.exports = {
  checkFromTrigger: (cb, event) => {
    if (event.fromTrigger) {
      result.fromTrigger(cb);
      return true;
    }
  },


  getPrincipals: (cb, event) => {
    const fetch = (obj) => obj.requestContext.authorizer.claims.sub;
    const principals = getDeep(fetch, event);
    console.log(principals,"++++++++++++++++++++++++++++principal")
    if (!principals) {
      result.sendUnAuth(cb);
      return false;
    }
    return principals;
  },

  getBodyData: (event) => {
    const data = event.body;
    console.log(data,"data++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    if (data) return JSON.parse(data);
    else return null;
  },

  getQueryData: (event) => {
    const fetch = (obj) => obj.queryStringParameters.data;
    const data = getDeep(fetch, event);
    return (data) ? JSON.parse(data) : data;
  },

  isAdmin: (principal) => {
    if (principal['role'] === constant.ROLE.ADMIN) {
      return true;
    } else {
      return false;
    }
  }
};

function getDeep(fn, obj) {
  let value;
  try {
    value = fn(obj);
  } catch (e) {
    //console.log(e);
    value = false;
  } finally {
    return value
  }
}


