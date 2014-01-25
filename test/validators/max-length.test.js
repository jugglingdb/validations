
var maxLength = require('../../lib/validators/max-length');

describe('Test `max-length` validator', function() {
  var model = {
    login: "john.smith@domain.com",
    password: ""
  };
  for (var i=0; i<800; i++) {  // default 255
    model.password += String.fromCharCode(97 + (i%26));
  }
  var customMessage = "Testing max-length successful!";

  it('should validate', function() {
    maxLength(model, 'login').should.be.true;
  });

  it('should not validate', function() {
    maxLength(model, 'password').should.not.be.true;
    maxLength(model, 'password').should.not.a.String;
  });

  it('should allow changing the error message', function() {
    maxLength(model, 'password', { message: customMessage }).should.equal(customMessage);
  });

  it('should allow setting adjusting new max', function() {
    maxLength(model, 'login', { max: 2 }).should.not.be.true;
    maxLength(model, 'password', { max: 4000 }).should.be.true;
  });

});
