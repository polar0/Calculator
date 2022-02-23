const buttons = document.querySelectorAll('button');

const screenResult = document.querySelector('#result');
const screenCalcul = document.querySelector('#calcul');

// au pire faire direct avec l'array buttons
const buttonsArray = [];
let numArray = [];
let calculArray = [];
let numSpan;
let opeSpan;
let numA = '';
let numB = '';
let operation;
let result = '';
let lastValueIsNumber;

// for (const button of buttons) {
//   let buttonObj = {
//     value: button.value,
//     type: button.getAttribute('class'),
//   };
//   buttonsArray.push(buttonObj);
// }

buttons.forEach((button) => {
  button.addEventListener('click', getValue);
});

function displayCalcul(arg) {
  if (arg.getAttribute('class') === 'operator') {
    // If the user inputs two operators in a row, replace the previous with the new one
    if (!lastValueIsNumber) {
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
  }
}

function displayResult(result) {
  if (typeof result === 'number') {
    console.log(result);
    screenResult.textContent = result;
    result = '';
  }
}

function getValue() {
  if (this.getAttribute('class') === 'number') {
    // Add each number to the temp array
    numArray.push(this.value);
    lastValueIsNumber = true;
    displayCalcul(this);
  } else if (this.getAttribute('class') === 'operator') {
    // If numA is not yet defined, give it the temp array value
    if (typeof numA === 'string') {
      numA = Number(numArray.join(''));
      // Reset the array for the next number input
      numArray = [];
      // Store the operation type to process it on next operation input (or =)
      operation = this.name;
      // If numA is already defined (always except after reset)
    } else if (typeof numA === 'number') {
      numB = Number(numArray.join(''));
      numArray = [];
      // Draw the result being provided the operation type previously stored
      result = getResult(operation, numA, numB);
      displayResult(result);
      // For each following operation, numA gets the result value, and numB the new input
      numA = result;
      // Store the operation type again for the incoming process
      operation = this.name;
    }

    displayCalcul(this);
    // Tell the calculator the last input was an operator
    lastValueIsNumber = false;
  } else if (this.name === 'result') {
    if (typeof numA === 'string') {
      numA = Number(numArray.join(''));
      numArray = [];
      displayResult(numA);
    }
  }

  console.log(numA, numB);
}

function getResult(operation, numA, numB) {
  if (operation === 'add') {
    return addNumbers(numA, numB);
  } else if (operation === 'substract') {
    return substractNumbers(numA, numB);
  } else if (operation === 'multiply') {
    return multiplyNumbers(numA, numB);
  } else if (operation === 'divide') {
    return divideNumbers(numA, numB);
  } else if (operation === 'pow') {
    return powNumbers(numA, numB);
  } else if (operation === 'sqrt') {
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
