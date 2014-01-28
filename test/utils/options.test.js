
var optUtils = require('../../lib/utils/options');

describe('Test options utilities', function() {
  describe('Test getArray', function() {
    it('should return `options` if an array');
    it('should return the options\' key if an array');
    it('should return the default value if not a valid `options`');
    it('should return the default value if the options\' key is not an array');
  });

  describe('Test getBoolean', function() {
    it('should return `options` if a boolean');
    it('should return the options\' key if a boolean');
    it('should return the boolean value for options\' key');
    it('should return the default value if not a valid `options`');
    it('should return the default value if the options\' key is not boolean');
  });

  describe('Test getNumber', function() {
    it('should return `options` if a number');
    it('should return the options\' key if a number');
    it('should return the default value if not a valid `options`');
    it('should return the default value if the options\' key is not a number');
  });

  describe('Test getInteger', function() {
    it('should return `options` if an integer');
    it('should return the options\' key if an integer');
    it('should return the default value if not a valid `options`');
    it('should return the default value if the options\' key is not an integer');
  });
});
