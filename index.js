'use strict';
const jpath = require('json-path');
const kv = require('./utils/kv.util')(jpath);

const {Validator, FileValidator } = require('./models/validators');

module.exports.Validator = Validator;
module.exports.FileValidator = FileValidator;

module.exports = (app) => {
  app.context.checkQuery = function(key, transFn) {
    return new Validator(this, key, kv.getValue(this.request.query, key, transFn), kv.hasKey(this.request.query, key, transFn), this.request.query);
  };
  app.context.checkParams = function(key) {
    return new Validator(this, key, this.params[key], key in this.params, this.params);
  };
  app.context.checkHeader = function(key) {
    return new Validator(this, key, this.header[key], key in this.header, this.header);
  };
  app.context.checkBody = function(key, transFn) {
    var body = this.request.body;

    if (!body) {
      if (!this.errors) {
        this.errors = ['no body to check!'];
      }
      return new Validator(this, null, null, false, null, false);
    }
    var bobody = body.fields || body;	// koa-body fileds. multipart fields in body.fields
    return new Validator(this, key, kv.getValue(bobody, key, transFn), kv.hasKey(bobody, key, transFn), bobody);
  };
  app.context.checkFile = function(key, deleteOnCheckFailed) {
    if (typeof this.request.body == 'undefined' || typeof this.request.files == 'undefined') {
      if (!this.errors) {
        this.errors = ['no file to check'];
      }
      return new Validator(this, null, null, false, null, false);
    }
    deleteOnCheckFailed = (typeof deleteOnCheckFailed == 'undefined');
    var files = this.request.files;
    return new FileValidator(this, key, files && files[key], !!(files && files[key]), this.request.body, deleteOnCheckFailed);
  };
  app.context.errors = null;
};
