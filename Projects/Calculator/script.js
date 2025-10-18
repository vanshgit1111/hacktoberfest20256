const buttons = document.querySelectorAll('.btn');
const result = document.getElementById('result');
let expression = '';

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;

    if (value === 'C') {
      expression = '';
      result.value = '';
    } 
    else if (value === '=') {
      try {
        // Safely evaluate the expression
        result.value = eval(expression.replace('×', '*').replace('÷', '/'));
        expression = result.value;
      } catch {
        result.value = 'Error';
        expression = '';
      }
    } 
    else {
      expression += value;
      result.value = expression;
    }
  });
});
