const {delFile, formatSize} = require('../utils/file.util');
module.exports = (FileValidator) => {
  FileValidator.prototype.notEmpty = function(tip) {
    if (this.goOn && (!this.value || this.value.size <= 0)) {
      this.addError(tip || 'file ' + this.key + ' can not be a empty file.');
      if (this.deleteOnCheckFailed) {
        delFile(this.value && this.value.path);
      }
    }
    return this;
  };
    
  FileValidator.prototype.size = function(min, max, tip) {
    if (this.goOn && (!this.value || this.value.size < min || this.value.size > max)) {
      this.addError(tip || 'file ' + (this.value && this.value.name || this.key) + "' length must between " + formatSize(min) + ' and ' + formatSize(max) + '.');
      if (this.deleteOnCheckFailed) {
        delFile(this.value && this.value.path);
      }
    }
    return this;
  };
  FileValidator.prototype.contentTypeMatch = function(reg, tip) {
    if (this.goOn && (!this.value || !reg.test(this.value.type))) {
      this.addError(tip || 'file ' + (this.value && this.value.name || this.key) + ' is bad format.');
      if (this.deleteOnCheckFailed) {
        delFile(this.value && this.value.path);
      }
    }
    return this;
  };
  FileValidator.prototype.isImageContentType = function(tip) {
    if (this.goOn && (!this.value || this.value.type.indexOf('image/') !== 0)) {
      this.addError(tip || 'file ' + (this.value && this.value.name || this.key) + ' is not a image format.');
      if (this.deleteOnCheckFailed) {
        delFile(this.value && this.value.path);
      }
    }
    return this;
  };
  FileValidator.prototype.fileNameMatch = function(reg, tip) {
    if (this.goOn && (!this.value || !reg.test(this.value.name))) {
      this.addError(tip || 'file ' + (this.value && this.value.name || this.key) + ' is bad file type.');
      if (this.deleteOnCheckFailed) {
        delFile(this.value && this.value.path);
      }
    }
    return this;
  };
  FileValidator.prototype.suffixIn = function(arr, tip) {
    if (this.goOn && (!this.value || arr.indexOf(this.value.name.lastIndexOf('.') == -1 ? '' : this.value.name.substring(this.value.name.lastIndexOf('.') + 1)) == -1)) {
      this.addError(tip || 'file ' + (this.value && this.value.name || this.key) + ' is bad file type.');
      if (this.deleteOnCheckFailed) {
        delFile(this.value && this.value.path);
      }
    }
    return this;
  };
};
