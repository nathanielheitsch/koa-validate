const { isString } = require('../utils/obj.util');
const util = require('util');
const Validators = require('../models/validators');

module.exports = (Validator) => {
  const v = require('validator');
  /**
   * Adds an error to the context
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.addError = function(tip) {
    this.goOn = false;
    if (this.value && (this instanceof Validators.FileValidator)) {
      this.value.goOn = false;
    }
    if (!this.context.errors) {
      this.context.errors = [];
    }
    var e = {};
    e[this.key] = tip;
    this.context.errors.push(e);
  };
  
  /**
   * @returns {boolean}
   */
  Validator.prototype.hasError = function() {
    return !!(this.context.errors && this.context.errors.length > 0);
  };
  /**
   * The param may not in the params.
   * If the param not exists,it has no error,no matter whether have other checker or not.
   */
  Validator.prototype.optional = function() {
    if (!this.exists) {
      this.goOn = false;
    }
    return this;
  };
  /**
   * Check if the param is not empty
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.notEmpty = function(tip) {
    if (this.goOn && (this.value == null || typeof (this.value) == 'undefined' || (typeof (this.value) == 'string' && !this.value))) {
      this.addError(tip || this.key + ' can not be empty.');
    }
    return this;
  };
  /**
   * the params can be a empty string
   */
  Validator.prototype.empty = function() {
    if (this.goOn) {
      if (!this.value) {
        this.goOn = false;
      }
    }
    return this;
  };
  /**
   * check if the param is not blank,use /^\s*$/gi reg to check.
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.notBlank = function(tip) {
    if (this.goOn && (this.value == null || typeof (this.value) == 'undefined' || (typeof (this.value) == 'string' && (/^\s*$/gi).test(this.value)))) {
      this.addError(tip || this.key + ' can not be blank.');
    }
    return this;
  };
  /**
   * Checks if key exists
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.exist = function(tip) {
    if (this.goOn && !this.exists) {
      this.addError(tip || this.key + ' should exists!');
    }
    return this;
  };
  /**
   * pattern must be a RegExp instance ,eg. /abc/i
   * @param  {} reg
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.match = function(reg, tip) {
    if (this.goOn && !reg.test(this.value)) {
      this.addError(tip || this.key + ' is bad format.');
    }
    return this;
  };
  
  /**
   * Ensure that a string does not match the supplied regular expression.
   * @param  {} reg
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.notMatch = function(reg, tip) {
    if (this.goOn && reg.test(this.value)) {
      this.addError(tip || this.key + ' is bad format.');
    }
    return this;
  };
  /**
   * Ensure that `assertion`, an arbitrary value, is falsey.
   * @param  {} assertion
   * @param  {String} tip - Message to return on fail
   * @param  {} shouldBail
   */
  Validator.prototype.ensureNot = function(assertion, tip, shouldBail) {
    if (shouldBail) this.goOn = false;
    if (this.goOn && !!assertion) {
      this.addError(tip || this.key + ' failed an assertion.');
    }
    return this;
  };
  /**
   * Ensure that `assertion`, an arbitrary value, is truthy.
   * @param  {} assertion
   * @param  {String} tip - Message to return on fail
   * @param  {} shouldBail
   */
  Validator.prototype.ensure = function(assertion, tip, shouldBail) {
    if (shouldBail) this.goOn = false;
    if (this.goOn && !assertion) {
      this.addError(tip || this.key + ' failed an assertion.');
    }
    return this;
  };
  
  /**
   * check if the param is integer
   * @param  {String} tip - Message to return on fail
   * @param  {} options
   */
  Validator.prototype.isInt = function(tip, options) {
    if (this.goOn && !v.isInt(String(this.value), options)) {
      this.addError(tip || this.key + ' is not integer.');
    }
    return this;
  };
  /**
   * check if the param is float
   * @param  {String} tip - Message to return on fail
   * @param  {} options
   */
  Validator.prototype.isFloat = function(tip, options) {
    if (this.goOn && !v.isFloat(String(this.value), options)) {
      this.addError(tip || this.key + ' is not float.');
    }
    return this;
  };
  
  /**
   * check the param length.
   * @param  {} min
   * @param  {} max
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isLength = function(min, max, tip) {
    min = min || 0;
    tip = typeof max != 'number' ? max : tip;
    max = typeof max == 'number' ? max : -1;
    this.exist(tip);
    if (this.goOn) {
      if (this.value.length < min) {
        this.addError(tip || this.key + "'s length must equal or great than " + min + '.');
        return this;
      }
      if (max != -1 && this.value.length > max) {
        this.addError(tip || this.key + "'s length must equal or less than " + max + '.');
        return this;
      }
    }
    return this;
  };

  /**
   * abbreviation of isLength
   * @name len
   * @param  {} min
   * @param  {} max
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.len = Validator.prototype.isLength;
  /**
   * check if the param is in the array.
   * @param  {} arr
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.in = function(arr, tip) {
    if (this.goOn && arr) {
      for (var i = 0; i < arr.length; i++) {
        if (this.value == arr[i]) {
          return this;
        }
      }
      this.addError(tip || this.key + ' must be in [' + arr.join(',') + '].');
    }
    return this;
  };
  /**
   * Abbreviation of isIn
   * @name in
   * @param  {} arr
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isIn = Validator.prototype.in;
  /**
   * check if the param equal to the value
   * @param  {} l
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.eq = function(l, tip) {
    if (this.goOn && this.value != l) {
      this.addError(tip || this.key + ' is must equal ' + l + '.');
    }
    return this;
  };
  /**
   * check if the param not equal to the value
   * @param  {} l
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.neq = function(l, tip) {
    if (this.goOn && this.value == l) {
      this.addError(tip || this.key + ' is must not equal ' + l + '.');
    }
    return this;
  };
  /**
   * check if the param greater then the value
   * @param  {} l
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.gt = function(l, tip) {
    if (this.goOn && this.value <= l) {
      this.addError(tip || this.key + ' must great than ' + l + '.');
    }
    return this;
  };
  /**
   * check if the param less then the value
   * @param  {} l
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.lt = function(l, tip) {
    if (this.goOn && this.value >= l) {
      this.addError(tip || this.key + ' must less than ' + l + '.');
    }
    return this;
  };
  /**
   * check if the param great then or equal the value
   * @param  {} l
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.ge = function(l, tip) {
    if (this.goOn && this.value < l) {
      this.addError(tip || this.key + ' must great than or equal ' + l + '.');
    }
    return this;
  };
  /**
   * check if the param less then or equal the value
   * @param  {} l
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.le = function(l, tip) {
    if (this.goOn && this.value > l) {
      this.addError(tip || this.key + ' must less than or equal ' + l + '.');
    }
    return this;
  };
  /**
   * check if the param contains the str
   * @param  {} s
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.contains = function(s, tip) {
    if (this.goOn && (!isString(this.value) || !v.contains(this.value, s))) {
      this.addError(tip || this.key + ' is must contain ' + s + '.');
    }
    return this;
  };
  /**
   * check if the param not contains the str
   * @param  {} s
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.notContains = function(s, tip) {
    if (this.goOn && (!isString(this.value) || v.contains(this.value, s))) {
      this.addError(tip || this.key + ' is must not contain ' + s + '.');
    }
    return this;
  };
  /**
   * check if the param is an email
   * @param  {String} tip - Message to return on fail
   * @param  {} options
   */
  Validator.prototype.isEmail = function(tip, options) {
    if (this.goOn && (!isString(this.value) || !v.isEmail(this.value, options))) {
      this.addError(tip || this.key + ' is not email format.');
    }
    return this;
  };
  /**
   * check if the param is an URL
   * @param  {String} tip - Message to return on fail
   * @param  {} options
   */
  Validator.prototype.isUrl = function(tip, options) {
    if (this.goOn && (!isString(this.value) || !v.isURL(this.value, options))) {
      this.addError(tip || this.key + ' is not url format.');
    }
    return this;
  };
  /**
   * check if the param is an IP (version 4 or 6)
   * @param  {String} tip - Message to return on fail
   * @param  {} version
   */
  Validator.prototype.isIp = function(tip, version) {
    if (this.goOn && (!isString(this.value) || !v.isIP(this.value, version))) {
      this.addError(tip || this.key + ' is not ip format.');
    }
    return this;
  };
  /**
   * check if the param contains only letters (a-zA-Z)
   * @param  {String} tip - Message to return on fail
   * @param  {} locale
   */
  Validator.prototype.isAlpha = function(tip, locale) {
    if (this.goOn && (!isString(this.value) || !v.isAlpha(this.value, locale))) {
      this.addError(tip || this.key + ' is not an alpha string.');
    }
    return this;
  };
  /**
   * check if the param contains only numbers
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isNumeric = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isNumeric(this.value))) {
      this.addError(tip || this.key + ' is  not numeric.');
    }
    return this;
  };
  
  /**
   * check if the param contains only letters and numbers
   * @param  {String} tip - Message to return on fail
   * @param  {} locale
   */
  Validator.prototype.isAlphanumeric = function(tip, locale) {
    if (this.goOn && (!isString(this.value) || !v.isAlphanumeric(this.value, locale))) {
      this.addError(tip || this.key + ' is not an aphanumeric string.');
    }
    return this;
  };
  /**
   * check if a param is base64 encoded
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isBase64 = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isBase64(this.value))) {
      this.addError(tip || this.key + ' is not a base64 string.');
    }
    return this;
  };
  /**
   * check if the param is a hexadecimal number
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isHexadecimal = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isHexadecimal(this.value))) {
      this.addError(tip || this.key + ' is not a hexa decimal string.');
    }
    return this;
  };
  /**
   * check if the param is a hexadecimal color
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isHexColor = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isHexColor(this.value))) {
      this.addError(tip || this.key + ' is  not hex color format.');
    }
    return this;
  };
  /**
   * check if the param is lowercase
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isLowercase = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isLowercase(this.value))) {
      this.addError(tip || this.key + ' is not a lowwer case string');
    }
    return this;
  };
  /**
   * check if the param is uppercase
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isUppercase = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isUppercase(this.value))) {
      this.addError(tip || this.key + ' is not a upper case string.');
    }
    return this;
  };
  /**
   * check if the param is a number that's divisible by another
   * @param  {} n
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isDivisibleBy = function(n, tip) {
    if (this.goOn && (!isString(this.value) || !v.isDivisibleBy(this.value, n))) {
      this.addError(tip || this.key + ' can not divide by' + n + '.');
    }
    return this;
  };
  /**
   * check if the param is null
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isNull = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isNull(this.value))) {
      this.addError(tip || this.key + ' is not null.');
    }
    return this;
  };
  /**
   * check if the param's length (in bytes) falls in a range
   * @param  {int} min
   * @param  {int} max
   * @param  {String} charset - default 'utf8'
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isByteLength = function(min, max, charset, tip) {
    min = min || 0;
    max = max || Number.MAX_VALUE;
    charset = charset || 'utf8';
    this.notEmpty(tip);
    if (this.goOn) {
      var bl = Buffer.byteLength(this.value, charset);
      tip = typeof max != 'number' ? max : tip;
      if (bl < min || bl > max) {
        this.addError(tip || this.key + "'s byte lenth great than " + min + ' and less than ' + max + '.');
      }
    }
    return this;
  };
  /**
   * the abbreviation of isByteLength
   * @name byteLength
   * @param  {int} min
   * @param  {int} max
   * @param  {String} charset - default 'utf8'
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.byteLength = Validator.prototype.isByteLength;
  /**
   * check if the param is a UUID (version 3, 4 or 5)
   * @param  {String} tip - Message to return on fail
   * @param  {int} ver
   */
  Validator.prototype.isUUID = function(tip, ver) {
    if (this.goOn && (!isString(this.value) || !v.isUUID(this.value, ver))) {
      this.addError(tip || this.key + ' is not a UUID format.');
    }
    return this;
  };
  /**
   * check if the param is a date
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isDate = function(tip) {
    if (this.goOn && !util.isDate(this.value) && (!isString(this.value) || !v.isDate(this.value))) {
      this.addError(tip || this.key + ' is not a date format.');
    }
    return this;
  };
  /**
   * check if param is a time
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isTime = function(tip) {
    var timeReg = /^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/;
    if (this.goOn && !timeReg.test(this.value)) {
      this.addError(tip || this.key + ' is not a time format.');
    }
    return this;
  };
  
  /**
   * check if the param is a date that's after the specified date
   * @param  {Date} d
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isAfter = function(d, tip) {
    if (this.goOn && (!isString(this.value) || !v.isAfter(this.value, d))) {
      this.addError(tip || this.key + ' must after ' + d + '.');
    }
    return this;
  };
  /**
   * check if the param is a date that's before the specified date
   * @param  {Date} d
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isBefore = function(d, tip) {
    if (this.goOn && (!isString(this.value) || !v.isBefore(this.value, d))) {
      this.addError(tip || this.key + ' must before ' + d + '.');
    }
    return this;
  };
  /**
   * check if the param is a credit card
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isCreditCard = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isCreditCard(this.value))) {
      this.addError(tip || this.key + ' is not credit card format.');
    }
    return this;
  };
  /**
   * check if the param is an ISBN (version 10 or 13)
   * @param  {String} tip - Message to return on fail
   * @param  {} version
   */
  Validator.prototype.isISBN = function(tip, version) {
    if (this.goOn && (!isString(this.value) || !v.isISBN(this.value, version))) {
      this.addError(tip || this.key + ' is not a ISBN format.');
    }
    return this;
  };
  /**
   * check if the param is valid JSON (note: uses JSON.parse)
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isJSON = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isJSON(this.value))) {
      this.addError(tip || this.key + ' is not a json format.');
    }
    return this;
  };
  
  /**
   * check if the param contains one or more multibyte chars
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isMultibyte = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isMultibyte(this.value))) {
      this.addError(tip || this.key + ' is not a multibyte string.');
    }
    return this;
  };
  /**
   * check if the param contains ASCII chars only
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isAscii = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isAscii(this.value))) {
      this.addError(tip || this.key + ' is not a ascii string.');
    }
    return this;
  };
  /**
   * check if the param contains any full-width chars
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isFullWidth = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isFullWidth(this.value))) {
      this.addError(tip || this.key + ' is not a full width string.');
    }
    return this;
  };
  /**
   * check if the param contains any half-width chars
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isHalfWidth = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isHalfWidth(this.value))) {
      this.addError(tip || this.key + ' is not a half width string.');
    }
    return this;
  };
  /**
   * check if the param contains a mixture of full and half-width chars
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isVariableWidth = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isVariableWidth(this.value))) {
      this.addError(tip || this.key + ' is not a variable width string.');
    }
    return this;
  };
  /**
   * check if the param contains any surrogate pairs chars
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isSurrogatePair = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isSurrogatePair(this.value))) {
      this.addError(tip || this.key + ' is not a surrogate pair string.');
    }
    return this;
  };
  /**
   * check if the param is a currency
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isCurrency = function(tip, options) {
    if (this.goOn && (!isString(this.value) || !v.isCurrency(this.value, options))) {
      this.addError(tip || this.key + ' is not a currency format.');
    }
    return this;
  };
  /**
   * check if the param is a data uri
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isDataURI = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isDataURI(this.value))) {
      this.addError(tip || this.key + ' is not a data uri format.');
    }
    return this;
  };
  /**
   * check if the param is a mobile phone
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isMobilePhone = function(tip, locale) {
    if (this.goOn && (!isString(this.value) || !v.isMobilePhone(this.value, locale))) {
      this.addError(tip || this.key + ' is not a mobile phone format.');
    }
    return this;
  };
  /**
   * check if the param is a ISO8601 string
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isISO8601 = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isISO8601(this.value))) {
      this.addError(tip || this.key + ' is not a ISO8601 string format.');
    }
    return this;
  };
  /**
   * check if the param is a MAC address
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isMACAddress = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isMACAddress(this.value))) {
      this.addError(tip || this.key + ' is not a MAC address format.');
    }
    return this;
  };
  
  /**
   * check if the param is a ISIN
   * @param  {String} tip - Message to return on fail
   */
  Validator.prototype.isISIN = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isISIN(this.value))) {
      this.addError(tip || this.key + ' is not a ISIN format.');
    }
    return this;
  };
  /**
   * Check if the param is a fully qualified domain name.
   * @param  {String} tip
   * @param  {} options
   */
  Validator.prototype.isFQDN = function(tip, options) {
    if (this.goOn && (!isString(this.value) || !v.isFQDN(this.value, options))) {
      this.addError(tip || this.key + ' is not a fully qualified domain name format.');
    }
    return this;
  };
};
