/*
Validator dependencies
*/
var V = require('../validations');
var optUtil = require('../utils/options');
var format = require('util').format;

const DEFAULT_MESSAGE = "Field '%s' must contain at most %d character(s).";
const DEFAULT_MAX_LENGTH = 255;

/*
Ensure that, if the property value is a string, it's length contains
the maximum amount of characters

Options:

 - {Number}    the maximum length of the string (default 255)
 - {Object}    option object :
                - max {Number}       the maximum length of the string (default 255)
                - message (String)   the invalid / error message (default "Field '%s' must contain at most %d character(s).")

*/
module.exports = function maxLength(model, propName, options) {
  var value = model.__data[propName];
  var maxLen = optUtil.getInteger(options, 'max', DEFAULT_MAX_LENGTH);

  return (!(typeof value === 'string') || (value.length <= maxLen)) ||
         (options && options.message || format(V.translate(DEFAULT_MESSAGE), propName, maxLen));
};
