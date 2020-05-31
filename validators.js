/**
 * @classdesc used to validate request
 * @class
 * @param  {object} context - koa ctx instance
 * @param  {string} key - key to validate in request
 * @param  {object} value - value of key if exists
 * @param  {bool} exists - if key exists
 * @param  {} params
 * @param  {bool} goOn
 */
class Validator {
  constructor(context, key, value, exists, params, goOn) {
    this.params = params;
    this.context = context;
    this.key = key;
    this.value = value;
    this.exists = exists;
    this.goOn = (goOn !== false);
    if (this.value && this instanceof FileValidator && 'goOn' in this.value) {
      this.goOn = this.value.goOn;
    }
  }
};

/**
 * @classdesc used to validate files attached to request
 * @class
 * @param  {object} context - koa ctx instance
 * @param  {string} key - key to validate in request
 * @param  {object} value - value of key if exists
 * @param  {bool} exists - if key exists
 * @param  {} params
 * @param  {bool} deleteOnCheckFailed - deletes file if any validation fails
 * @augments Validator
 */
class FileValidator extends Validator {
  constructor(context, key, value, exists, params, deleteOnCheckFailed) {
    super(context, key, value, exists, params, true);
    this.deleteOnCheckFailed = deleteOnCheckFailed;
  }
};

require('./lib/body_validators')(Validator);
require('./lib/body_sanitizers')(Validator);
require('./lib/json_validators')(Validator);

require('util').inherits(FileValidator, Validator);
require('./lib/file_sanitizers')(FileValidator);
require('./lib/file_validators')(FileValidator);

exports.Validator = Validator;
exports.FileValidator = FileValidator;
