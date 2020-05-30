/**
 * Determines if object is a string
 * @param  {object} s
 */
exports.isString = (s) => {
  if (s == null) return false;
  return typeof (s) == 'string';
};
