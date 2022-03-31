const buttons = document.querySelectorAll('button');
const inputs = document.querySelectorAll('input');

const screenResult = document.querySelector('#result');
const screenCalcul = document.querySelector('#calcul');
const screenError = document.querySelector('#error');

const caption = document.querySelector('.caption');
const powButton = document.querySelector('#pow');
const sqrtButton = document.querySelector('#sqrt');
const instruct = document.createElement('p');

const decimalsContainer = document.querySelector('.decimals-value');
const decimalsButton = decimalsContainer.querySelectorAll('button');
const decimalsDisplay = decimalsContainer.querySelector('div');

// au pire faire direct avec l'array buttons
const buttonsArray = [];
let numArray = [];
let numSpan;
let opeSpan;
let numA = '';
let numB = '';
let pow = false;
let sqrt = false;
let decimals = 2;
let operation = '';
let result = '';
let resultLength = [];
let lastValueIsNumber = false;
let needReset = false;

buttons.forEach((button) => {
  button.addEventListener('click', getValue);
});

window.addEventListener('keydown', getKeys);

function getKeys(e) {
  let keyCode = e.key.toLowerCase();
  if (keyCode === '*') {
    document.querySelector('button[value="x"').click();
  } else if (keyCode === ':') {
    document.querySelector('button[value="/"').click();
  } else if (keyCode === 'enter' || e.code === 'Space') {
    document.querySelector('button[value="result"').click();
  } else if (keyCode === 'backspace' || e.code === 'delete') {
    document.querySelector('button[value="delete"').click();
  } else {
    document.querySelector(`button[value="${keyCode}"`).click();
  }
}

decimalsButton.forEach((button) => {
  button.addEventListener('click', getDecimals);
});

inputs.forEach((input) => {
  input.addEventListener('click', getValue);
  input.addEventListener('click', function () {
    pow = false;
    sqrt = false;
    if (this.id === 'pow') {
      if (this.classList.contains('active')) {
        this.classList.remove('active');
        powStatus.disable();
      } else {
        this.classList.add('active');
        powStatus.enable();
        pow = true;
        if (sqrtButton.classList.contains('active')) {
          sqrtButton.classList.remove('active');
        }
      }
    } else if (this.id === 'sqrt') {
      if (this.classList.contains('active')) {
        sqrtStatus.process();
      } else {
        sqrtStatus.enable();
      }
    }
  });
});

const sqrtStatus = {
  enable() {
    if (isLastValueNumber()) {
      errorMessage('You need to enter an operator');
      this.bounce();
      return;
    }
    sqrt = true;
    sqrtButton.classList.add('active');
    if (powButton.classList.contains('active')) {
      powButton.classList.remove('active');
    }
    sqrtButton.value = 'Click here';
    instruct.textContent = 'Input number, then click the button again.';
    caption.appendChild(instruct);

    opeSpan = document.createElement('span');
    opeSpan.setAttribute('class', 'operator');
    opeSpan.textContent += 'sqrt(';
    screenCalcul.appendChild(opeSpan);

    numArray = [];
  },
  process() {
    sqrt = false;
    opeSpan = document.createElement('span');
    opeSpan.setAttribute('class', 'operator');
    opeSpan.textContent += ')';
    screenCalcul.appendChild(opeSpan);

    let sqrtResult = sqrtNumbers(Number(numArray.join('')));

    if (operation === undefined || operation === '') {
      displayResult(sqrtResult);
      result = sqrtResult;
    } else {
      result = getResult(operation, numA, sqrtResult);
      displayResult(result);
      console.log(sqrtResult);
    }

    this.disable();
  },
  disable() {
    sqrtButton.classList.remove('active');
    sqrtButton.value = 'sqrt';
    caption.removeChild(instruct);

    numA = result;
    numArray = [];
  },
  bounce() {
    sqrtButton.value = 'x';
    setTimeout(() => {
      sqrtButton.value = 'sqrt';
    }, 500);
  },
};

