const display = document.getElementById('display');
let current = '0';
let previous = null;
let operator = null;

document.querySelector('.calc__buttons').addEventListener('click', (e) => {
    const btn = e.target.closest('.calc__btn');
    if (!btn) return;
    
    const action = btn.dataset.action;
    const value = btn.textContent; 

    if (action === 'digit') {
        if (current === '0') {
            current = value;
        } else {
            current += value;
        }
        updateDisplay();
    } 
    else if (action === 'clear') {
        current = '0';
        previous = null;
        operator = null;
        updateDisplay();
    }
    else if (action === 'sign') {
        current = String(-parseFloat(current));
        updateDisplay();
    }
    else if (action === 'percent') {
        current = String(parseFloat(current) / 100);
        updateDisplay();
    }
    else if (action === 'operator') {
        previous = current;
        operator = value;
        current = '0';
    }
    else if (action === 'equals') {
        if (previous && operator) {
            const prev = parseFloat(previous);
            const curr = parseFloat(current);
            let result;
            
            switch (operator) {
                case '+': result = prev + curr; break;
                case '-': result = prev - curr; break;
                case '*': result = prev * curr; break;
                case '÷': result = prev / curr; break;
                case 'xʸ': result = Math.pow(prev, curr); break;
            }
            
            current = String(result);
            operator = null;
            previous = null;
            updateDisplay();
        }
    }
});

function updateDisplay() {
    display.value = current;
}