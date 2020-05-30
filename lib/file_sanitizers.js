const {ensureDir, coFsCopy } = require('../utils/file.util');
const fs = require('fs');
const path = require('path');

module.exports = (FileValidator) => {
  FileValidator.prototype.move = function(dst, afterMove) {
    if (this.goOn && this.value) {
      this.copy(dst);
      fs.unlinkSync(this.value.path);
      if (typeof afterMove == 'function') {
        afterMove(this.value, this.key, this.context);
      } 
    }
    return this;
  };
  FileValidator.prototype.copy = function(dst, afterCopy) {
    if (this.goOn && this.value) {
      var dstFile = dst;
      if (typeof dst == 'function') {
        dstFile = dst(this.value, this.key, this.context);
      }
      if (!fs.existsSync(this.value.path)) {
        this.addError('upload file does not exist');
        return;
      }
      if (dstFile.length - 1 == dstFile.lastIndexOf('/') || dstFile.length - 1 == dstFile.lastIndexOf('\\') || fs.existsSync(dstFile) && fs.statSync(dstFile)) {
        dstFile = path.join(dstFile, path.basename(this.value.path));
      }
      ensureDir(path.dirname(dstFile));
      coFsCopy(this.value.path, dstFile);
      this.value.newPath = dstFile;
      if (afterCopy) {
        if (typeof afterCopy == 'function') {
          afterCopy(this.value, this.key, this.context);
        } 
      }
    }
    return this;
  };
  FileValidator.prototype.delete = function() {
    if (this.goOn && this.value) {
      fs.unlinkSync(this.value.path);
    }
    return this;
  };
};