function displayCalcul(arg) {
  if (arg.getAttribute('class') === 'operator') {
    // If the user inputs two operators in a row, replace the previous with the new one
    if (
      !lastValueIsNumber &&
      screenCalcul.childNodes[screenCalcul.childNodes.length - 1]
        .textContent !== ')'
    ) {
      screenCalcul.childNodes[screenCalcul.childNodes.length - 1].remove();
    }
    // Add the operator input to the calculation display (with a custom color)
    opeSpan = document.createElement('span');
    opeSpan.textContent += ` ${arg.value} `;
    opeSpan.setAttribute('class', 'operator');
    screenCalcul.appendChild(opeSpan);
  } else if (arg.getAttribute('class') === 'number') {
    // Add the number input to the calculation display
    numSpan = document.createElement('span');
    numSpan.textContent += arg.value;
    screenCalcul.appendChild(numSpan);
  } else if (arg.getAttribute('value') === 'result') {
    if (operation.value === undefined) {
      // Prevent writing 'undefined' on the screen when pressing '=' after reset
      errorMessage('There is nothing to display');
      return;
    }
    // Repeat the last operation on '='
    opeSpan = document.createElement('span');
    opeSpan.textContent += ` ${operation.value} `;
    opeSpan.setAttribute('class', 'operator');
    screenCalcul.appendChild(opeSpan);

    numSpan = document.createElement('span');
    numSpan.textContent += numArray.join('');
    screenCalcul.appendChild(numSpan);
  }
}

function displayResult(result) {
  if (typeof result === 'number') {
    result = +result.toFixed(decimals);
    screenResult.textContent = result;

    // resultLength = result.toString().split('');
    if (result === Infinity) {
      screenResult.textContent += ' ' + '😈';
    }
  } else {
    errorMessage(
      'The result is not a number, something must have gone wrong...',
    );
  }
}

function getValue() {
  lastValueIsNumber = isLastValueNumber();
  if (this.getAttribute('class') === 'number') {
    // If last input was '=', reset the calculator on new number input
    if (needReset) {
      resetCalc();
      needReset = false;
    }
    // Prevent writing several '.' in a row...
    if (
      this.value === '.' &&
      screenCalcul.childNodes[screenCalcul.childNodes.length - 1]
        .textContent === '.'
    ) {
      screenCalcul.childNodes[screenCalcul.childNodes.length - 1].remove();
      numArray.pop();
      // ... or several '.' in the same number
    } else if (numArray.indexOf('.') !== -1 && this.value === '.') {
      return;
    }

    // Prevent entering a number straight after closing a bracket (sqrt)
    if (
      screenCalcul.childNodes.length !== 0 &&
      screenCalcul.childNodes[screenCalcul.childNodes.length - 1]
        .textContent === ')'
    ) {
      errorMessage('You need to enter an operator first');
      return;
    }

    // Add each number to the temp array
    numArray.push(this.value);
    displayCalcul(this);
  } else if (this.getAttribute('class') === 'operator') {
    if (sqrt === true) {
      sqrtStatus.process();
    }
    // If numA is not yet defined, give it the temp array value
    if (typeof numA === 'string') {
      if (numArray.length === 0) {
        return;
      }
      numA = Number(numArray.join(''));
      // Reset the array for the next number input
      numArray = [];
      // Store the operation type to process it on next operation input (or =)
      operation = this;
      // If numA is already defined (always except after reset)
    } else if (typeof numA === 'number') {
      if (lastValueIsNumber) {
        // Draw the result being provided the operation type previously stored
        result = getResult(operation, numA, numArray, this);
        numArray = [];
        displayResult(result);
        // For each following operation, numA gets the result value, and numArray the new input
        numA = result;
        // Store the operation type again for the incoming process
        operation = this;
      } else {
        // If the last character is an operator, let the user change it freely
        operation = this;
      }
    }

    displayCalcul(this);
    // Tell the calculator the last input was an operator
    lastValueIsNumber = false;
    needReset = false;
  } else if (this.value === 'result') {
    getResultFromButton(this);
  } else if (this.value === 'delete') {
    deleteCalc();
  } else if (this.value === 'reset') {
    resetCalc();
  }
}

function getResult(operation, numA, numArray, ...tempOperation) {
  typeof numArray === 'object'
    ? (numB = Number(numArray.join('')))
    : (numB = numArray);

  // Get the operation on first loading because it can't be retrieved for last operation
  // Usually it is no needed, but it is for sqrt, as it would stop the function right here if not specified
  // This should be corrected because we don't need to know the operators around to get sqrt result
  if (operation === undefined) {
    operation = tempOperation;
  }

  if (operation.value === '+') {
    return addNumbers(numA, numB);
  } else if (operation.value === '-') {
    return substractNumbers(numA, numB);
  } else if (operation.value === 'x') {
    return multiplyNumbers(numA, numB);
  } else if (operation.value === '/') {
    return divideNumbers(numA, numB);
  } else if (operation.value === 'pow') {
    return powNumbers(numA, numB);
  } else if (operation.value === 'sqrt') {
    return sqrtNumbers(numA, numB);
  }
}

