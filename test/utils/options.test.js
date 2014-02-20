
var optUtils = require('../../lib/utils/options');
var assert = require("assert");

describe('Test options utilities', function() {
  describe('where getArray', function() {
    it('should return `options` if an array', function() {
      optUtils.getArray([]).should.be.instanceof(Array);
      optUtils.getArray([], 'foo').should.be.instanceof(Array);
      optUtils.getArray([], 'foo', false).should.be.instanceof(Array);
    });

    it('should return the options\' key value if an array', function() {
      optUtils.getArray({ foo: [] }, 'foo').should.be.instanceof(Array);
      optUtils.getArray({ foo: [] }, 'foo', false).should.be.instanceof(Array);
    });

    it('should return the default value if not a valid `options`', function() {
      [
        -1, "", "a", {}, true, false, null, undefined
      ].forEach(function(options) {
        assert.strictEqual( optUtils.getArray(options), undefined );
        optUtils.getArray(options, undefined, false).should.be.false;
      });
      assert.strictEqual( optUtils.getArray(), undefined );
    });

    it('should return the default value if the options\' key is not an array', function() {
      [
        undefined, null, true, false, {}, 0, 1, "", "bar"
      ].forEach(function(val) {
        optUtils.getArray({ foo: val }, 'foo', false).should.be.false;
        optUtils.getArray({ foo: val }, 'bar', false).should.be.false;
      });
      optUtils.getArray({}, 'foo', false).should.be.false;
    });
  });

  describe('where getBoolean', function() {
    it('should return `options` if a boolean', function() {
      optUtils.getBoolean(true).should.be.true;
      optUtils.getBoolean(true, 'foo').should.be.true;
      optUtils.getBoolean(true, 'foo', null).should.be.true;

      optUtils.getBoolean(false).should.be.false;
      optUtils.getBoolean(false, 'foo').should.be.false;
      optUtils.getBoolean(false, 'foo', null).should.be.false;
    });

    it('should return the options\' key value if a boolean', function() {
      optUtils.getBoolean({ foo: true }, 'foo').should.be.true;
      optUtils.getBoolean({ foo: true }, 'foo', null).should.be.true;
    });

    it('should return the default value if not a valid `options`', function() {
      [
        -1, "", "a", {}, [], null, undefined
      ].forEach(function(options) {
        assert.strictEqual( optUtils.getBoolean(options), undefined );
        assert.strictEqual( optUtils.getBoolean(options, undefined, null), null );
      });
      assert.strictEqual( optUtils.getBoolean(), undefined );
    });

    it('should return the default value if the options\' key is not boolean', function() {
      [
        undefined, null, [], {}, 0, 1, "", "bar"
      ].forEach(function(val) {
        assert.strictEqual( optUtils.getBoolean({ foo: val }, 'bar', null), null );
        optUtils.getBoolean({ foo: val }, 'bar', false).should.be.false;
      });
      assert.strictEqual( optUtils.getBoolean({}, 'foo', null), null );
    });
  });

  describe('where getFunction', function() {
    var fn = function() { };

    it('should return `options` if a function', function() {
      optUtils.getFunction(fn).should.be.instanceof(Function);
      optUtils.getFunction(fn, 'foo').should.be.instanceof(Function);
      optUtils.getFunction(fn, 'foo', false).should.be.instanceof(Function);
    });

    it('should return the options\' key value if a function', function() {
      optUtils.getFunction({ foo: fn }, 'foo').should.be.instanceof(Function);
      optUtils.getFunction({ foo: fn }, 'foo', false).should.be.instanceof(Function);
    });

    it('should return the default value if not a valid `options`', function() {
      [
        -1, "", "a", [], {}, true, false, null, undefined
      ].forEach(function(options) {
        assert.strictEqual( optUtils.getFunction(options), undefined );
        optUtils.getFunction(options, undefined, false).should.be.false;
      });
      assert.strictEqual( optUtils.getFunction(), undefined );
    });

    it('should return the default value if the options\' key is not a function', function() {
      [
        undefined, null, true, false, [], {}, 0, 1, "", "bar"
      ].forEach(function(val) {
        optUtils.getFunction({ foo: val }, 'foo', false).should.be.false;
        optUtils.getFunction({ foo: val }, 'bar', false).should.be.false;
      });
      optUtils.getFunction({}, 'foo', false).should.be.false;
    });
  });

  describe('where getNumber', function() {
    it('should return `options` if a number', function() {
      [
        -1.234, -1, 0, 1, 1.234
      ].forEach(function(val) {
        optUtils.getNumber(val).should.be.a('number');
        optUtils.getNumber(val, 'foo').should.be.a('number');
        optUtils.getNumber(val, 'foo', false).should.be.a('number');

        // valid for numbers as a string, too!
        optUtils.getNumber(String(val)).should.be.a('number');
        optUtils.getNumber(String(val), 'foo').should.be.a('number');
        optUtils.getNumber(String(val), 'foo', false).should.be.a('number');
      });
    });

    it('should return the options\' key if a number', function() {
      [
        -1.234, -1, 0, 1, 1.234
      ].forEach(function(val) {
        optUtils.getNumber({ foo: val }, 'foo').should.be.a('number');
        optUtils.getNumber({ foo: val }, 'foo', false).should.be.a('number');

        // valid for numbers as a string, too!
        optUtils.getNumber({ foo: String(val) }, 'foo').should.be.a('number');
        optUtils.getNumber({ foo: String(val) }, 'foo', false).should.be.a('number');
      });
    });

    it('should return the default value if not a valid `options`', function() {
      [
        undefined, null, false, true, [], {}, "", "a"
      ].forEach(function(options) {
        assert.strictEqual( optUtils.getNumber(options, 'foo'), undefined );
        optUtils.getNumber(options, 'foo', false).should.be.false;
      });
      assert.strictEqual( optUtils.getNumber(), undefined );
    });

    it('should return the default value if the options\' key is not a number', function() {
      [
        undefined, null, false, true, [], {}, "", "a"
      ].forEach(function(val) {
        assert.strictEqual( optUtils.getNumber({ foo: val }, 'foo'), undefined );
        optUtils.getNumber({ foo: val }, 'foo', false).should.be.false;
      });
    });
  });

  describe('where getInteger', function() {
    it('should return `options` if an integer', function() {
      [
        -1, 0, 1  // note : floats will be converted to ints
      ].forEach(function(val) {
        optUtils.getInteger(val).should.be.a('number');
        optUtils.getInteger(val, 'foo').should.be.a('number');
        optUtils.getInteger(val, 'foo', false).should.be.a('number');

        // valid for numbers as a string, too!
        optUtils.getInteger(String(val)).should.be.a('number');
        optUtils.getInteger(String(val), 'foo').should.be.a('number');
        optUtils.getInteger(String(val), 'foo', false).should.be.a('number');
      });
    });

    it('should return the options\' key if an integer', function() {
      [
        -1, 0, 1
      ].forEach(function(val) {
        optUtils.getInteger({ foo: val }, 'foo').should.be.a('number');
        optUtils.getInteger({ foo: val }, 'foo', false).should.be.a('number');

        // valid for numbers as a string, too!
        optUtils.getInteger({ foo: String(val) }, 'foo').should.be.a('number');
        optUtils.getInteger({ foo: String(val) }, 'foo', false).should.be.a('number');
      });
    });

    it('should return the default value if not a valid `options`', function() {
      [
        -1.234, 1.234, undefined, null, false, true, [], {}, "", "a"
      ].forEach(function(val) {
        assert.strictEqual( optUtils.getInteger({ foo: val }, 'foo'), undefined );
        optUtils.getInteger({ foo: val }, 'foo', false).should.be.false;
      });
      assert.strictEqual( optUtils.getInteger(), undefined );
    });

    it('should return the default value if the options\' key is not an integer', function() {
      [
        -1.234, 1.234, undefined, null, false, true, [], {}, "", "a"
      ].forEach(function(val) {
        assert.strictEqual( optUtils.getInteger({ foo: val }, 'foo'), undefined );
        optUtils.getInteger({ foo: val }, 'foo', false).should.be.false;
      });
    });
  });

  describe('where getString', function() {
    it('should return `options` if a string', function() {
      [
        "", "bar"
      ].forEach(function(val) {
        optUtils.getString(val).should.be.a('string');
        optUtils.getString(val, 'foo').should.be.a('string');
        optUtils.getString(val, 'foo', false).should.be.a('string');

        // test for explicit String instances, too!
        optUtils.getString(String(val)).should.be.a('string');
        optUtils.getString(String(val), 'foo').should.be.a('string');
        optUtils.getString(String(val), 'foo', false).should.be.a('string');
      });
    });

    it('should return the options\' key if a string', function() {
      [
        "", "bar"
      ].forEach(function(val) {
        optUtils.getString({ foo: val }, 'foo').should.be.a('string');
        optUtils.getString({ foo: val }, 'foo', false).should.be.a('string');

        // test for explicit String instances, too!
        optUtils.getString({ foo: String(val) }, 'foo').should.be.a('string');
        optUtils.getString({ foo: String(val) }, 'foo', false).should.be.a('string');
      });
    });

    it('should return the default value if not a valid `options`', function() {
      [
        -1, 0, 1, -1.234, 1.234, undefined, null, false, true, [], {}
      ].forEach(function(val) {
        assert.strictEqual( optUtils.getString({ foo: val }, 'foo'), undefined );
        optUtils.getString({ foo: val }, 'foo', false).should.be.false;
      });
      assert.strictEqual( optUtils.getString(), undefined );
    });

    it('should return the default value if the options\' key is not a string', function() {
      [
        -1, 0, 1, -1.234, 1.234, undefined, null, false, true, [], {}
      ].forEach(function(val) {
        assert.strictEqual( optUtils.getString({ foo: val }, 'foo'), undefined );
        optUtils.getString({ foo: val }, 'foo', false).should.be.false;
      });
    });
  });
});
