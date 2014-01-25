
var minLength = require('../../lib/validators/min-length');

describe('Test `min-length` validator', function() {
  var model = {
    firstName: "Jo",
    lastName: "Johnson"
  };
  var customMessage = "Testing min-length successful!";

  it('should validate', function() {
    minLength(model, 'lastName').should.be.true;
  });

  it('should not validate', function() {
    minLength(model, 'firstName').should.not.be.true;
    minLength(model, 'firstName').should.not.a.String;
  });

  it('should allow changing the error message', function() {
    minLength(model, 'firstName', { message: customMessage }).should.equal(customMessage);
  });

  it('should allow setting adjusting new min', function() {
    minLength(model, 'firstName', { min: 2 }).should.be.true;
    minLength(model, 'lastName', { min: 8 }).should.not.be.true;
  });

});
