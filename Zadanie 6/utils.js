function add(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }
  return a + b;
}

function multiply(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }
  return a * b;
}

function divide(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

function isEven(num) {
  if (typeof num !== 'number') {
    throw new Error('Argument must be a number');
  }
  return num % 2 === 0;
}

function factorial(n) {
  if (typeof n !== 'number' || n < 0 || !Number.isInteger(n)) {
    throw new Error('Argument must be a non-negative integer');
  }
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

function reverseString(str) {
  if (typeof str !== 'string') {
    throw new Error('Argument must be a string');
  }
  return str.split('').reverse().join('');
}

function isPalindrome(str) {
  if (typeof str !== 'string') {
    throw new Error('Argument must be a string');
  }
  const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleanStr === cleanStr.split('').reverse().join('');
}

function fibonacci(n) {
  if (typeof n !== 'number' || n < 0 || !Number.isInteger(n)) {
    throw new Error('Argument must be a non-negative integer');
  }
  if (n === 0) return 0;
  if (n === 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function sumArray(arr) {
  if (!Array.isArray(arr)) {
    throw new Error('Argument must be an array');
  }
  return arr.reduce((sum, num) => {
    if (typeof num !== 'number') {
      throw new Error('All array elements must be numbers');
    }
    return sum + num;
  }, 0);
}

function findMax(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error('Argument must be a non-empty array');
  }
  return Math.max(...arr);
}

module.exports = {
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
};
