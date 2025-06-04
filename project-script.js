let firstNum = '';
let secondNum = '';
let currentOperator = '';
let savedFirstNum = '';
let savedSecondNum = '';
let savedCurrentOperator = '';
let displayedResult = false;
let hasError = false;

const operations = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => (b === 0 ? checkError(`Error: can't divide by 0!`) : a / b),
};

const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const specialBtns = [
    { label: '.', className: 'decimal-btn' },
    { label: '=', className: 'equal-btn' },
    { label: 'clear', className: 'clear-btn' },
    { label: 'backspace', className: 'backspace-btn' },
];
const operators = ['\u002B', '\u2212', '\u00D7', '\u00F7'];

function checkError(message) {
    hasError = true;
    savedFirstNum = firstNum;
    savedSecondNum = secondNum;
    savedCurrentOperator = currentOperator;
    updateDisplay('0');
    changeTitle(message);
}

function resetError() {
    firstNum = '';
    secondNum = '';
    currentOperator = '';
    displayedResult = false;
    hasError = false;
    resetTitle();
}

function toNumType(value) {
    return Number(value);
}

function operate(operator, a, b) {
    let numOne = toNumType(a);
    let numTwo = toNumType(b);

    if (Number.isNaN(numOne) || Number.isNaN(numTwo)) {
        checkError(`Error: enter a number!`);
        return;
    }

    if (operator === '/' && numTwo === 0) {
        checkError(`Error: can't divide by 0!`);
        return;
    }

    if (operator in operations) {
        return operations[operator](numOne, numTwo);
    } else {
        checkError(`Error: unknown operator!`);
        return;
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

    const calculatorDisplay = document.createElement('input');
    calculatorDisplay.classList.add('calculator-display');
    calculatorDisplay.type = 'text';
    calculatorDisplay.value = '0';
    calculatorDisplay.readOnly = true;

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container');

    const leftButtons = document.createElement('div');
    leftButtons.classList.add('left-buttons');

    digits.forEach((digit) => {
        const btn = document.createElement('button');
        btn.classList.add('digit-btn');
        btn.textContent = digit;
        btn.addEventListener('click', () => onClickDigit(digit));
        leftButtons.appendChild(btn);
    });

    const bottomBtnsContainer = document.createElement('div');
    bottomBtnsContainer.classList.add('bottom-btns-container');

    specialBtns.forEach(({ label, className }) => {
        const btn = document.createElement('button');
        btn.classList.add(className);
        btn.textContent = label;

        if (label === '.') btn.addEventListener('click', onClickDecimal);
        if (label === '=') btn.addEventListener('click', onClickEqual);
        if (label === 'clear') btn.addEventListener('click', onClickClear);
        if (label === 'backspace')
            btn.addEventListener('click', onClickBackspace);

        if (className === 'clear-btn' || className === 'backspace-btn') {
            bottomBtnsContainer.appendChild(btn);
        } else {
            leftButtons.appendChild(btn);
        }
    });

    const rightButtons = document.createElement('div');
    rightButtons.classList.add('right-buttons');

    operators.forEach((operator) => {
        const btn = document.createElement('button');
        btn.classList.add('operator-btn');
        btn.textContent = operator;
        btn.addEventListener('click', () => onClickOperator(operator));
        rightButtons.appendChild(btn);
    });

    leftButtons.appendChild(bottomBtnsContainer);

    buttonsContainer.appendChild(leftButtons);
    buttonsContainer.appendChild(rightButtons);

    calculatorContainer.appendChild(calculatorTitle);
    calculatorContainer.appendChild(calculatorDisplay);
    calculatorContainer.appendChild(buttonsContainer);

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
        const normalizedSymbols = {
            '+': '\u002B',
            '-': '\u2212',
            '*': '\u00D7',
            '/': '\u00F7',
        };
        onClickOperator(normalizedSymbols[key]);
        return;
    }

    if (key === '.' || key === ',') return onClickDecimal();
    if (key === '=' || key === 'Enter') return onClickEqual();
    if (key.toLowerCase() === 'c' || key === 'Escape') return onClickClear();
    if (key === 'Backspace') return onClickBackspace();
});

function whitespacedDisplay() {
    const denormalizedOperators = {
        '+': '\u002B',
        '-': '\u2212',
        '*': '\u00D7',
        '/': '\u00F7',
    };

    const displayedOperators =
        denormalizedOperators[currentOperator] || currentOperator;

    return `${firstNum} ${displayedOperators} ${secondNum}`.trim();
}

function updateDisplay(value) {
    const display = document.querySelector('.calculator-display');
    if (!display) return;

    display.value = String(value).slice(0, 18);
    adjustFontSize(display);
}

function changeTitle(message) {
    const changedCalculatorTitle = document.querySelector('.calculator-title');
    changedCalculatorTitle.textContent = message;
    changedCalculatorTitle.classList.add('error-message');
}

function resetTitle() {
    const resetedCalculatorTitle = document.querySelector('.calculator-title');
    resetedCalculatorTitle.textContent = 'Just calculate it';
    resetedCalculatorTitle.classList.remove('error-message');
}

function disabledButtons() {
    const selectedBtns = document.querySelectorAll('.digit-btn, .decimal-btn');
    const totalInputLength = (firstNum + currentOperator + secondNum).length;

    selectedBtns.forEach((btn) => {
        btn.disabled = totalInputLength >= 18;
    });
}

function adjustFontSize(display) {
    display.style.fontSize = display.value.length <= 10 ? '2.6rem' : '1.6rem';
}

function onClickDigit(digit) {
    if ((firstNum + currentOperator + secondNum).length >= 18) return;

    if (hasError) resetError();

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
    const normalizedOperators = {
        '\u002B': '+',
        '\u2212': '-',
        '\u00D7': '*',
        '\u00F7': '/',
    };

    const convertedOperator = normalizedOperators[selectedOperator];

    if (hasError) resetError();

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
    if ((firstNum + currentOperator + secondNum).length >= 18) return;

    if (hasError) resetError();

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
        const resultValueEqual = operate(currentOperator, firstNum, secondNum);

        if (resultValueEqual === undefined) {
            return;
        }

        updateDisplay(round(resultValueEqual));
        firstNum = String(resultValueEqual);
        secondNum = '';
        currentOperator = '';
        displayedResult = true;
        resetTitle();
    }
}

function onClickClear() {
    firstNum = '';
    secondNum = '';
    currentOperator = '';
    displayedResult = false;
    updateDisplay('0');
    disabledButtons();
    resetTitle();
}

function onClickBackspace() {
    if (hasError) {
        firstNum = savedFirstNum;
        secondNum = savedSecondNum;
        currentOperator = savedCurrentOperator;
        hasError = false;
        resetTitle();
    }

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
