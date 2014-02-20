/*
Validator dependencies
*/
var V = require('../validations');
var optUtil = require('../utils/options');
var getNumber = require('../utils/number').getNumber;
var format = require('util').format;

const DEFAULT_MESSAGE = "Field '%s' must be a valid number.";
const DEFAULT_POSITIVE = true;
const DEFAULT_NEGATIVE = true;
const DEFAULT_ZERO = true;

/*
Ensure that the given property is a number (decimal or integer)

Options:

 - {Boolean}   the model's property must be any numeric value (true) or not (false) (default true) [1]
 - {Object}    option object :
                - positive {Boolean}   if the value can be positive (default true)
                - negative {Boolean}   if the value can be negative (default true)
                - zero {boolean}       if the value can be zero (default true)
                - message (String)     the invalid / error message (default "Field '%s' must be a valid number.")

[1] if options is set to false, or if 'positive', 'negative', and 'zero' are false, then the validation is ignored.

*/
module.exports = function number(model, propName, options) {
  var positive  = optUtil.getBoolean(options, 'positive', DEFAULT_POSITIVE),
      negative  = optUtil.getBoolean(options, 'negative', DEFAULT_NEGATIVE),
      zero      = optUtil.getBoolean(options, 'zero', DEFAULT_ZERO),
      value     = getNumber(model.__data[propName]);

  return (!(positive || negative || zero) && (value === false)) ||
         (positive && (value > 0)) || (negative && (value < 0)) || (zero && (value === 0)) ||
         (options && options.message || format(V.translate(DEFAULT_MESSAGE), propName));
};
