'use strict';
const jpath = require('json-path');

const {Validator, FileValidator } = require('./models/validators');

module.exports.Validator = Validator;
module.exports.FileValidator = FileValidator;

const getValue = (obj, key, transfn) => {
  if ((key.indexOf('/') == 0 || key.indexOf('#/') == 0) && transfn) {
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

module.exports = (app) => {
  app.context.checkQuery = function(key, transFn) {
    return new Validator(this, key, getValue(this.request.query, key, transFn), hasKey(this.request.query, key, transFn), this.request.query);
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
    return new Validator(this, key, getValue(bobody, key, transFn), hasKey(bobody, key, transFn), bobody);
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
