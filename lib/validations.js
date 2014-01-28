
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


var ModelValidator = function(model, rules, done) {
  if (!(done instanceof Function))
    throw "Argument 'done' is not a function.";

  this.model = model;
  this.rules = rules;
  this.done = done;

  this.propertyStack = Object.keys(rules || {}).reverse();
  this.currentProperty = undefined;
  this.validatorStack = undefined;
  this.currentValidator = undefined;

  this.errors = [];
};

ModelValidator.prototype.processNextValidator = function processNextValidator() {
  var validatorCallback,
      validatorOptions,
      result;

  if (!(this.propertyStack.length || this.validatorStack.length)) {
    return this.finalizeValidation()
  } else {
    this.currentValidator = undefined;

    while (this.propertyStack && !this.validatorStack.length) {
      this.currentProperty = this.propertyStack.pop();
      this.validatorStack = Object.keys(this.rules[this.currentProperty] || {});
    }

    if (!this.validatorStack.length) {
      return this.finalizeValidation()
    } else {
      this.currentValidator = this.validatorStack.pop();
    }
  }

  // process...
  validatorCallback = requireValidator(this.currentValidator);
  validatorOptions = this.rules[this.currentProperty][this.currentValidator];

  if (validatorCallback.length === 4) {
    validatorCallback(this.model, this.currentProperty, validatorOptions, this.pushValidatorResult);
  } else {
    result = validatorCallback(this.model, this.currentProperty, validatorOptions);

    if (result.next instanceof Function) {
      result = (function consumeGenerator(generator) {
        while (!(result = generator.next(result.value)).done);
        return result.value;
      })(result);
    }

    this.pushValidatorResult(result);
  }
};

ModelValidator.prototype.pushValidatorResult = function pushValidatorResult(result) {
  if (typeof result === 'string') {
    this.errors.push(result);
  }
  //process.nextTick(function() { this.processNextValidator(); });
  this.processNextValidator();
};

ModelValidator.prototype.finalizeValidation = function finalizeValidation() {
  this.done(this.errors.length && this.errors || null, this.model);
};


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
Define a custom validator, or override an existing one. The callback
may be async; there are actually two ways to treat the validator as 'async' :

  1. the callback function has 4 arguments; the last one should be the 'next'
     function callback, the model validation will not resume until it gets called
     by the validator.
  2. the callback is a generator and returns an object with a property 'next',
     which is a function. This function will get called until it's returned value
     has a property 'done' that is equal to true (ie. r.done === true)

Any other condition will be considered sync'ed and will chain to the next
validator as soon as the previous one returns.
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
var requireValidator = module.exports.require = function requireValidator(validator) {
  var validatorName = validatorNameSanitize(validator);

  try {
    return custom_validators[validatorName] || require(VALIDATOR_PATH + validatorFilename(validator));
  } catch (e) {
    throw "Unknown validator : " + validator; // + " (" + validatorFilename(validator) + ")";
  }
};

/*
Validate the given model with the validation rules and call the callback once everything is done.
*/
module.exports.validate = function validateModel(model, rules, callback) {
  new ModelValidator(model, rules, callback).processNextValidator();
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
