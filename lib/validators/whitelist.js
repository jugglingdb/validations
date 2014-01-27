/*
Validator dependencies
*/
var V = require('../validations');
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
*/
module.exports = function whitelist(model, propName, options) {
  var possibleValues = (options instanceof Array && options) ||
                       (options && options.values && options.values instanceof Array && options.values),
      strictCompare  = options && 'strictCompare' in options ? !!options.strictCompare : DEFAULT_STRICT_COMPARE,
      ignoreCase     = options && 'ignoreCase' in options ? options.ignoreCase : DEFAULT_IGNORE_CASE;

  if (possibleValues && possibleValues.length) {
    var value = model[propName];
    var valueIsString = (typeof value === 'string');

    if (ignoreCase && valueIsString) {
      value = value.toLocaleLowerCase();

      if (strictCompare) {
        for (var i=0, len=possibleValues.length; i<len; i++) {
          if (typeof possibleValues[i] === 'string' && value === possibleValues[i].toLocaleLowerCase()) return true;
        }
      } else {
        for (var i=0, len=possibleValues.length; i<len; i++) {
          if (typeof possibleValues[i] === 'string' && value == possibleValues[i].toLocaleLowerCase() || value == possibleValues[i]) return true;
        }
      }
    } else {
      if (strictCompare) {
        for (var i=0, len=possibleValues.length; i<len; i++) {
          if (value === possibleValues[i]) return true;
        }
      } else {
        for (var i=0, len=possibleValues.length; i<len; i++) {
          if (value == possibleValues[i]) return true;
        }
      }
    }

    return (options && options.message || format(V.translate(DEFAULT_MESSAGE), propName));
  }

  return true;
};
