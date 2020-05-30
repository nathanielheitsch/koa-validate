/* eslint-disable no-unused-vars */
module.exports = (jpath) => {
  const getValue = (obj, key, transFn) => {
    if ((key.indexOf('/') == 0 || key.indexOf('#/') == 0) && transFn) {
      return jpath.resolve(obj, key);
    }
    return obj[key];
  };

  const hasKey = (obj, key, transFn) => {
    if ((key.indexOf('/') == 0 || key.indexOf('#/') == 0) && transFn) {
      return (jpath.resolve(obj, key).length > 0);
    }
    return key in obj;
  };
};
