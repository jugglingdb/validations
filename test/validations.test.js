
const VALIDATION_MODULE = '../lib/validations';
const VALIDATOR_PATH = '../lib/validators/';

var fs = require('fs');

describe('Test Validations', function() {
  var Validations;
  var _translator;

  var validator = 'fooTestFoo';
  var validatorCallback = function validatorCallback(model, propertyName, options) {
    return true;
  };
  var validatorAsyncCallback = function foo(model, propertyName, options, done) {
    setTimeout(function() { done(true); }, 1000);
  };
  var validatorGeneratorCallback = function bar(model, propertyName, options) {
    var generator = {};
    var counter = 2;
    Object.defineProperty(genrator, 'next', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function() {
        return {
          value: ((counter--) === 0),
          done: (counter === 0)
        };
      }
    });

    return generator;
  };

  beforeEach(function() {
    delete require.cache[require.resolve(VALIDATION_MODULE)];
    Validations = require(VALIDATION_MODULE);

    _translator = Validations.translator();
  });
  afterEach(function() {
    Validations.translator(_translator);
  });

  it('should have valid translator', function() {
    Validations.translator().should.be.a.Function;
    Validations.translator()("Foo").should.be.equal("Foo");

    (function() {
      Validations.translator("foo");
    }).should.throw();

  });
  it('should allow swapping translator', function() {
    // Since the default is exactly the same function, don't expect anything else...
    Validations.translator(function(message) { return message; })("test").should.equal("test");

    Validations.translate("test").should.equal("test");

    // returns the old one...
    Validations.translator(function(message) { return "bar"; })("foo").should.equal("foo");

    Validations.translate("test").should.equal("bar");

    // restore original behaviour
    Validations.translator(function(message) { return message; });
  });

  describe('where calling require', function() {
    it('should return all the existing validators', function(done) {
      fs.readdir('./lib/validators', function(err,files) {
        if (err) throw err;

        for (var i=0; i<10; i++) { // check for consistency
          files.forEach(function(file){
            var validator = file.replace('.js', '');

            Validations.require(validator).should.not.be.empty;
            Validations.require(validator).should.be.a.Function;
          });
        }

        done();
      });
    });

    it('should fail to return unknown or invalid validators', function() {
      [
        "some-unknown-foo-validator",
        "__INVALID+VALIDATOR%NAME", true, false, undefined, [], {}, 123
      ].forEach(function(invalidValidator) {
        (function() {
          Validations.require(invalidValidator);
        }).should.throw();
      });
    });
  });

  describe('where calling define', function() {
    it('should override built-in validators', function(done) {
      var mockValidator = function() { return true; };

      fs.readdir('./lib/validators', function(err,files){
        if (err) throw err;
        files.forEach(function(file){
          var validator = file.replace('.js', '');
          var validatorCallback = require(VALIDATOR_PATH + validator);

          Validations.require(validator).should.equal(validatorCallback);

          Validations.define(validator, mockValidator);

          Validations.require(validator).should.not.equal(validatorCallback);
          Validations.require(validator).should.equal(mockValidator);
        });

        done();
      });
    });

    it('should define new synchronous validators', function() {
      (function() {
        Validations.requrie(validator);
      }).should.throw();

      Validations.define(validator, validatorCallback);
      Validations.require(validator).should.equal(validatorCallback);
    });

    it('should define new asynchronous validators', function() {
      (function() {
        Validations.requrie(validator);
      }).should.throw();

      Validations.define(validator, validatorAsyncCallback);
      Validations.require(validator).should.equal(validatorAsyncCallback);

      /*
        Since generators are harmony features, we will simply simulate a generator here...
      */
      Validations.define(validator, validatorGeneratorCallback);
      Validations.require(validator).should.equal(validatorGeneratorCallback);
    });
  });

  describe('where validating models', function() {
    it('should validate synchronously');

    it('should validate asynchronously');

    it('should fail');
  });
});
