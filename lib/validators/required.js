/*
Validator dependencies
*/
var V = require('../validations');
var optUtil = require('../utils/options');
var format = require('util').format;

const DEFAULT_MESSAGE = "Field '%s' is required.";

/*
Ensure that the given property exists in the given model.
*/
module.exports = function required(model, propName, options) {
  var isRequired = optUtil.getBoolean(options, 'required', true);

  return !isRequired || model.hasOwnProperty(propName) ||
         (options && options.message || format(V.translate(DEFAULT_MESSAGE), propName));
};
