
var blacklist = require('../../lib/validators/blacklist');

describe('Test `blacklist` validator', function() {
  var model = {
    __data: {
      prop: "a",
      propUpper: "A",
      propInvalid: 1
    }
  };
  var customMessage = "Testing blacklist successful!";
  var options;

  beforeEach(function() {
    options = {
       values: ["a", true, null]
    };
  });

  it('should ignore if no values defined', function() {
    blacklist(model, 'prop').should.be.true;
    blacklist(model, 'prop', null).should.be.true;
    blacklist(model, 'prop', {}).should.be.true;
    blacklist(model, 'prop', []).should.be.true;

    options.values = [];
    blacklist(model, 'prop', options).should.be.true;

    delete options.values;
    blacklist(model, 'prop', options).should.be.true;
  });

  it('should validate', function() {
    blacklist(model, 'propUpper', options).should.be.true;
    blacklist(model, 'propInvalid', options).should.be.true;
  });

  it('should not validate', function() {
    blacklist(model, 'prop', options).should.be.a('string');
    blacklist(model, 'prop', options.values).should.a('string');

    options.ignoreCase = true;
    blacklist(model, 'propUpper', options).should.a('string');

    options.strictCompare = false;
    blacklist(model, 'propInvalid', options).should.a('string');
  });

  it('should allow changing the error message', function() {
    options.message = customMessage;

    blacklist(model, 'prop', options).should.equal(customMessage);
  });

});
