let firstNum = '';
let secondNum = '';
let currentOperator = '';
let displayedResult = false;

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

function round(value) {
    if (typeof value === 'number' && !Number.isInteger(value)) {
        return Number(value.toFixed(6));
    } else {
        return value;
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
        btn.addEventListener('click', () => {
            onClickDigit(digit);
        });
        calculatorContainer.appendChild(btn);
    });

    operators.forEach((operator) => {
        const btn = document.createElement('button');
        btn.classList.add('operator-btn');
        btn.textContent = operator;
        btn.addEventListener('click', () => {
            onClickOperator(operator);
        });
        calculatorContainer.appendChild(btn);
    });

    specialBtns.forEach(({ label, className }) => {
        const btn = document.createElement('button');
        btn.classList.add(className);
        btn.textContent = label;

        if (label === '=') {
            btn.addEventListener('click', onClickEqual);
        }

        if (label === '.') {
            btn.addEventListener('click', onClickDecimal);
        }

        if (label === 'clear') {
            btn.addEventListener('click', onClickClear);
        }

        if (label === 'backspace') {
            btn.addEventListener('click', onClickBackspace);
        }

        calculatorContainer.appendChild(btn);
    });

    document.body.appendChild(calculatorContainer);
}

function whitespacedDisplay() {
    return `${firstNum} ${currentOperator} ${secondNum}`.trim();
}

function updateDisplay(value) {
    const display = document.querySelector('.calculator-display');
    if (display) {
        display.value = value;
    }
}

function onClickDigit(digit) {
    if (displayedResult && currentOperator === '') {
        firstNum = '';
        secondNum = '';
        currentOperator = '';
        displayedResult = false;
    }

    if (currentOperator === '') {
        firstNum += digit;
    } else {
        secondNum += digit;
    }

    updateDisplay(whitespacedDisplay());
}

function onClickOperator(selectedOperator) {
    const normalizeOperators = {
        '\u002B': '+',
        '\u2212': '-',
        '\u00D7': '*',
        '\u00F7': '/',
    };

    const convertedOperator = normalizeOperators[selectedOperator];

    // Re-selecting the operator without the second number (just replace it).
    if (currentOperator && !secondNum) {
        currentOperator = convertedOperator;
        updateDisplay(whitespacedDisplay());
        return;
    }

    // If all the data is available, calculate the result before the new statement.
    if (firstNum && currentOperator && secondNum) {
        const resultValueOperator = round(
            operate(currentOperator, firstNum, secondNum)
        );
        firstNum = resultValueOperator.toString();
        secondNum = '';
        displayedResult = false;
    }

    // If there is at least a firstNum, record the selected operator and update the display (show that the user has started a new input).
    if (firstNum) {
        currentOperator = convertedOperator;
        updateDisplay(whitespacedDisplay());
    }
}

function onClickEqual() {
    if (firstNum && currentOperator && secondNum) {
        const resultValueEqual = round(
            operate(currentOperator, firstNum, secondNum)
        );
        updateDisplay(resultValueEqual);
        firstNum = resultValueEqual.toString();
        secondNum = '';
        currentOperator = '';
        displayedResult = true;
    }
}

function onClickDecimal() {
    if (displayedResult) return;

    if (currentOperator === '') {
        if (!firstNum.includes('.')) {
            firstNum += firstNum === '' ? '0.' : '.';
        }
    }

    if (currentOperator !== '') {
        if (!secondNum.includes('.')) {
            secondNum += secondNum === '' ? '0.' : '.';
        }
    }

    updateDisplay(whitespacedDisplay());
}

function onClickClear() {
    firstNum = '';
    secondNum = '';
    currentOperator = '';
    displayedResult = false;
    updateDisplay('0');
}

function onClickBackspace() {
    if (displayedResult) return;

    if (currentOperator === '') {
        firstNum = firstNum.slice(0, -1);
    } else {
        secondNum = secondNum.slice(0, -1);
    }

    updateDisplay(whitespacedDisplay() || '0');
}

createCalculatorUI();
