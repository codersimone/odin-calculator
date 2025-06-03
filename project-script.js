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

const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const specialBtns = [
    { label: '.', className: 'decimal-btn' },
    { label: '=', className: 'equal-btn' },
    { label: 'clear', className: 'clear-btn' },
    { label: 'backspace', className: 'backspace-btn' },
];
const operators = ['\u002B', '\u2212', '\u00D7', '\u00F7'];

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

    const calculatorTitle = document.createElement('h1');
    calculatorTitle.classList.add('calculator-title');
    calculatorTitle.textContent = 'Just calculate it';
    calculatorContainer.appendChild(calculatorTitle);

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

        if (label === '.') {
            btn.addEventListener('click', onClickDecimal);
        }

        if (label === '=') {
            btn.addEventListener('click', onClickEqual);
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

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (digits.includes(key)) {
        onClickDigit(key);
        return;
    }

    if (['+', '-', '*', '/'].includes(key)) {
        const normalizeSymbols = {
            '+': '\u002B',
            '-': '\u2212',
            '*': '\u00D7',
            '/': '\u00F7',
        };
        onClickOperator(normalizeSymbols[key]);
        return;
    }

    if (key === '.' || key === ',') {
        onClickDecimal();
        return;
    }

    if (key === '=' || key === 'Enter') {
        onClickEqual();
        return;
    }

    if (key.toLowerCase() === 'c' || key === 'Escape') {
        onClickClear();
        return;
    }

    if (key === 'Backspace') {
        onClickBackspace();
        return;
    }
});

function whitespacedDisplay() {
    return `${firstNum} ${currentOperator} ${secondNum}`.trim();
}

function updateDisplay(value) {
    const display = document.querySelector('.calculator-display');
    if (!display) return;

    value = String(value).slice(0, 20);
    display.value = value;
    adjustFontSize(display);
}

function disabledButtons() {
    const selectedBtns = document.querySelectorAll('.digit-btn, .decimal-btn');
    const totalInputLength = (firstNum + currentOperator + secondNum).length;

    selectedBtns.forEach((btn) => {
        btn.disabled = totalInputLength >= 20;
    });
}

function adjustFontSize(display) {
    const length = display.value.length;

    if (length <= 10) {
        display.style.fontSize = '4rem';
        return;
    }

    if (length <= 15) {
        display.style.fontSize = '3rem';
        return;
    }

    if (length <= 20) {
        display.style.fontSize = '2.2rem';
        return;
    }
}

function onClickDigit(digit) {
    const totalInputLength = (firstNum + currentOperator + secondNum).length;
    if (totalInputLength >= 20) return;

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
    disabledButtons();
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
        disabledButtons();
    }

    // If all the data is available, calculate the result before the new statement.
    if (firstNum && currentOperator && secondNum) {
        const resultValueOperator = round(
            operate(currentOperator, firstNum, secondNum)
        );
        firstNum = String(resultValueOperator);
        secondNum = '';
        displayedResult = false;
        updateDisplay(whitespacedDisplay());
        disabledButtons();
    }

    // If there is at least a firstNum, record the selected operator and update the display (show that the user has started a new input).
    if (firstNum) {
        currentOperator = convertedOperator;
        updateDisplay(whitespacedDisplay());
        disabledButtons();
    }
}

function onClickDecimal() {
    const totalInputLength = (firstNum + currentOperator + secondNum).length;
    if (totalInputLength >= 20) return;

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
    disabledButtons();
}

function onClickEqual() {
    if (firstNum && currentOperator && secondNum) {
        const resultValueEqual = round(
            operate(currentOperator, firstNum, secondNum)
        );
        updateDisplay(resultValueEqual);
        firstNum = String(resultValueEqual);
        secondNum = '';
        currentOperator = '';
        displayedResult = true;
    }
}

function onClickClear() {
    firstNum = '';
    secondNum = '';
    currentOperator = '';
    displayedResult = false;
    updateDisplay('0');
    disabledButtons();
}

function onClickBackspace() {
    if (displayedResult) return;

    if (currentOperator === '') {
        firstNum = firstNum.slice(0, -1);
    }

    if (currentOperator !== '' && secondNum === '') {
        currentOperator = '';
    }

    if (secondNum !== '') {
        secondNum = secondNum.slice(0, -1);
    }

    updateDisplay(whitespacedDisplay() || '0');
    disabledButtons();
}

createCalculatorUI();
