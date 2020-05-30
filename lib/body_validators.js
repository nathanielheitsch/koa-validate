const { isString } = require('../utils/obj.util');
const util = require('util');
const Validators = require('../models/validators');

module.exports = (Validator) => {
  const v = require('validator');
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
  
  Validator.prototype.hasError = function() {
    return !!(this.context.errors && this.context.errors.length > 0);
  };
  Validator.prototype.optional = function() {
    if (!this.exists) {
      this.goOn = false;
    }
    return this;
  };
  Validator.prototype.notEmpty = function(tip) {
    if (this.goOn && (this.value == null || typeof (this.value) == 'undefined' || (typeof (this.value) == 'string' && !this.value))) {
      this.addError(tip || this.key + ' can not be empty.');
    }
    return this;
  };
  Validator.prototype.empty = function() {
    if (this.goOn) {
      if (!this.value) {
        this.goOn = false;
      }
    }
    return this;
  };
  Validator.prototype.notBlank = function(tip) {
    if (this.goOn && (this.value == null || typeof (this.value) == 'undefined' || (typeof (this.value) == 'string' && (/^\s*$/gi).test(this.value)))) {
      this.addError(tip || this.key + ' can not be blank.');
    }
    return this;
  };
  Validator.prototype.exist = function(tip) {
    if (this.goOn && !this.exists) {
      this.addError(tip || this.key + ' should exists!');
    }
    return this;
  };
  Validator.prototype.match = function(reg, tip) {
    if (this.goOn && !reg.test(this.value)) {
      this.addError(tip || this.key + ' is bad format.');
    }
    return this;
  };
  
  /**
  from danneu's proposal [https://github.com/danneu]
  */
  // Ensure that a string does not match the supplied regular expression.
  Validator.prototype.notMatch = function(reg, tip) {
    if (this.goOn && reg.test(this.value)) {
      this.addError(tip || this.key + ' is bad format.');
    }
    return this;
  };
  // Ensure that `assertion`, an arbitrary value, is falsey.
  Validator.prototype.ensureNot = function(assertion, tip, shouldBail) {
    if (shouldBail) this.goOn = false;
    if (this.goOn && !!assertion) {
      this.addError(tip || this.key + ' failed an assertion.');
    }
    return this;
  };
  // Ensure that `assertion`, an arbitrary value, is truthy.
  Validator.prototype.ensure = function(assertion, tip, shouldBail) {
    if (shouldBail) this.goOn = false;
    if (this.goOn && !assertion) {
      this.addError(tip || this.key + ' failed an assertion.');
    }
    return this;
  };
  
  Validator.prototype.isInt = function(tip, options) {
    if (this.goOn && !v.isInt(String(this.value), options)) {
      this.addError(tip || this.key + ' is not integer.');
    }
    return this;
  };
  Validator.prototype.isFloat = function(tip, options) {
    if (this.goOn && !v.isFloat(String(this.value), options)) {
      this.addError(tip || this.key + ' is not float.');
    }
    return this;
  };
  
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
  Validator.prototype.len = Validator.prototype.isLength;
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
  Validator.prototype.isIn = Validator.prototype.in;
  Validator.prototype.eq = function(l, tip) {
    if (this.goOn && this.value != l) {
      this.addError(tip || this.key + ' is must equal ' + l + '.');
    }
    return this;
  };
  Validator.prototype.neq = function(l, tip) {
    if (this.goOn && this.value == l) {
      this.addError(tip || this.key + ' is must not equal ' + l + '.');
    }
    return this;
  };
  Validator.prototype.gt = function(l, tip) {
    if (this.goOn && this.value <= l) {
      this.addError(tip || this.key + ' must great than ' + l + '.');
    }
    return this;
  };
  Validator.prototype.lt = function(l, tip) {
    if (this.goOn && this.value >= l) {
      this.addError(tip || this.key + ' must less than ' + l + '.');
    }
    return this;
  };
  Validator.prototype.ge = function(l, tip) {
    if (this.goOn && this.value < l) {
      this.addError(tip || this.key + ' must great than or equal ' + l + '.');
    }
    return this;
  };
  Validator.prototype.le = function(l, tip) {
    if (this.goOn && this.value > l) {
      this.addError(tip || this.key + ' must less than or equal ' + l + '.');
    }
    return this;
  };
  Validator.prototype.contains = function(s, tip) {
    if (this.goOn && (!isString(this.value) || !v.contains(this.value, s))) {
      this.addError(tip || this.key + ' is must contain ' + s + '.');
    }
    return this;
  };
  Validator.prototype.notContains = function(s, tip) {
    if (this.goOn && (!isString(this.value) || v.contains(this.value, s))) {
      this.addError(tip || this.key + ' is must not contain ' + s + '.');
    }
    return this;
  };
  Validator.prototype.isEmail = function(tip, options) {
    if (this.goOn && (!isString(this.value) || !v.isEmail(this.value, options))) {
      this.addError(tip || this.key + ' is not email format.');
    }
    return this;
  };
  Validator.prototype.isUrl = function(tip, options) {
    if (this.goOn && (!isString(this.value) || !v.isURL(this.value, options))) {
      this.addError(tip || this.key + ' is not url format.');
    }
    return this;
  };
  Validator.prototype.isIp = function(tip, version) {
    if (this.goOn && (!isString(this.value) || !v.isIP(this.value, version))) {
      this.addError(tip || this.key + ' is not ip format.');
    }
    return this;
  };
  Validator.prototype.isAlpha = function(tip, locale) {
    if (this.goOn && (!isString(this.value) || !v.isAlpha(this.value, locale))) {
      this.addError(tip || this.key + ' is not an alpha string.');
    }
    return this;
  };
  Validator.prototype.isNumeric = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isNumeric(this.value))) {
      this.addError(tip || this.key + ' is  not numeric.');
    }
    return this;
  };
  
  Validator.prototype.isAlphanumeric = function(tip, locale) {
    if (this.goOn && (!isString(this.value) || !v.isAlphanumeric(this.value, locale))) {
      this.addError(tip || this.key + ' is not an aphanumeric string.');
    }
    return this;
  };
  Validator.prototype.isBase64 = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isBase64(this.value))) {
      this.addError(tip || this.key + ' is not a base64 string.');
    }
    return this;
  };
  Validator.prototype.isHexadecimal = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isHexadecimal(this.value))) {
      this.addError(tip || this.key + ' is not a hexa decimal string.');
    }
    return this;
  };
  Validator.prototype.isHexColor = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isHexColor(this.value))) {
      this.addError(tip || this.key + ' is  not hex color format.');
    }
    return this;
  };
  Validator.prototype.isLowercase = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isLowercase(this.value))) {
      this.addError(tip || this.key + ' is not a lowwer case string');
    }
    return this;
  };
  Validator.prototype.isUppercase = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isUppercase(this.value))) {
      this.addError(tip || this.key + ' is not a upper case string.');
    }
    return this;
  };
  Validator.prototype.isDivisibleBy = function(n, tip) {
    if (this.goOn && (!isString(this.value) || !v.isDivisibleBy(this.value, n))) {
      this.addError(tip || this.key + ' can not divide by' + n + '.');
    }
    return this;
  };
  Validator.prototype.isNull = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isNull(this.value))) {
      this.addError(tip || this.key + ' is not null.');
    }
    return this;
  };
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
  Validator.prototype.byteLength = Validator.prototype.isByteLength;
  Validator.prototype.isUUID = function(tip, ver) {
    if (this.goOn && (!isString(this.value) || !v.isUUID(this.value, ver))) {
      this.addError(tip || this.key + ' is not a UUID format.');
    }
    return this;
  };
  Validator.prototype.isDate = function(tip) {
    if (this.goOn && !util.isDate(this.value) && (!isString(this.value) || !v.isDate(this.value))) {
      this.addError(tip || this.key + ' is not a date format.');
    }
    return this;
  };
  Validator.prototype.isTime = function(tip) {
    var timeReg = /^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/;
    if (this.goOn && !timeReg.test(this.value)) {
      this.addError(tip || this.key + ' is not a time format.');
    }
    return this;
  };
  
  Validator.prototype.isAfter = function(d, tip) {
    if (this.goOn && (!isString(this.value) || !v.isAfter(this.value, d))) {
      this.addError(tip || this.key + ' must after ' + d + '.');
    }
    return this;
  };
  Validator.prototype.isBefore = function(d, tip) {
    if (this.goOn && (!isString(this.value) || !v.isBefore(this.value, d))) {
      this.addError(tip || this.key + ' must before ' + d + '.');
    }
    return this;
  };
  Validator.prototype.isCreditCard = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isCreditCard(this.value))) {
      this.addError(tip || this.key + ' is not credit card format.');
    }
    return this;
  };
  Validator.prototype.isISBN = function(tip, version) {
    if (this.goOn && (!isString(this.value) || !v.isISBN(this.value, version))) {
      this.addError(tip || this.key + ' is not a ISBN format.');
    }
    return this;
  };
  Validator.prototype.isJSON = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isJSON(this.value))) {
      this.addError(tip || this.key + ' is not a json format.');
    }
    return this;
  };
  
  Validator.prototype.isMultibyte = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isMultibyte(this.value))) {
      this.addError(tip || this.key + ' is not a multibyte string.');
    }
    return this;
  };
  Validator.prototype.isAscii = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isAscii(this.value))) {
      this.addError(tip || this.key + ' is not a ascii string.');
    }
    return this;
  };
  Validator.prototype.isFullWidth = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isFullWidth(this.value))) {
      this.addError(tip || this.key + ' is not a full width string.');
    }
    return this;
  };
  Validator.prototype.isHalfWidth = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isHalfWidth(this.value))) {
      this.addError(tip || this.key + ' is not a half width string.');
    }
    return this;
  };
  Validator.prototype.isVariableWidth = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isVariableWidth(this.value))) {
      this.addError(tip || this.key + ' is not a variable width string.');
    }
    return this;
  };
  Validator.prototype.isSurrogatePair = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isSurrogatePair(this.value))) {
      this.addError(tip || this.key + ' is not a surrogate pair string.');
    }
    return this;
  };
  Validator.prototype.isCurrency = function(tip, options) {
    if (this.goOn && (!isString(this.value) || !v.isCurrency(this.value, options))) {
      this.addError(tip || this.key + ' is not a currency format.');
    }
    return this;
  };
  Validator.prototype.isDataURI = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isDataURI(this.value))) {
      this.addError(tip || this.key + ' is not a data uri format.');
    }
    return this;
  };
  Validator.prototype.isMobilePhone = function(tip, locale) {
    if (this.goOn && (!isString(this.value) || !v.isMobilePhone(this.value, locale))) {
      this.addError(tip || this.key + ' is not a mobile phone format.');
    }
    return this;
  };
  Validator.prototype.isISO8601 = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isISO8601(this.value))) {
      this.addError(tip || this.key + ' is not a ISO8601 string format.');
    }
    return this;
  };
  Validator.prototype.isMACAddress = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isMACAddress(this.value))) {
      this.addError(tip || this.key + ' is not a MAC address format.');
    }
    return this;
  };
  
  Validator.prototype.isISIN = function(tip) {
    if (this.goOn && (!isString(this.value) || !v.isISIN(this.value))) {
      this.addError(tip || this.key + ' is not a ISIN format.');
    }
    return this;
  };
  Validator.prototype.isFQDN = function(tip, options) {
    if (this.goOn && (!isString(this.value) || !v.isFQDN(this.value, options))) {
      this.addError(tip || this.key + ' is not a fully qualified domain name format.');
    }
    return this;
  };
};
