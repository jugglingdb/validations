
var fs = require('fs');
var Validations = require('../lib/validations');

describe('Test Validations', function() {
  var _translator;

  beforeEach(function() {
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
      fs.readdir('./lib/validators', function(err,files){
        if (err) throw err;
        files.forEach(function(file){
          var validator = file.replace('.js', '');

          Validations.require(validator).should.not.be.empty;
          Validations.require(validator).should.be.a.Function;
        });

        done();
      });
    });

    it('should fail to return unknown validators');
  });

  describe('where calling define', function() {
    it('should define new validators');

    it('should override built-in validators');
  });

  describe('where validating models', function() {
    it('should validate synchronously');

    it('should validate asynchronously');

    it('should fail');
  });
});
