module.exports = (Validator) => {
  const v = new Validator();
  Validator.prototype.default = function(d) {
    if (!this.hasError() && !this.value) {
      this.value = this.params[this.key] = d;
    }
    return this;
  };
  Validator.prototype.toDate = function() {
    this.isDate();
    if (this.goOn && !this.hasError()) {
      this.value = this.params[this.key] = v.toDate(this.value);
    }
    return this;
  };
  Validator.prototype.toInt = function(tip, radix, options) {
    this.isInt(tip, options);
    if (this.goOn && !this.hasError()) {
      if (typeof (this.value) == 'number') {
        return this;
      }
      this.value = this.params[this.key] = v.toInt(this.value, radix);
    }
    return this;
  };
  Validator.prototype.toFloat = function(tip) {
    this.isFloat(tip);
    if (this.goOn && !this.hasError()) {
      if (typeof (this.value) == 'number') {
        return this;
      }
      this.value = this.params[this.key] = v.toFloat(this.value);
    }
    return this;
  };
  Validator.prototype.toJson = function(tip) {
    if (this.goOn && !this.hasError()) {
      try {
        if (typeof (this.value) == 'object') {
          return this;
        }
        this.value = this.params[this.key] = JSON.parse(this.value);
      } catch (e) {
        this.addError(tip || 'not json format');
      }
    }
    return this;
  };
  Validator.prototype.toLowercase = function() {
    if (this.goOn && !this.hasError() && this.value) {
      this.value = this.params[this.key] = this.value.toLowerCase();
    }
    return this;
  };
  Validator.prototype.toLow = Validator.prototype.toLowercase;
  Validator.prototype.toUppercase = function() {
    if (this.goOn && !this.hasError() && this.value) {
      this.value = this.params[this.key] = this.value.toUpperCase();
    }
    return this;
  };
  Validator.prototype.toUp = Validator.prototype.toUppercase;
  Validator.prototype.toBoolean = function() {
    if (this.goOn && !this.hasError()) {
      if (typeof (this.value) == 'boolean') {
        return this;
      }
      if (typeof (this.value) == 'string') {
        this.value = this.params[this.key] = v.toBoolean(this.value);
      }
    }
    return this;
  };
  Validator.prototype.trim = function(c) {
    if (this.goOn && !this.hasError()) {
      this.value = this.params[this.key] = v.trim(this.value, c);
    }
    return this;
  };
  Validator.prototype.ltrim = function(c) {
    if (this.goOn && !this.hasError()) {
      this.value = this.params[this.key] = v.ltrim(this.value, c);
    }
    return this;
  };
  Validator.prototype.rtrim = function(c) {
    if (this.goOn && !this.hasError()) {
      this.value = this.params[this.key] = v.rtrim(this.value, c);
    }
    return this;
  };
  Validator.prototype.escape = function() {
    if (this.goOn && !this.hasError()) {
      this.value = this.params[this.key] = v.escape(this.value);
    }
    return this;
  };
  Validator.prototype.stripLow = function(nl) {
    if (this.goOn && !this.hasError()) {
      this.value = this.params[this.key] = v.stripLow(this.value, nl);
    }
    return this;
  };
  Validator.prototype.whitelist = function(s) {
    if (this.goOn && !this.hasError()) {
      this.value = this.params[this.key] = v.whitelist(this.value, s);
    }
    return this;
  };
  Validator.prototype.blacklist = function(s) {
    if (this.goOn && !this.hasError()) {
      this.value = this.params[this.key] = v.blacklist(this.value, s);
    }
    return this;
  };
  Validator.prototype.encodeURI = function() {
    if (this.goOn && !this.hasError() && this.value) {
      this.value = this.params[this.key] = encodeURI(this.value);
    }
    return this;
  };
  Validator.prototype.decodeURI = function(tip) {
    if (this.goOn && !this.hasError() && this.value) {
      try {
        this.value = this.params[this.key] = decodeURI(this.value);
      } catch (e) {
        this.addError(tip || 'bad uri to decode.');
      }
    }
    return this;
  };
  Validator.prototype.encodeURIComponent = function() {
    if (this.goOn && !this.hasError() && this.value) {
      this.value = this.params[this.key] = encodeURIComponent(this.value);
    }
    return this;
  };
  Validator.prototype.decodeURIComponent = function(tip) {
    if (this.goOn && !this.hasError() && this.value) {
      try {
        this.value = this.params[this.key] = decodeURIComponent(this.value);
      } catch (e) {
        this.addError(tip || 'bad uri to decode.');
      }
    }
    return this;
  };
  Validator.prototype.replace = function(a, b) {
    if (this.goOn && !this.hasError() && this.value) {
      this.value = this.params[this.key] = this.value.replace(a, b);
    }
    return this;
  };
  Validator.prototype.encodeBase64 = function() {
    if (this.goOn && !this.hasError() && this.value) {
      this.value = this.params[this.key] = new Buffer(this.value).toString('base64');
    }
    return this;
  };
  Validator.prototype.decodeBase64 = function(inBuffer, tip) {
    if (!this.hasError() && this.value) {
      try {
        if (inBuffer) {
          this.value = this.params[this.key] = new Buffer(this.value, 'base64');
        } else {
          this.value = this.params[this.key] = new Buffer(this.value, 'base64').toString();
        }
      } catch (e) {
        this.addError(tip || 'bad base64 format value');
      }
    }
    return this;
  };
  Validator.prototype.hash = function(alg, enc) {
    if (!this.hasError() && this.value) {
      enc = enc || 'hex';
      this.value = this.params[this.key] = require('crypto').createHash(alg).update(this.value).digest(enc);
    }
    return this;
  };
  Validator.prototype.md5 = function() {
    this.hash('md5');
    return this;
  };
  Validator.prototype.sha1 = function() {
    this.hash('sha1');
    return this;
  };
  Validator.prototype.clone = function(key, value) {
    if (!this.hasError() && this.value) {
      this.value = this.params[key] = (typeof value == 'undefined' ? this.value : value);
      this.key = key;
    }
    return this;
  };

};
