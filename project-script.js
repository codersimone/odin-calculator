let firstNum = '';
let secondNum = '';
let operator = '';

const operations = {
    '+': add,
    '-': subtract,
    '*': multiply,
    '/': divide,
};

const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const operators = ['\u002B', '\u2212', '\u00D7', '\u00F7'];
const specialBtns = [
    { label: '=', className: 'equal-btn' },
    { label: '.', className: 'decimal-btn' },
    { label: 'clear', className: 'clear-btn' },
    { label: 'backspace', className: 'backspace-btn' },
];

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

    if (isNaN(numOne) || isNaN(numTwo)) {
        return `Error: enter a number!`;
    }

    if (operator in operations) {
        return operations[operator](numOne, numTwo);
    } else {
        return `Error: unknown operator!`;
    }
}

function createCalculatorUI() {
    const calculatorContainer = document.createElement('div');
    calculatorContainer.classList.add('calculator-container');

    const calculatorDisplay = document.createElement('input');
    calculatorDisplay.classList.add('calculator-display');
    calculatorDisplay.type = 'text';
    calculatorDisplay.value = '0';
    calculatorDisplay.readOnly = true;
    calculatorContainer.appendChild(calculatorDisplay);

    digits.forEach((digit) => {
        const btn = document.createElement('button');
        btn.classList.add('digit-btn');
        btn.textContent = digit;
        calculatorContainer.appendChild(btn);
    });

    operators.forEach((operator) => {
        const btn = document.createElement('button');
        btn.classList.add('operator-btn');
        btn.textContent = operator;
        calculatorContainer.appendChild(btn);
    });

    specialBtns.forEach(({ label, className }) => {
        const btn = document.createElement('button');
        btn.classList.add(className);
        btn.textContent = label;
        calculatorContainer.appendChild(btn);
    });

    document.body.appendChild(calculatorContainer);
}

createCalculatorUI();