function addNumbers(numA, numB) {
  return numA + numB;
}

function substractNumbers(numA, numB) {
  return numA - numB;
}

function multiplyNumbers(numA, numB) {
  return numA * numB;
}

function divideNumbers(numA, numB) {
  return numA / numB;
}

function powNumbers(a, b) {
  let result = 1;
  for (let i = 0; i < b; i++) {
    result *= a;
  }
  return result;
}

function sqrtNumbers(num) {
  return Math.sqrt(num);
}

function getResultFromButton(button) {
  if (typeof numA === 'string') {
    displayResult(Number(numArray.join('')));
  } else {
    result = getResult(operation, numA, numArray);
    displayResult(result);
  }
  // Redo the last operation on new imput
  if (needReset) {
    if (!isLastValueNumber()) {
      return;
    }
    if (operation === undefined) {
      // Don't do it without any operation input
      errorMessage('No operation has been defined');
      return;
    } else if (result === undefined) {
      // Prevent writing old arguments if calculator was just reset
      errorMessage('The machine has been reset');
      return;
    }
    numA = result;
    result = getResult(operation, numA, numArray);
    displayResult(result);
    displayCalcul(button);
  }
  // Precise that the last input was a result (=)
  needReset = true;
}

function deleteCalc() {
  // Let the user delete only a number, and only if they just input a value
  if (lastValueIsNumber && !needReset) {
    screenCalcul.childNodes[screenCalcul.childNodes.length - 1].remove();
    numArray.pop();
  }
}

function resetCalc() {
  numA = '';
  numArray = [];
  result = '';
  operation = '';
  screenCalcul.textContent = '';
  screenResult.textContent = 0;
  if (sqrt === true) {
    sqrtStatus.disable();
  }
}

function getDecimals() {
  if (decimals > 0 && decimals < 10) {
    if (this.id === 'decimals-up') {
      decimals++;
    } else if (this.id === 'decimals-down') {
      decimals--;
    }
  } else if (decimals === 0 && this.id === 'decimals-up') {
    decimals++;
  } else if (decimals === 10 && this.id === 'decimals-down') {
    decimals--;
  }
  decimalsDisplay.textContent = decimals;
  // Prevent the decimals not updating after reset (when result or numA are not defined)
  // Make sure it won't draw result on decimals change if result has not been pressed
  if (typeof result === 'string' && needReset) {
    displayResult(Number(numArray.join('')));
  } else {
    displayResult(result);
  }
}

// Always know if the last input is a number
function isLastValueNumber() {
  if (screenCalcul.childNodes.length !== 0) {
    // Make sure it works after loading the page (content is empty)
    if (
      !(
        screenCalcul.childNodes[screenCalcul.childNodes.length - 1] !==
          undefined &&
        screenCalcul.childNodes[screenCalcul.childNodes.length - 1]
          .textContent === ''
      )
    ) {
      // Tell if last value is not an operator
      return (
        screenCalcul.childNodes[
          screenCalcul.childNodes.length - 1
        ].getAttribute('class') !== 'operator'
      );
      // If window was just loaded, tell false
    } else {
      return false;
    }
  }
}

function errorMessage(message) {
  screenError.classList.add('animated');
  screenError.textContent = message;

  setTimeout(() => {
    screenError.classList.remove('animated');
  }, 2000);
}

// BUILDING
/*
const powContainer = document.querySelector('.pow');
const powBase = document.querySelector('#base');
const powExp = document.querySelector('#exponent');
const powEnter = document.querySelector('#pow-enter');

const powStatus = {
  enable() {
    powContainer.style.display = 'flex';
    powEnter.addEventListener('click', getPow);
    window.removeEventListener('keydown', getKeys);
  },
  disable() {
    powContainer.style.display = 'none';
    powEnter.removeEventListener('click', getPow);
    window.addEventListener('keydown', getKeys);
  },
};

function getPow() {
  if (powBase.value !== '' && powExp.value !== '') {
    result = powNumbers(powBase.value, powExp.value);
    if (
      typeof result === 'number' &&
      (operation === undefined || operation === '')
    ) {
      displayResult(result);
    } else {
      errorMessage('You can only use numbers');
    }
  } else {
    errorMessage('You need to fill all the fields');
  }
}
*/
