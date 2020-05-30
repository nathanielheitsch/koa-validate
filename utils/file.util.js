const fs = require('fs');

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

function ensureDir(dir) {
  const t = dir.substring(0, dir.lastIndexOf('/'));
  if (!fs.existsSync(t)) {
    ensureDir(t);
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

function delFile(path, cb) {
  if (!path) {
    if (cb) cb();
    return;
  }
  fs.unlinkSync(path);
  if (cb) cb();
};

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
