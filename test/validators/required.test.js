
var required = require('../../lib/validators/required');

describe('Test `required` validator', function() {
  var model = {
    id: 1,
    foo: "bar"
  };
  var customMessage = "Testing required successful!";

  it('should validate', function() {
    required(model, 'id', true).should.be.true;
    required(model, 'id', {}).should.be.true;
    required(model, 'id').should.be.true;  // nothing specified, defaults to true

    required(model, 'bar', false).should.be.true;  // not required
  });

  it('should ignore "optional" requirements', function() {
    required(model, 'id', false).should.be.true;
    required(model, 'id', undefined).should.be.true;
    required(model, 'id', null).should.be.true;
  });

  it('should not validate', function() {
    required(model, 'bar', true).should.not.be.true;
    required(model, 'bar', true).should.be.a('string');

    required(model, 'bar', {}).should.not.be.true;
    required(model, 'bar', undefined).should.not.be.true;
    required(model, 'bar', null).should.not.be.true;
  });

  it('should allow changing the error message', function() {
    required(model, 'bar', { message: customMessage }).should.equal(customMessage);
  });

});
