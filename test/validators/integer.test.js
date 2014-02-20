
var integer = require('../../lib/validators/integer');

describe('Test `integer` validator', function() {
  var model = {
    __data: {
      positive: 123,
      negative: -123,
      zero: 0,
      floatPositive: 123.456,
      floatNegative: -123.456,
      floatZero: '0.0',
      foo: "bar"
    }
  };
  var customMessage = "Testing integer successful!";

  it('should validate', function() {
    [true, undefined, {}].forEach(function(options) {
      integer(model, 'positive', options).should.be.true;
      integer(model, 'negative', options).should.be.true;
      integer(model, 'zero', options).should.be.true;
    });

    integer(model, 'positive').should.be.true;
    integer(model, 'negative').should.be.true;
    integer(model, 'zero').should.be.true;

    Object.keys(model.__data).forEach(function(propertyName) {
      integer(model, propertyName, false).should.be.true;
    });
  });

  it('should validate only positive', function() {
    var positiveOptions = {
      positive: true,
      negative: false,
      zero: false
    };

    integer(model, 'positive', positiveOptions).should.be.true;
    integer(model, 'negative', positiveOptions).should.not.be.true;
    integer(model, 'zero', positiveOptions).should.not.be.true;
  });

  it('should validate only negative', function() {
    var negativeOptions = {
      positive: false,
      negative: true,
      zero: false
    };

    integer(model, 'positive', negativeOptions).should.not.be.true;
    integer(model, 'negative', negativeOptions).should.be.true;
    integer(model, 'zero', negativeOptions).should.not.be.true;
  });

  it('should validate only zero', function() {
    var zeroOptions = {
      positive: false,
      negative: false,
      zero: true
    };

    integer(model, 'positive', zeroOptions).should.not.be.true;
    integer(model, 'negative', zeroOptions).should.not.be.true;
    integer(model, 'zero', zeroOptions).should.be.true;
  });

  it('should validate "not a number"', function() {
    integer(model, 'foo', false).should.be.true;
    integer(model, 'foo', { positive: false, negative: false, zero: false }).should.be.true;

    integer(model, 'foo').should.not.be.true;
  });

  it('should not validate', function() {
    integer(model, 'foo').should.not.be.true;
    integer(model, 'foo').should.be.a('string');
    integer(model, 'foo', true).should.not.be.true;
    integer(model, 'foo', true).should.be.a('string');
  });

  it('should not validate when a float is provided', function() {
    ['floatPositive', 'floatNegative', 'floatZero'].forEach(function(property) {
      integer(model, property, true).should.not.be.true;
      integer(model, property, true).should.be.a('string');
    });
  });

  it('should allow changing the error message', function() {
    integer(model, 'foo', { message: customMessage }).should.equal(customMessage);
  });

});
