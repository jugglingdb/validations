
var required = require('../../lib/validators/required');

describe('Test `required` validator', function() {
  var model = {
    id: 1,
    foo: "bar"
  };
  var customMessage = "Testing required successful!";

  it('should validate', function() {
    required(model, 'id').should.be.true;
  });

  it('should not validate', function() {
    required(model, 'bar').should.not.be.true;
    required(model, 'bar').should.not.a.String;
  });

  it('should allow changing the error message', function() {
    required(model, 'bar', { message: customMessage }).should.equal(customMessage);
  });

});
