module.exports = (Validator) => {
  const v = require('validator');
  /**
   * Returns value being validated
   * @param  {Function} func - callback will be passed value as parameter
   */
  Validator.prototype.get = function(func) {
    if (this.goOn && !this.hasError() && !this.value) {
      if (func) {
        return func(this.value);
      }
      return this.value;
    }
    return this;
  };
  /**
   * if the param not exits or is an empty string, it will take the default value
   * @param  {Object} d - default value if it doesn't exist
   */
  Validator.prototype.default = function(d) {
    if (!this.hasError() && !this.value) {
      this.value = this.params[this.key] = d;
    }
    return this;
  };
  /**
   * convert param to js Date object.
   */
  Validator.prototype.toDate = function() {
    this.isDate();
    if (this.goOn && !this.hasError()) {
      this.value = this.params[this.key] = v.toDate(this.value);
    }
    return this;
  };
  /**
   * convert param to integer.radix for toInt,options for isInt
   * @param  {} tip
   * @param  {} radix
   * @param  {} options
   */
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
  /**
   * convert param to float
   * @param  {} tip
   */
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
  /**
   * convert param to json object
   * @param  {} tip
   */
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
  /**
   * convert param to lowercase
   */
  Validator.prototype.toLowerCase = function() {
    if (this.goOn && !this.hasError() && this.value) {
      this.value = this.params[this.key] = this.value.toLowerCase();
    }
    return this;
  };
  /**
   * Alias for toLowerCase
   * @name toLow
   */
  Validator.prototype.toLow = Validator.prototype.toLowerCase;
  /**
   * Convert param to uppercase
   */
  Validator.prototype.toUpperCase = function() {
    if (this.goOn && !this.hasError() && this.value) {
      this.value = this.params[this.key] = this.value.toUpperCase();
    }
    return this;
  };
  /**
   * Alias for toUpperCase
   * @name toUp
   */
  Validator.prototype.toUp = Validator.prototype.toUpperCase;
  /**
   * Convert the param to a boolean.
   * Everything except for '0', 'false' and '' returns true.
   * In strict mode only '1' and 'true' return true.
   */
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
  /**
   * trim characters (whitespace by default) from both sides of the param.
   * @param  {} c
   */
  Validator.prototype.trim = function(c) {
    if (this.goOn && !this.hasError()) {
      this.value = this.params[this.key] = v.trim(this.value, c);
    }
    return this;
  };
  /**
   * trim characters from the left-side of the param
   * @param  {} c
   */
  Validator.prototype.ltrim = function(c) {
    if (this.goOn && !this.hasError()) {
      this.value = this.params[this.key] = v.ltrim(this.value, c);
    }
    return this;
  };
  /**
   * trim characters from the right-side of the param.
   * @param  {} c
   */
  Validator.prototype.rtrim = function(c) {
    if (this.goOn && !this.hasError()) {
      this.value = this.params[this.key] = v.rtrim(this.value, c);
    }
    return this;
  };
  /**
   * replace <, >, & and " with HTML entities
   */
  Validator.prototype.escape = function() {
    if (this.goOn && !this.hasError()) {
      this.value = this.params[this.key] = v.escape(this.value);
    }
    return this;
  };
  /**
   * remove characters with a numerical value < 32 and 127, mostly control characters
   * @param  {} nl
   */
  Validator.prototype.stripLow = function(nl) {
    if (this.goOn && !this.hasError()) {
      this.value = this.params[this.key] = v.stripLow(this.value, nl);
    }
    return this;
  };
  /**
   * remove characters that do not appear in the whitelist.
   * @param  {String} s
   */
  Validator.prototype.whitelist = function(s) {
    if (this.goOn && !this.hasError()) {
      this.value = this.params[this.key] = v.whitelist(this.value, s);
    }
    return this;
  };
  /**
   * remove characters that appear in the blacklist
   * @param  {String} s
   */
  Validator.prototype.blacklist = function(s) {
    if (this.goOn && !this.hasError()) {
      this.value = this.params[this.key] = v.blacklist(this.value, s);
    }
    return this;
  };
  /**
   * [ref mdn encodeURI]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI}
   */
  Validator.prototype.encodeURI = function() {
    if (this.goOn && !this.hasError() && this.value) {
      this.value = this.params[this.key] = encodeURI(this.value);
    }
    return this;
  };
  /**
   * [ref mdn decodeURI]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURI}
   * @param  {} tip
   */
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
  /**
   * [ref mdn encodeURIComponent]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent}
   */
  Validator.prototype.encodeURIComponent = function() {
    if (this.goOn && !this.hasError() && this.value) {
      this.value = this.params[this.key] = encodeURIComponent(this.value);
    }
    return this;
  };
  /**
   * [ref mdn decodeURIComponent]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent}
   * @param  {} tip
   */
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
  /**
   * the same as String replace
   * @param  {String} a
   * @param  {String} b
   */
  Validator.prototype.replace = function(a, b) {
    if (this.goOn && !this.hasError() && this.value) {
      this.value = this.params[this.key] = this.value.replace(a, b);
    }
    return this;
  };
  /**
   * encode current value to base64 string
   */
  Validator.prototype.encodeBase64 = function() {
    if (this.goOn && !this.hasError() && this.value) {
      this.value = this.params[this.key] = Buffer.from(this.value).toString('base64');
    }
    return this;
  };
  /**
   * decode current base64 to a normal string
   * if inBuffer is true the value will be a Buffer
   * @param  {} inBuffer
   * @param  {} tip
   */
  Validator.prototype.decodeBase64 = function(inBuffer, tip) {
    if (!this.hasError() && this.value) {
      try {
        if (inBuffer) {
          this.value = this.params[this.key] = Buffer.from(this.value, 'base64');
        } else {
          this.value = this.params[this.key] = Buffer.from(this.value, 'base64').toString();
        }
      } catch (e) {
        this.addError(tip || 'bad base64 format value');
      }
    }
    return this;
  };
  /**
   * hash current value use specified algorithm and encoding(if supplied , default is 'hex').
   * [see Hash]{@link https://nodejs.org/api/crypto.html#crypto_class_hash}
   * @param  {} alg
   * @param  {} enc
   */
  Validator.prototype.hash = function(alg, enc) {
    if (!this.hasError() && this.value) {
      enc = enc || 'hex';
      this.value = this.params[this.key] = require('crypto').createHash(alg).update(this.value).digest(enc);
    }
    return this;
  };
  /**
   * md5 current value into hex string
   */
  Validator.prototype.md5 = function() {
    this.hash('md5');
    return this;
  };
  /**
   * sha1 current value into hex string
   */
  Validator.prototype.sha1 = function() {
    this.hash('sha1');
    return this;
  };
  /**
   * clone current value to the new key, if newValue supplied , use it.
   * this.checkBody('v1').clone('md5').md5(); then your can use this.request.body.md5
   * @param  {String} key
   * @param  {Object} value
   */
  Validator.prototype.clone = function(key, value) {
    if (!this.hasError() && this.value) {
      this.value = this.params[key] = (typeof value == 'undefined' ? this.value : value);
      this.key = key;
    }
    return this;
  };

};
