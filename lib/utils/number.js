
/*
Determine if something is a non-infinite javascript number and return it.
@param  {Number}    n A (potential) number to see if it is a number
@return {Number}    the Number value of n, or false if n is not a valid number
*/
var getNumber = module.exports.getNumber = function getNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n) && Number(n);
};

/*
Return the integer part of the given non infinite number.
@param  {Number}    n A (potential) number to return it's integer part
@return {Number}    the integer part of n, or false if n is not a valid number
*/
module.exports.getInteger = function getInteger(n, radix) {
  return ((n = getNumber(n)) !== false) && parseInt(n, radix || 10);
};

/*
Check that a number is infinity (positive or negative).
@param  {Number}    n A (potential) number to check
@return {Boolean}   true if n is an infinite number, false otherwise
*/
module.exports.isInfinity = function isInfinity(n) {
  return isPositiveInfinity(n) || isNegativeInfinity(n);
};

/*
Check that a number is positive infinity
@param  {Number}    n A (potential) number to check
@return {Boolean}   true if n is positive infinity, false otherwise
*/
var isPositiveInfinity = module.exports.isPositiveInfinity = function isPositiveInfinity(n) {
  return !isNaN(parseFloat(n)) && !isFinite(n) && (n === Number.POSITIVE_INFINITY);
};

/*
Check that a number is negative infinity
@param  {Number}    n A (potential) number to check
@return {Boolean}   true if n is negative infinity, false otherwise
*/
var isNegativeInfinity = module.exports.isNegativeInfinity = function isNegativeInfinity(n) {
  return !isNaN(parseFloat(n)) && !isFinite(n) && (n === Number.NEGATIVE_INFINITY);
};

/*
Check that a non infinite number is positive.
@param  {Number}    n A (potential) number to check
@return {Boolean}   true if n is a positive number, false otherwise
*/
module.exports.isPositive = function isPositive(n) {
  return ((n = getNumber(n)) !== false) && (n > 0);
};

/*
Check that a non infinite number is negative.
@param  {Number}    n A (potential) number to check
@return {Boolean}   true if n is a negative number, false otherwise
*/
module.exports.isNegative = function isNegative(n) {
  return ((n = getNumber(n)) !== false) && (n < 0);
};

/*
Check that a non infinite number is zero (note : 0 === -0 === +0).
@param  {Number}    n A (potential) number to check
@return {Boolean}   true if n is zero, false otherwise
*/
module.exports.isZero = function isZero(n) {
  return ((n = getNumber(n)) !== false) && (n === 0);
};
