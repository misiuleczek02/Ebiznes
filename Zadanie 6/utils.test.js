const { expect } = require('chai');
const {
  add,
  multiply,
  divide,
  isEven,
  factorial,
  reverseString,
  isPalindrome,
  fibonacci,
  sumArray,
  findMax
} = require('./utils');

describe('Utility functions', () => {
  describe('add()', () => {
    it('should return the sum of two numbers', () => {
      expect(add(1, 2)).to.equal(3);
      expect(add(-3, 2)).to.equal(-1);
      expect(add(0, 0)).to.equal(0);
    });

    it('should throw if arguments are not numbers', () => {
      expect(() => add('1', 2)).to.throw('Both arguments must be numbers');
      expect(() => add(1, null)).to.throw('Both arguments must be numbers');
    });
  });

  describe('multiply()', () => {
    it('should return the product of two numbers', () => {
      expect(multiply(3, 5)).to.equal(15);
      expect(multiply(-2, 4)).to.equal(-8);
      expect(multiply(0, 5)).to.equal(0);
    });

    it('should throw if arguments are not numbers', () => {
      expect(() => multiply('3', 5)).to.throw('Both arguments must be numbers');
      expect(() => multiply(3, undefined)).to.throw('Both arguments must be numbers');
    });
  });

  describe('divide()', () => {
    it('should divide numbers correctly', () => {
      expect(divide(10, 2)).to.equal(5);
      expect(divide(-9, 3)).to.equal(-3);
      expect(divide(5, 2)).to.equal(2.5);
    });

    it('should throw when dividing by zero', () => {
      expect(() => divide(5, 0)).to.throw('Cannot divide by zero');
    });

    it('should throw if arguments are not numbers', () => {
      expect(() => divide('10', 2)).to.throw('Both arguments must be numbers');
      expect(() => divide(10, '2')).to.throw('Both arguments must be numbers');
    });
  });

  describe('isEven()', () => {
    it('should return true for even numbers', () => {
      expect(isEven(2)).to.be.true;
      expect(isEven(0)).to.be.true;
      expect(isEven(-4)).to.be.true;
    });

    it('should return false for odd numbers', () => {
      expect(isEven(1)).to.be.false;
      expect(isEven(-3)).to.be.false;
    });

    it('should throw if argument is not a number', () => {
      expect(() => isEven('2')).to.throw('Argument must be a number');
    });
  });

  describe('factorial()', () => {
    it('should compute factorial for valid integers', () => {
      expect(factorial(0)).to.equal(1);
      expect(factorial(1)).to.equal(1);
      expect(factorial(5)).to.equal(120);
    });

    it('should throw for negative or non-integer values', () => {
      expect(() => factorial(-1)).to.throw('Argument must be a non-negative integer');
      expect(() => factorial(1.5)).to.throw('Argument must be a non-negative integer');
      expect(() => factorial('5')).to.throw('Argument must be a non-negative integer');
    });
  });

  describe('reverseString()', () => {
    it('should reverse text correctly', () => {
      expect(reverseString('abc')).to.equal('cba');
      expect(reverseString('A')).to.equal('A');
      expect(reverseString('racecar')).to.equal('racecar');
    });

    it('should throw if argument is not a string', () => {
      expect(() => reverseString(123)).to.throw('Argument must be a string');
    });
  });

  describe('isPalindrome()', () => {
    it('should identify simple palindromes', () => {
      expect(isPalindrome('racecar')).to.be.true;
      expect(isPalindrome('level')).to.be.true;
    });

    it('should ignore casing and non-alphanumeric characters', () => {
      expect(isPalindrome('A man, a plan, a canal: Panama')).to.be.true;
      expect(isPalindrome('No lemon, no melon')).to.be.true;
    });

    it('should return false for non-palindromes', () => {
      expect(isPalindrome('hello')).to.be.false;
      expect(isPalindrome('abc')).to.be.false;
    });

    it('should throw if argument is not a string', () => {
      expect(() => isPalindrome(12321)).to.throw('Argument must be a string');
    });
  });

  describe('fibonacci()', () => {
    it('should compute fibonacci numbers', () => {
      expect(fibonacci(0)).to.equal(0);
      expect(fibonacci(1)).to.equal(1);
      expect(fibonacci(6)).to.equal(8);
      expect(fibonacci(10)).to.equal(55);
    });

    it('should throw for invalid arguments', () => {
      expect(() => fibonacci(-1)).to.throw('Argument must be a non-negative integer');
      expect(() => fibonacci(2.5)).to.throw('Argument must be a non-negative integer');
      expect(() => fibonacci('10')).to.throw('Argument must be a non-negative integer');
    });
  });

  describe('sumArray()', () => {
    it('should add all numbers in an array', () => {
      expect(sumArray([1, 2, 3])).to.equal(6);
      expect(sumArray([-1, 1, 2])).to.equal(2);
      expect(sumArray([0, 0, 0])).to.equal(0);
    });

    it('should throw for invalid array input', () => {
      expect(() => sumArray('not-array')).to.throw('Argument must be an array');
      expect(() => sumArray([1, '2'])).to.throw('All array elements must be numbers');
    });
  });

  describe('findMax()', () => {
    it('should return the maximum element in an array', () => {
      expect(findMax([1, 2, 3])).to.equal(3);
      expect(findMax([-5, -1, -3])).to.equal(-1);
      expect(findMax([10])).to.equal(10);
    });

    it('should throw for invalid array input', () => {
      expect(() => findMax([])).to.throw('Argument must be a non-empty array');
      expect(() => findMax('not-array')).to.throw('Argument must be a non-empty array');
    });
  });
});
