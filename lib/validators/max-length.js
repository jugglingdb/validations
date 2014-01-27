/*
Validator dependencies
*/
var V = require('../validations');
var getInteger = require('../utils/number').getInteger;
var format = require('util').format;

const DEFAULT_MESSAGE = "Field '%s' must contain at most %d character(s).";
const DEFAULT_MAX_LENGTH = 255;

/*
Ensure that, if the property value is a string, it's length contains
the maximum amount of characters
*/
module.exports = function maxLength(model, propName, options) {
  var value = model[propName];
  var maxLen = getInteger(options) || (options && 'max' in options ? getInteger(options.max) : DEFAULT_MAX_LENGTH);

  return (!(typeof value === 'string') || (value.length <= maxLen)) ||
         (options && options.message || format(V.translate(DEFAULT_MESSAGE), propName, maxLen));
};
