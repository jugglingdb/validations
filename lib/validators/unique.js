/*
Validator dependencies
*/
var V = require('../validations');
var optUtil = require('../utils/options');
var format = require('util').format;

const DEFAULT_MESSAGE = "Field '%s' is not unique.";

const DEFAULT_UNIQUE = true;

const DEFAULT_WHERE_CALLBACK = undefined;

/*
Ensure that the given property exists in the given model.

NOTE : This validator is async.

Options:

 - {Boolean}   the property must be unique (true) or not (false) (default true)
 - {Object}    option object :
                - unique {Number}    the property is unique (true) or not (false) (default true)
                - where {Function}   override or extend the 'where' condition object to validate the model (default undefined)
                - message (String)   the invalid / error message (default "Field '%s' is not unique.")

*/
module.exports = function unique(model, propName, options, done) {
  var isUnique = optUtil.getBoolean(options, 'unique', DEFAULT_UNIQUE);
  var whereCallback = optUtil.getFunction(options, 'where', DEFAULT_WHERE_CALLBACK);
  var where = {};

  if (!isUnique) return done(true), undefined;

  where[propName] = model[propName];

  if (whereCallback)
    where = whereCallback(where) || where;

  (model.__proto__.constructor).findOne({ where: where }, function(err, found) {
    done(!found || (options && options.message || format(V.translate(DEFAULT_MESSAGE), propName)));
  });
};
