const prevEl = document.getElementById('prev');
const curEl = document.getElementById('current');
const buttons = document.querySelectorAll('button');

let current = '0';
let previous = null;
let operator = null;
let justEvaluated = false;
let waitingForOperand = false;

function updateDisplay(){
  curEl.textContent = current;
  if(operator && previous !== null){
    prevEl.textContent = `${previous} ${operator}`;
  } else {
    prevEl.textContent = '\u00A0';
  }
  buttons.forEach(b=>{
    if(b.dataset.op){
      b.classList.toggle('active', b.dataset.op === operator);
    }
  });
}

function inputNumber(n){
  if(justEvaluated){
    current = n;
    justEvaluated = false;
  } else if(waitingForOperand){
    current = n;
    waitingForOperand = false;
  } else if(current === '0'){
    current = n;
  } else {
    if(current.replace('-','').length >= 12) return;
    current += n;
  }
  updateDisplay();
}

function inputDecimal(){
  if(justEvaluated){
    current = '0.';
    justEvaluated = false;
    updateDisplay();
    return;
  }
  if(waitingForOperand){
    current = '0.';
    waitingForOperand = false;
    updateDisplay();
    return;
  }
  if(!current.includes('.')) current += '.';
  updateDisplay();
}

function clearAll(){
  current = '0';
  previous = null;
  operator = null;
  justEvaluated = false;
  waitingForOperand = false;
  updateDisplay();
}

function del(){
  if(justEvaluated){
    clearAll();
    return;
  }
  if(waitingForOperand) return;
  current = current.length > 1 ? current.slice(0,-1) : '0';
  updateDisplay();
}

function percent(){
  current = String(parseFloat(current) / 100);
  updateDisplay();
}

function compute(a, b, op){
  a = parseFloat(a); b = parseFloat(b);
  switch(op){
    case '+': return a + b;
    case '−': return a - b;
    case '×': return a * b;
    case '÷': return b === 0 ? 'Error' : a / b;
  }
}

function formatResult(n){
  if(n === 'Error') return n;
  if(!isFinite(n)) return 'Error';
  let s = String(Math.round(n * 1e10) / 1e10);
  if(s.length > 12) s = parseFloat(n).toPrecision(8).replace(/\.?0+$/,'').replace(/\.?0+e/,'e');
  return s;
}

function chooseOperator(op){
  if(operator && previous !== null && !justEvaluated){
    const result = compute(previous, current, operator);
    previous = formatResult(result);
    current = previous;
  } else {
    previous = current;
  }
  operator = op;
  justEvaluated = false;
  waitingForOperand = true;
  updateDisplay();
}

function equals(){
  if(operator === null || previous === null) return;
  const result = compute(previous, current, operator);
  current = formatResult(result);
  previous = null;
  operator = null;
  justEvaluated = true;
  waitingForOperand = false;
  updateDisplay();
}

buttons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    if(btn.dataset.num !== undefined) inputNumber(btn.dataset.num);
    else if(btn.dataset.op) chooseOperator(btn.dataset.op);
    else if(btn.dataset.action === 'clear') clearAll();
    else if(btn.dataset.action === 'del') del();
    else if(btn.dataset.action === 'percent') percent();
    else if(btn.dataset.action === 'decimal') inputDecimal();
    else if(btn.dataset.action === 'equals') equals();
  });
});

window.addEventListener('keydown', (e)=>{
  if(e.key >= '0' && e.key <= '9') inputNumber(e.key);
  else if(e.key === '.') inputDecimal();
  else if(e.key === '+') chooseOperator('+');
  else if(e.key === '-') chooseOperator('−');
  else if(e.key === '*') chooseOperator('×');
  else if(e.key === '/'){ e.preventDefault(); chooseOperator('÷'); }
  else if(e.key === 'Enter' || e.key === '=') equals();
  else if(e.key === 'Backspace') del();
  else if(e.key === 'Escape') clearAll();
});

updateDisplay();
