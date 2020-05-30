const fs = require('fs');
/**
 * Helper function to copy file
 * @param  {string} src - path of source file
 * @param  {string} dst - path of destination
 * @returns {Promise}
 */
function coFsCopy(src, dst) {
  var srcStream = fs.createReadStream(src);
  var dstSteam = fs.createWriteStream(dst);

  srcStream.pipe(dstSteam);
  return new Promise((resolve, reject) => {
    srcStream.on('end', resolve);
    srcStream.on('error', reject);
    srcStream.on('close', reject);
  });
};
/**
 * Ensures the given directory exists, and creates if not.
 * @param  {string} dir - path of directory to ensure
 */
function ensureDir(dir) {
  const t = dir.substring(0, dir.lastIndexOf('/'));
  if (!fs.existsSync(t)) {
    ensureDir(t);
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};
/**
 * Deletes file at given path
 * @param  {string} path - path of file to be deleted
 * @param  {Function} cb - callback function
 */
function delFile(path, cb) {
  if (!path) {
    if (cb) cb();
    return;
  }
  fs.unlinkSync(path);
  if (cb) cb();
};
/**
 * Recursively deletes directory at given path
 * @param  {string} path - path of directory to be deleted
 * @param  {Function} cb - callback function
 */
function delDir(path, cb) {
  if (!path) {
    if (cb) cb();
    return;
  }
  var dir_array = fs.readdirSync(path);
  if (dir_array.length === 0) {
    fs.rmdirSync(path);
    return;
  }
  dir_array.forEach(function(dir) {
    const dir_path = `${path}/${dir}`;
    if (fs.lstatSync(dir_path).isDirectory()) {
      delDir(dir_path);
    } else {
      fs.unlinkSync(dir_path);
    }
  });
  fs.rmdirSync(path);
  if (cb) cb();
};

/**
 * Formats file size to string
 * @param  {int} size
 * @returns {string}
 */
function formatSize(size) {
  if (size < 1024) {
    return size + ' bytes';
  } else if (size >= 1024 && size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' kb';
  } else if (size >= 1024 * 1024 && size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + ' mb';
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' gb';
  }
};

exports.delDir = delDir;
exports.coFsCopy = coFsCopy;
exports.formatSize = formatSize;
exports.delFile = delFile;
exports.ensureDir = ensureDir;
