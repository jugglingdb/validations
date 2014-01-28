
var number = require('../../lib/utils/number');

describe('Test number utilities', function() {
  describe('Test getting a number', function() {
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

    it('should fail', function() {
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

  describe('Test getting an integer', function() {
    it('should correctly return an integer');
    it('should fail');
  });

  describe('Test ininity', function() {
    it('should pass positive');
    it('should pass negative');
    it('should fail');
  });

  describe('Test signed value', function() {
    it('should pass positive');
    it('should pass negative');
    it('should pass zero');
    it('should fail');
  });
});
