
var minLength = require('../../lib/validators/min-length');

describe('Test `min-length` validator', function() {
  var model = {
    __data: {
      firstName: "Jo",
      lastName: "Johnson"
    }
  };
  var customMessage = "Testing min-length successful!";

  it('should validate', function() {
    minLength(model, 'lastName').should.be.true;
  });

  it('should not validate', function() {
    minLength(model, 'firstName').should.not.be.true;
    minLength(model, 'firstName').should.be.a('string');
  });

  it('should allow changing the error message', function() {
    minLength(model, 'firstName', { message: customMessage }).should.equal(customMessage);
  });

  it('should allow setting adjusting new min', function() {
    minLength(model, 'firstName', { min: 2 }).should.be.true;
    minLength(model, 'lastName', { min: 8 }).should.not.be.true;
  });

  it('should accept options to be the min length value', function() {
    minLength(model, 'firstName', 2).should.be.true;
    minLength(model, 'lastName', 8).should.not.be.true;
  });

});
