/*
Validator dependencies
*/
var V = require('../validations');
var optUtil = require('../utils/options');
var format = require('util').format;

const DEFAULT_MESSAGE = "Invalid value for field '%s'";
/*
Use strict comparison '===' when checking identity (true), or loose comparison '==' (false)
*/
const DEFAULT_STRICT_COMPARE = true;
/*
Ignore case when comparing strings
*/
const DEFAULT_IGNORE_CASE = false;

/*
Ensure that the given property exists in the given possible values.

Options:

 - {Array}    define the restricted values (see defaults)
 - {Object}   option object :
               - values {Array}           the array of restricted values
               - strictCompare {boolean}  if values should be compared in a strict way ('===') or not ('==') (default true)
               - ignoreCase {boolean}     compare strings ignoring cases (default false)
               - message (String)         the invalid / error message (default "Invalid value for field '%s'")

*/
module.exports = function whitelist(model, propName, options) {
  var restrictedValues = optUtil.getArray(options, 'values'),
      strictCompare    = optUtil.getBoolean(options, 'strictCompare', DEFAULT_STRICT_COMPARE),
      ignoreCase       = optUtil.getBoolean(options, 'ignoreCase', DEFAULT_IGNORE_CASE);

  if (restrictedValues && restrictedValues.length) {
    var value = model.__data[propName];
    var valueIsString = (typeof value === 'string');
    var valid = true;

    if (ignoreCase && valueIsString) {
      value = value.toLocaleLowerCase();

      if (strictCompare) {
        for (var i=0, len=restrictedValues.length; i<len && valid; i++) {
          if (typeof restrictedValues[i] === 'string' && value === restrictedValues[i].toLocaleLowerCase()) valid = false;
        }
      } else {
        for (var i=0, len=restrictedValues.length; i<len && valid; i++) {
          if (typeof restrictedValues[i] === 'string' && value == restrictedValues[i].toLocaleLowerCase() || value == restrictedValues[i]) valid = false;
        }
      }
    } else {
      if (strictCompare) {
        for (var i=0, len=restrictedValues.length; i<len && valid; i++) {
          if (value === restrictedValues[i]) valid = false;
        }
      } else {
        for (var i=0, len=restrictedValues.length; i<len && valid; i++) {
          if (value == restrictedValues[i]) valid = false;
        }
      }
    }

    return valid || (options && options.message || format(V.translate(DEFAULT_MESSAGE), propName));
  }

  return true;
};
