
var blacklist = require('../../lib/validators/blacklist');

describe('Test `blacklist` validator', function() {
  var model = {
    prop: "a",
    propUpper: "A",
    propInvalid: 1
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

  it('should validate');

  it('should not validate');

  it('should allow changing the error message');

});
