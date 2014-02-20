
const VALIDATION_MODULE = '../lib/validations';
const VALIDATOR_PATH = '../lib/validators/';

var fs = require('fs');
var assert = require("assert");

describe('Test Validations', function() {
  var Validations;
  var _translator;
  var testValidatorMarker = '%test%__Validators';

  var validator = 'fooTestFoo';
  var validatorCallback = function validatorCallback(model, propertyName, options) {
    propertyName.should.equal('foo');
    model.__data.should.have.property(propertyName);
    options.should.be.have.property('test');
    options.test.should.be.true;
    // modify model to test validator
    (model[testValidatorMarker] = (model[testValidatorMarker] || [])).push(validatorCallback.name);
    return true;
  };
  var validatorAsyncCallback = function validatorAsyncCallback(model, propertyName, options, done) {
    propertyName.should.equal('foo');
    model.__data.should.have.property(propertyName);
    options.should.be.have.property('test');
    options.test.should.be.true;
    setTimeout(function() {
      // modify model to test validator
      (model[testValidatorMarker] = (model[testValidatorMarker] || [])).push(validatorAsyncCallback.name);
      done(true);
    }, 200);
  };
  var validatorGeneratorCallback = function validatorGeneratorCallback(model, propertyName, options) {
    var generator = {};
    var counter = 2;
    propertyName.should.equal('foo');
    model.__data.should.have.property(propertyName);
    options.should.be.have.property('test');
    options.test.should.be.true;
    Object.defineProperty(generator, 'next', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function() {
        var counterValue = ((--counter) === 0);
        // modify model to test validator
        if (counterValue) {
          (model[testValidatorMarker] = (model[testValidatorMarker] || [])).push(validatorGeneratorCallback.name);
        }
        return {
          value: counterValue,
          done: counterValue
        };
      }
    });

    return generator;
  };
  var validationError = "Fail validator test";
  var validatorInvalid = function validatorInvalid(model, propertyName, options) {
    return validationError;
  };
  var validatorException = function validatorException(model, propertyName, options) {
    throw validationError;
  };

  var model;
  var rules;


  beforeEach(function() {
    delete require.cache[require.resolve(VALIDATION_MODULE)];
    Validations = require(VALIDATION_MODULE);

    _translator = Validations.translator();

    // reset model and rules
    model = {
      __data: {
        foo: 'bar'
      }
    };
    rules = {
      'foo': {}
    };
    rules['foo'][validator] = { 'test': true };
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
    it('should validate synchronously', function(done) {
      Validations.define(validator, validatorCallback);

      model.should.not.have.property(testValidatorMarker);

      Validations.validate(model, rules , function(err, valid) {
        valid.should.be.true;
        assert.strictEqual(err, null);
        model.should.equal(this);
        model.should.have.property(testValidatorMarker);
        model[testValidatorMarker].should.eql([validatorCallback.name]);

        done();
      });
    });

    it('should validate asynchronously', function(done) {
      Validations.define(validator, validatorAsyncCallback);

      model.should.not.have.property(testValidatorMarker);

      Validations.validate(model, rules, function(err, valid) {
        assert.equal(err, null);
        model.should.equal(this);
        model.should.have.property(testValidatorMarker);
        model[testValidatorMarker].should.eql([validatorAsyncCallback.name]);

        done();
      });
    });

    it('should validate generator', function(done) {
      Validations.define(validator, validatorGeneratorCallback);

      model.should.not.have.property(testValidatorMarker);

      Validations.validate(model, rules, function(err, valid) {
        assert.equal(err, null);
        model.should.equal(this);
        model.should.have.property(testValidatorMarker);
        model[testValidatorMarker].should.eql([validatorGeneratorCallback.name]);
        done();
      });
    });

    it('should chain validators in their respective order', function(done) {
      var validators = [
        validatorCallback, validatorAsyncCallback, validatorGeneratorCallback
      ];
      var validatorIndex = 4;
      var testValidatorIndex = function() {
        var testedValidator;
        var i;

        if (validatorIndex >= validators.length) done();
        testedValidator = validators[validatorIndex];
        rules['foo'] = {}; // reset rules
        for (i = 0; i < validators.length; i++) {
          rules['foo'][validators[(i + validatorIndex + 1) % validators.length].name] = { 'test': true };
        }

        Validations.validate(model, rules, function(err, valid) {
          assert.equal(err, null);
          model.should.equal(this);
          model.should.have.property(testValidatorMarker);
          model[testValidatorMarker].should.eql(validators.map(function(item) { return item.name; }));

          validatorIndex++;
          testValidatorIndex();
        });
      };

      validators.forEach(function(validator) {
        Validations.define(validator.name, validator);
      });

      testValidatorIndex();
    });

    it('should fail', function(done) {
      Validations.define(validator, validatorInvalid);

      Validations.validate(model, rules, function(err, valid) {
        valid.should.be.false;
        assert.notStrictEqual(err, null);
        err.should.have.property('foo');
        err['foo'].should.eql([validationError]);
        done();
      });
    });

    it('should fail without throwing an exception', function(done) {
      Validations.define(validator, validatorException);

      Validations.validate(model, rules, function(err, valid) {
        valid.should.be.false;
        assert.notStrictEqual(err, null);
        err.should.have.property('foo');
        err['foo'].should.eql([validationError]);
        done();
      });
    });
  });

  // test only if...
  it('should validate "if" is true for a given rule', function(done) {
    var testValues = [
      'bar',
      function() {
        model.should.equal(this);
        return true;
      },
      'modelCallback'
    ];

    Validations.define(validator, validatorInvalid);
    model.modelCallback = testValues[1];
    model.__data.bar = true;

    (function testNextValue() {
      if (!testValues.length) {
        return done();
      }

      rules['foo'][validator]['if'] = testValues.pop();
      Validations.validate(model, rules, function(err, valid) {
        valid.should.be.false;
        assert.notStrictEqual(err, null);
        err.should.have.property('foo');
        err['foo'].should.eql([validationError]);
        testNextValue();
      });
    })();
  });

  // test only if...
  it('should not validate "if" is false for a given rule', function(done) {
    var testValues = [
      'bar',
      function() {
        model.should.equal(this);
        return false;
      },
      'modelCallback'
    ];

    Validations.define(validator, validatorInvalid);
    model.modelCallback = testValues[1];

    (function testNextValue() {
      if (!testValues.length) {
        return done();
      }

      rules['foo'][validator]['if'] = testValues.pop();
      Validations.validate(model, rules, function(err, valid) {
        valid.should.be.true;
        assert.strictEqual(err, null);
        model.should.equal(this);
        model.should.not.have.property(testValidatorMarker);
        testNextValue();
      });
    })();

  });

  // do NOT test unless...
  it('should validate "unless" is false for a given rule', function(done) {
    var testValues = [
      'bar',
      function() {
        model.should.equal(this);
        return false;
      },
      'modelCallback'
    ];

    Validations.define(validator, validatorInvalid);
    model.modelCallback = testValues[1];

    (function testNextValue() {
      if (!testValues.length) {
        return done();
      }

      rules['foo'][validator]['unless'] = testValues.pop();
      Validations.validate(model, rules, function(err, valid) {
        valid.should.be.false;
        assert.notStrictEqual(err, null);
        err.should.have.property('foo');
        err['foo'].should.eql([validationError]);
        testNextValue();
      });
    })();

  });

  // do NOT test unless...
  it('should not validate "unless" is true for a given rule', function(done) {
    var testValues = [
      'bar',
      function() {
        model.should.equal(this);
        return true;
      },
      'modelCallback'
    ];

    Validations.define(validator, validatorInvalid);
    model.modelCallback = testValues[1];
    model.__data.bar = true;

    (function testNextValue() {
      if (!testValues.length) {
        return done();
      }

      rules['foo'][validator]['unless'] = testValues.pop();
      Validations.validate(model, rules , function(err, valid) {
        valid.should.be.true;
        assert.strictEqual(err, null);
        model.should.equal(this);
        model.should.not.have.property(testValidatorMarker);
        testNextValue();
      });
    })();

  });
});
