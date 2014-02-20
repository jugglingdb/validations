/*
Validator dependencies
*/
var V = require('../validations');
var optUtil = require('../utils/options');
var format = require('util').format;

const DEFAULT_MESSAGE = "Field '%s' is required.";

const DEFAULT_REQUIRED = true;

/*
Ensure that the given property exists in the given model.

Options:

 - {Boolean}   the property is required (true) or not (false) (default true)
 - {Object}    option object :
                - required {Boolean}  the property is required or not (default true)
                - message (String)    the invalid / error message (default "Field '%s' is required.")

*/
module.exports = function required(model, propName, options) {
  var isRequired = optUtil.getBoolean(options, 'required', DEFAULT_REQUIRED);

  return !isRequired || model.__data.hasOwnProperty(propName) ||
         (options && options.message || format(V.translate(DEFAULT_MESSAGE), propName));
};
