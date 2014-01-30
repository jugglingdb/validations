
var decimal = require('../../lib/validators/decimal');

describe('Test `decimal` validator', function() {
  var model = {
    positive: 123,
    negative: -123,
    zero: 0,
    floatPositive: 123.456,
    floatNegative: -123.456,
    floatZero: '0.0',
    foo: "bar"
  };
  var customMessage = "Testing decimal successful!";

  it('should validate', function() {
    [true, undefined, {}].forEach(function(options) {
      decimal(model, 'floatPositive', options).should.be.true;
      decimal(model, 'floatNegative', options).should.be.true;
      decimal(model, 'floatZero', options).should.be.true;
      decimal(model, 'zero', options).should.be.true;
    });

    decimal(model, 'floatPositive').should.be.true;
    decimal(model, 'floatNegative').should.be.true;
    decimal(model, 'floatZero').should.be.true;
    decimal(model, 'zero').should.be.true;

    Object.keys(model).forEach(function(propertyName) {
      decimal(model, propertyName, false).should.be.true;
    });
  });

  it('should validate only positive', function() {
    var positiveOptions = {
      positive: true,
      negative: false,
      zero: false
    };

    decimal(model, 'floatPositive', positiveOptions).should.be.true;
    decimal(model, 'floatNegative', positiveOptions).should.not.be.true;
    decimal(model, 'floatZero', positiveOptions).should.not.be.true;
    decimal(model, 'zero', positiveOptions).should.not.be.true;
  });

  it('should validate only negative', function() {
    var negativeOptions = {
      positive: false,
      negative: true,
      zero: false
    };

    decimal(model, 'floatPositive', negativeOptions).should.not.be.true;
    decimal(model, 'floatNegative', negativeOptions).should.be.true;
    decimal(model, 'floatZero', negativeOptions).should.not.be.true;
    decimal(model, 'zero', negativeOptions).should.not.be.true;
  });

  it('should validate only zero', function() {
    var zeroOptions = {
      positive: false,
      negative: false,
      zero: true
    };

    decimal(model, 'floatPositive', zeroOptions).should.not.be.true;
    decimal(model, 'floatNegative', zeroOptions).should.not.be.true;
    decimal(model, 'floatZero', zeroOptions).should.be.true;
    decimal(model, 'zero', zeroOptions).should.be.true;
  });

  it('should validate "not a number"', function() {
    decimal(model, 'foo', false).should.be.true;
    decimal(model, 'foo', { positive: false, negative: false, zero: false }).should.be.true;

    decimal(model, 'foo').should.not.be.true;
  });

  it('should not validate', function() {
    decimal(model, 'foo').should.not.be.true;
    decimal(model, 'foo').should.be.a('string');
    decimal(model, 'foo', true).should.not.be.true;
    decimal(model, 'foo', true).should.be.a('string');
  });

  it('should not validate when an integer is provided', function() {
    ['positive', 'negative'].forEach(function(property) {
      decimal(model, property, true).should.not.be.true;
      decimal(model, property, true).should.be.a('string');
    });
  });

  it('should allow changing the error message', function() {
    decimal(model, 'foo', { message: customMessage }).should.equal(customMessage);
  });

});
