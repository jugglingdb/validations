
var number = require('../../lib/utils/number');

describe('Testing number utilities', function() {
  describe('Testing getting a number', function() {
    it('should correctly return a number', function() {
      number.getNumber(0).should.equal(0);
      number.getNumber(0).should.not.equal('0');
      number.getNumber('0').should.equal(0);

      number.getNumber(123.456).should.equal(123.456);
      number.getNumber('123.456').should.equal(123.456);

      number.getNumber(-123.456).should.equal(-123.456);
      number.getNumber('-123.456').should.equal(-123.456);

      number.getNumber(1.2345e23).should.equal(1.2345e23);
      number.getNumber(1.2345e23).should.equal(1.2345e+23);
      number.getNumber(1.2345e+23).should.equal(1.2345e+23);
      number.getNumber(1.2345e-23).should.equal(1.2345e-23);
      number.getNumber('1.2345e23').should.equal(1.2345e23);
      number.getNumber('1.2345e+23').should.equal(1.2345e+23);
      number.getNumber('1.2345e-23').should.equal(1.2345e-23);

      number.getNumber(-1.2345e23).should.equal(-1.2345e23);
      number.getNumber(-1.2345e23).should.equal(-1.2345e+23);
      number.getNumber(-1.2345e+23).should.equal(-1.2345e+23);
      number.getNumber(-1.2345e-23).should.equal(-1.2345e-23);
      number.getNumber('-1.2345e23').should.equal(-1.2345e23);
      number.getNumber('-1.2345e+23').should.equal(-1.2345e+23);
      number.getNumber('-1.2345e-23').should.equal(-1.2345e-23);

      number.getNumber('123e4').should.equal(1230000);
      number.getNumber('123e-4').should.equal(0.0123);
    });

    it('should return false', function() {
      number.getNumber("foo").should.be.false;
      number.getNumber(true).should.be.false;
      number.getNumber(false).should.be.false;
      number.getNumber([]).should.be.false;
      number.getNumber({}).should.be.false;
      number.getNumber(undefined).should.be.false;
      number.getNumber(null).should.be.false;

      number.getNumber(1/0).should.be.false;
      number.getNumber(1/-0).should.be.false;
      number.getNumber(Number.NEGATIVE_INFINITY).should.be.false;
      number.getNumber(1/+0).should.be.false;
      number.getNumber(Number.POSITIVE_INFINITY).should.be.false;

      number.getNumber('a').should.be.false;
      number.getNumber('#fff').should.be.false;
      number.getNumber('123b2').should.be.false
      number.getNumber('123f2').should.be.false
    });
  });


});
