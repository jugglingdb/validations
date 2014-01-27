/*
Validator dependencies
*/
var V = require('../validations');
var getInteger = require('../utils/number').getInteger;
var format = require('util').format;

const DEFAULT_MESSAGE = "Field '%s' must contain at least %d character(s).";
const DEFAULT_MIN_LENGTH = 3;

/*
Ensure that, if the property value is a string, it's length contains
the minimum amount of characters
*/
module.exports = function minLength(model, propName, options) {
  var value = model[propName];
  var minLen = getInteger(options) || (options && 'min' in options ? getInteger(options.min) : DEFAULT_MIN_LENGTH);

  return (!(typeof value === 'string') || (value.length >= minLen)) ||
         (options && options.message || format(V.translate(DEFAULT_MESSAGE), propName, minLen));
};
