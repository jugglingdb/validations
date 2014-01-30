/*
Validator dependencies
*/
var V = require('../validations');
var optUtil = require('../utils/options');
var getDecimal = require('../utils/number').getDecimal;
var format = require('util').format;

const DEFAULT_MESSAGE = "Field '%s' must be a valid decimal.";
const DEFAULT_POSITIVE = true;
const DEFAULT_NEGATIVE = true;
const DEFAULT_ZERO = true;

/*
Ensure that the given property is a number
*/
module.exports = function decimal(model, propName, options) {
  var positive  = optUtil.getBoolean(options, 'positive', DEFAULT_POSITIVE),
      negative  = optUtil.getBoolean(options, 'negative', DEFAULT_NEGATIVE),
      zero      = optUtil.getBoolean(options, 'zero', DEFAULT_ZERO),
      value     = getDecimal(model[propName]);

  return (options === false) || !(positive || negative || zero) ||
         ((value !== false) && (positive && (value > 0)) || (negative && (value < 0)) || (zero && (value === 0))) ||
         (options && options.message || format(V.translate(DEFAULT_MESSAGE), propName));
};
