
var maxLength = require('../../lib/validators/max-length');

describe('Test `max-length` validator', function() {
  var model = {
    __data: {
      login: "john.smith@domain.com",
      password: ""
    }
  };
  for (var i=0; i<800; i++) {  // default 255
    model.__data.password += String.fromCharCode(97 + (i%26));
  }
  var customMessage = "Testing max-length successful!";

  it('should validate', function() {
    maxLength(model, 'login').should.be.true;
  });

  it('should not validate', function() {
    maxLength(model, 'password').should.not.be.true;
    maxLength(model, 'password').should.be.a('string');
  });

  it('should allow changing the error message', function() {
    maxLength(model, 'password', { message: customMessage }).should.equal(customMessage);
  });

  it('should allow setting adjusting new max', function() {
    maxLength(model, 'login', { max: 2 }).should.not.be.true;
    maxLength(model, 'password', { max: 4000 }).should.be.true;
  });

  it('should accept options to be the max length value', function() {
    maxLength(model, 'login', 2).should.not.be.true;
    maxLength(model, 'password', 4000).should.be.true;
  });

});
