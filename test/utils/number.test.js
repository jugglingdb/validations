
var number = require('../../lib/utils/number');

describe('Test number utilities', function() {
  describe('where getting a number', function() {
    it('should correctly return a number', function() {
      number.getNumber(0).should.equal(0);
      number.getNumber(0).should.not.equal('0');
      number.getNumber('0').should.equal(0);

      number.getNumber(123.456).should.equal(123.456);
      number.getNumber('123.456').should.equal(123.456);
      number.getNumber(1.2345e23).should.equal(1.2345e23);
      number.getNumber(1.2345e23).should.equal(1.2345e+23);
      number.getNumber(1.2345e+23).should.equal(1.2345e+23);
      number.getNumber(1.2345e-23).should.equal(1.2345e-23);
      number.getNumber('1.2345e23').should.equal(1.2345e23);
      number.getNumber('1.2345e+23').should.equal(1.2345e+23);
      number.getNumber('1.2345e-23').should.equal(1.2345e-23);
      number.getNumber('123e4').should.equal(1230000);
      number.getNumber('123e-4').should.equal(0.0123);

      number.getNumber(-123.456).should.equal(-123.456);
      number.getNumber('-123.456').should.equal(-123.456);
      number.getNumber(-1.2345e23).should.equal(-1.2345e23);
      number.getNumber(-1.2345e23).should.equal(-1.2345e+23);
      number.getNumber(-1.2345e+23).should.equal(-1.2345e+23);
      number.getNumber(-1.2345e-23).should.equal(-1.2345e-23);
      number.getNumber('-1.2345e23').should.equal(-1.2345e23);
      number.getNumber('-1.2345e+23').should.equal(-1.2345e+23);
      number.getNumber('-1.2345e-23').should.equal(-1.2345e-23);
      number.getNumber('-123e4').should.equal(-1230000);
      number.getNumber('-123e-4').should.equal(-0.0123);
    });

    it('should fail', function() {
      [
        "foo", true, false, [], {}, undefined, null,
        1/0, '1/0', 1/-0, '1/0', 1/+0, '1/+0', Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY,
        'a', '#fff', '123b2', '123f2'
      ].forEach(function(val) {
        number.getNumber(val).should.be.false;
      });
      number.getNumber().should.be.false;
    });
  });

  describe('where getting a decimal', function() {
    it('should correctly return a decimal', function() {
      [
        -123.456, -1.345, -0.123, 0.0, 0.123, 1.234, 123.456
      ].forEach(function(floatVal) {
        number.getDecimal(floatVal).should.be.a('number').and.be.equal(floatVal);
        number.getDecimal(String(floatVal)).should.be.a('number').and.be.equal(floatVal);
      });

      for (var i=123.01; i<124; i+=0.02) {
        number.getDecimal(i).should.not.be.false;
        number.getDecimal(String(i)).should.not.be.false;

        number.getDecimal(-i).should.not.be.false;
        number.getDecimal(String(-i)).should.not.be.false;
      }
    });
    it('should fail', function() {
      [
        "foo", true, false, [], {}, undefined, null,
        123, -123, '123', '-123',
        1/0, '1/0', 1/-0, '1/0', 1/+0, '1/+0', Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY,
        'a', '#fff', '123b2', '123f2'
      ].forEach(function(val) {
        number.getDecimal(val).should.be.false;
      });
      number.getDecimal().should.be.false;
    });
  });

  describe('where getting an integer', function() {
    it('should correctly return an integer', function() {
      [
        -123, -1, 0, 1, 123
      ].forEach(function(intVal) {
        number.getInteger(intVal).should.be.a('number').and.be.equal(intVal);
        number.getInteger(String(intVal)).should.be.a('number').and.be.equal(intVal);
      });
    });

    it('should fail', function() {
      [
        "foo", true, false, [], {}, undefined, null,
        123.456, -123.456, '123.456', '-123.456',
        1/0, '1/0', 1/-0, '1/0', 1/+0, '1/+0', Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY,
        'a', '#fff', '123b2', '123f2'
      ].forEach(function(val) {
        number.getInteger(val).should.be.false;
      });
      number.getInteger().should.be.false;

      for (var i=123.01; i<124; i+=0.02) {
        number.getInteger(i).should.be.false;
        number.getInteger(String(i)).should.be.false;

        number.getInteger(-i).should.be.false;
        number.getInteger(String(-i)).should.be.false;
      }
    });
  });

  describe('where ininity', function() {
    it('should be valid infinity', function() {
      [
        1/0, 1/+0, Number.POSITIVE_INFINITY,
        1/-0, Number.NEGATIVE_INFINITY
      ].forEach(function(val) {
        number.isInfinity(val).should.be.true;
      });
    });

    it('should pass positive', function() {
      [
        1/0, 1/+0, Number.POSITIVE_INFINITY
      ].forEach(function(val) {
        number.isPositiveInfinity(val).should.be.true;
      });
    });

    it('should pass negative', function() {
      [
        1/-0, Number.NEGATIVE_INFINITY
      ].forEach(function(val) {
        number.isNegativeInfinity(val).should.be.true;
      });
    });

    it('should fail', function() {
      [
        -1.234, -1, 0, 1, 1.234,
        'Infinity', 'infinity',
        null, false, null, undefined,
        [], {}
      ].forEach(function(val) {
        number.isPositiveInfinity(val).should.not.be.true;
        number.isNegativeInfinity(val).should.not.be.true;
      });
      number.isPositiveInfinity().should.not.be.true;
      number.isNegativeInfinity().should.not.be.true;
    });
  });

  describe('where signed value', function() {
    it('should pass positive', function() {
      [
        123.456, 1.2345e23, 1.2345e+23, 1.2345e-23, 123e4, 123e-4
      ].forEach(function(val) {
        number.isPositive(val).should.be.true;
        number.isPositive(String(val)).should.be.true;
      });
    });

    it('should pass negative', function() {
      [
        -123.456, -1.2345e23, -1.2345e+23, -1.2345e-23, -123e4, -123e-4
      ].forEach(function(val) {
        number.isNegative(val).should.be.true;
        number.isNegative(String(val)).should.be.true;
      });
    });

    it('should pass zero', function() {
      [0, 0.0, -0, -0.0, +0.0].forEach(function(zero) {
        number.isZero(zero).should.be.true;
        number.isZero(String(zero)).should.be.true;
      });
    });

    it('should fail', function() {
      [0, -1, null, undefined, false, "", "a", {}, []].forEach(function(val) {
        number.isPositive(val).should.not.be.true;
      });

      [0, 1, null, undefined, false, "", "a", {}, []].forEach(function(val) {
        number.isNegative(val).should.not.be.true;
      });

      [-1, 1, null, undefined, false, "", "a", {}, []].forEach(function(val) {
        number.isZero(val).should.not.be.true;
      });
    });
  });
});
