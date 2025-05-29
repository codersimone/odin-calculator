let firstNum = '';
let secondNum = '';
let operator = '';

const operations = {
    '+': add,
    '-': subtract,
    '*': multiply,
    '/': divide,
};

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return `Error: can't divide by 0!`;
    }
    return a / b;
}

function toNumType(value) {
    return Number(value);
}

function operate(operator, a, b) {
    let numOne = toNumType(a);
    let numTwo = toNumType(b);

    if (operator in operations) {
        return operations[operator](numOne, numTwo);
    } else {
        return `Error: unknown operator!`;
    }
}
