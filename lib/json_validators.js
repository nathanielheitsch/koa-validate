const util = require('util');

module.exports = (Validator) => {
  Validator.prototype.check = function(fn, tip, scope) {
    if (this.goOn && !this.hasError() && !fn.call(scope || this, this.value, this.key, this.context)) {
      this.addError(tip || this.key + ' check failed.');
    }
    return this;
  };
  Validator.prototype.get = function(index) {
    if (this.value) {
      this.value = this.value[index || 0];
    }
    return this;
  };
  Validator.prototype.first = function(index) {
    return this.get(0);
  };
  Validator.prototype.filter = function(cb, scope) {
    if (this.value && this.value.length > 0) {
      var vs = [];
      for (var i = 0; i < this.value.length; i++) {
        if (cb.call(scope || this, this.value[i], i, this.key, this.context)) {
          vs.push(this.value[i]);
        }
      }
      this.value = vs;
    }
    return this;
  };
    
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
