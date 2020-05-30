const {delFile, formatSize} = require('../utils/file.util');
module.exports = (FileValidator) => {
  /**
   * Checks that file is not empty
   * @param  {String} tip - message to return if test fails
   */
  FileValidator.prototype.notEmpty = function(tip) {
    if (this.goOn && (!this.value || this.value.size <= 0)) {
      this.addError(tip || 'file ' + this.key + ' can not be a empty file.');
      if (this.deleteOnCheckFailed) {
        delFile(this.value && this.value.path);
      }
    }
    return this;
  };
    
  /**
   * Checks size of file is between values
   * @param  {int} min - minimum file size
   * @param  {int} max - maximum file size
   * @param  {String} tip - message to return if test fails
   */
  FileValidator.prototype.size = function(min, max, tip) {
    if (this.goOn && (!this.value || this.value.size < min || this.value.size > max)) {
      this.addError(tip || 'file ' + (this.value && this.value.name || this.key) + "' length must between " + formatSize(min) + ' and ' + formatSize(max) + '.');
      if (this.deleteOnCheckFailed) {
        delFile(this.value && this.value.path);
      }
    }
    return this;
  };
  /**
   * Check the file's contentType with regular expression
   * @param  {RegExp} reg
   * @param  {String} tip - message to return if test fails
   */
  FileValidator.prototype.contentTypeMatch = function(reg, tip) {
    if (this.goOn && (!this.value || !reg.test(this.value.type))) {
      this.addError(tip || 'file ' + (this.value && this.value.name || this.key) + ' is bad format.');
      if (this.deleteOnCheckFailed) {
        delFile(this.value && this.value.path);
      }
    }
    return this;
  };
  /**
   * Check if content type is of image.
   * @param  {String} tip - message to return if test fails
   */
  FileValidator.prototype.isImageContentType = function(tip) {
    if (this.goOn && (!this.value || this.value.type.indexOf('image/') !== 0)) {
      this.addError(tip || 'file ' + (this.value && this.value.name || this.key) + ' is not a image format.');
      if (this.deleteOnCheckFailed) {
        delFile(this.value && this.value.path);
      }
    }
    return this;
  };
  /**
   * Check the file's name with regular expression
   * @param  {RegExp} reg
   * @param  {String} tip - message to return if test fails
   */
  FileValidator.prototype.fileNameMatch = function(reg, tip) {
    if (this.goOn && (!this.value || !reg.test(this.value.name))) {
      this.addError(tip || 'file ' + (this.value && this.value.name || this.key) + ' is bad file type.');
      if (this.deleteOnCheckFailed) {
        delFile(this.value && this.value.path);
      }
    }
    return this;
  };
  /**
   * Check the suffix of file's if in specified arr. arr eg. ['png','jpg']
   * @param  {Array} arr
   * @param  {String} tip - message to return if test fails
   */
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
