
/*
Where to find the validators
*/
const VALIDATOR_PATH = __dirname + '/validators/';

/*
Where custom validators are defined, or when overriding the provided ones.
*/
var custom_validators = {};
/*
Translator function
*/
var translator = function(message) { return message; };

/*
Override the default translator function, or get the current translator.
When calling as a setter, the function returns the old translator.
*/
module.exports.translator = function messageTranslator(callback) {
  var _previous = translator;

  if (arguments.length > 0) {

    if (!(callback instanceof Function))
      throw "The translator callback must be a function.";

    translator = callback;
  }

  return _previous;
};

/*
Helper function that calls the translator with the given message.
*/
module.exports.translate = function messageTranslate(message) {
  return translator(message);
};


/*
Define a custom validator, or override an existing one
*/
module.exports.define = function defineValidator(validator, callback) {
  if (!(callback instanceof Function))
    throw "The validator callback must be a function.";

  var validatorName = validatorNameSanitize(validator);

  if (!(validatorName && validatorName.length))
    throw "Invalid validator name " + validator;

  custom_validators[validatorName] = callback;
};

/*
Require the given validator
*/
module.exports.require = function requireValidator(validator) {
  var validatorName = validatorNameSanitize(validator);

  try {
    return custom_validators[validatorName] || require(VALIDATOR_PATH + validatorFilename(validator));
  } catch (e) {
    throw "Unknown validator : " + validator + " (" + validatorFilename(validator) + ")";
  }
};

/*
Validate the given model
*/
module.exports.validate = function validateModel(model) {
  throw "Not implemented!";
};


function validatorFilename(validator) {
  return String(validator).trim()
    .replace(/([a-z\d])([A-Z]+)/g, '$1-$2')
    .replace(/[-\s]+/g, '-')
    .toLowerCase();
};

function validatorNameSanitize(validator) {
  return String(validator).trim()
    .toLowerCase()
    .replace(/[-\s]+([a-z])/g, function(a, b) { return b.toUpperCase(); })
    .replace(/\W+/g, '');
};
