function Validator(context, key, value, exists, params, goOn) {
  this.params = params;
  this.context = context;
  this.key = key;
  this.value = value;
  this.exists = exists;
  this.goOn = (goOn !== false);
  if (this.value && this instanceof FileValidator && 'goOn' in this.value) {
    this.goOn = this.value.goOn;
  }
};

function FileValidator(context, key, value, exists, params, deleteOnCheckFailed) {
  Validator.call(this, context, key, value, exists, params, true);
  this.deleteOnCheckFailed = deleteOnCheckFailed;
};

require('../lib/body_validators')(Validator);
require('../lib/body_sanitizers')(Validator);
require('../lib/json_validators')(Validator);

require('util').inherits(FileValidator, Validator);
require('../lib/file_sanitizers')(FileValidator);
require('../lib/file_validators')(FileValidator);

exports.Validator = Validator;
exports.FileValidator = FileValidator;
