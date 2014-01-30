
var number = require('../../lib/validators/number');

describe('Test `number` validator', function() {
  var model = {
    positive: 123.456,
    negative: -123.456,
    zero: 0,
    foo: "bar"
  };
  var customMessage = "Testing number successful!";

  it('should validate', function() {
    [true, undefined, {}].forEach(function(options) {
      number(model, 'positive', options).should.be.true;
      number(model, 'negative', options).should.be.true;
      number(model, 'zero', options).should.be.true;
    });

    number(model, 'positive').should.be.true;
    number(model, 'negative').should.be.true;
    number(model, 'zero').should.be.true;
  });

  it('should validate only positive', function() {
    var positiveOptions = {
      positive: true,
      negative: false,
      zero: false
    };

    number(model, 'positive', positiveOptions).should.be.true;
    number(model, 'negative', positiveOptions).should.not.be.true;
    number(model, 'zero', positiveOptions).should.not.be.true;
  });

  it('should validate only negative', function() {
    var negativeOptions = {
      positive: false,
      negative: true,
      zero: false
    };

    number(model, 'positive', negativeOptions).should.not.be.true;
    number(model, 'negative', negativeOptions).should.be.true;
    number(model, 'zero', negativeOptions).should.not.be.true;
  });

  it('should validate only zero', function() {
    var zeroOptions = {
      positive: false,
      negative: false,
      zero: true
    };

    number(model, 'positive', zeroOptions).should.not.be.true;
    number(model, 'negative', zeroOptions).should.not.be.true;
    number(model, 'zero', zeroOptions).should.be.true;
  });

  it('should validate "not a number"', function() {
    number(model, 'foo', false).should.be.true;
    number(model, 'foo', { positive: false, negative: false, zero: false }).should.be.true;
  });

  it('should not validate', function() {
    ['positive', 'negative', 'zero'].forEach(function(property) {
      number(model, property, false).should.not.be.true;
      number(model, property, false).should.be.a('string');
    });

    number(model, 'foo').should.not.be.true;
    number(model, 'foo').should.be.a('string');
    number(model, 'foo', true).should.not.be.true;
    number(model, 'foo', true).should.be.a('string');
  });

  it('should allow changing the error message', function() {
    number(model, 'foo', { message: customMessage }).should.equal(customMessage);
  });

});
