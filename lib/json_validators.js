const util = require('util');

module.exports = (Validator) => {
  /**
   * Runs passed in function and checks for returned boolean. Function will be passed scope if provided
   * else will receive (value, key, context).
   * @param  {Function} fn - function to run that returns boolean
   * @param  {} tip - tip for error if fn fails
   * @param  {} scope - custom scope that can be passed into fn
   */
  Validator.prototype.check = function(fn, tip, scope) {
    if (this.goOn && !this.hasError() && !fn.call(scope || this, this.value, this.key, this.context)) {
      this.addError(tip || this.key + ' check failed.');
    }
    return this;
  };
  /**
   * Returns value of given index
   * @param  {int} index - index to retreive value at
   */
  Validator.prototype.get = function(index) {
    if (this.value) {
      this.value = this.value[index || 0];
    }
    return this;
  };
  /**
   * Returns first value
   */
  Validator.prototype.first = function() {
    return this.get(0);
  };
  /**
   * Filter the value if value is array.
   * fn format function(value,index,key,requestParams):boolean
   * @param  {Function} fn
   * @param  {Object} scope
   */
  Validator.prototype.filter = function(fn, scope) {
    if (this.value && this.value.length > 0) {
      var vs = [];
      for (var i = 0; i < this.value.length; i++) {
        if (fn.call(scope || this, this.value[i], i, this.key, this.context)) {
          vs.push(this.value[i]);
        }
      }
      this.value = vs;
    }
    return this;
  };
    
  /**
   * Checks if value is of type
   * @param  {Object} t - type to match 
   * @param  {String} tip - message to send if fails
   */
  Validator.prototype.type = function(t, tip) {
    if (this.value) {
      if (t == 'boolean' || t == 'string' || t == 'number' || t == 'object' || t == 'undefined') {
        if (t != typeof (this.value)) this.addError(tip || this.key + ' is not ' + t + '');
      } else if (t == 'array') {
        if (!util.isArray(this.value)) this.addError(tip || this.key + ' is not array');
      } else if (t == 'date') {
        if (!util.isDate(this.value)) this.addError(tip || this.key + ' is not date.');
      } else if (t == 'null') {
        if (!util.isNull(this.value)) this.addError(tip || this.key + ' is not null.');
      } else if (t.toLowerCase() == 'nullorundefined') {
        if (!util.isNullOrUndefined(this.value)) this.addError(tip || this.key + ' is not primitive type.');
      } else if (t == 'primitive') {
        if (!util.isPrimitive(this.value)) this.addError(tip || this.key + ' is not primitive type.');
      } else {
        console.warn("not support this type check,type:'" + t + "'");
      }
    }
    return this;
  };

};
