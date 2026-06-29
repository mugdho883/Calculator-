let cur = '0';
let prev = '';
let operator = '';
let justEvaled = false;

// ── DOM helpers ──────────────────────────────────────────
function updateDisplay() {
  document.getElementById('val').textContent = cur;
}

function updateExpr(text) {
  document.getElementById('expr').textContent = text;
}

// ── Number input ─────────────────────────────────────────
function num(digit) {
  if (justEvaled) {
    cur = digit;
    justEvaled = false;
  } else if (cur === '0') {
    cur = digit;
  } else if (cur.length < 12) {
    cur += digit;
  }
  updateDisplay();
}

// ── Decimal point ─────────────────────────────────────────
function dot() {
  if (justEvaled) {
    cur = '0.';
    justEvaled = false;
  } else if (!cur.includes('.')) {
    cur += '.';
  }
  updateDisplay();
}

// ── Operator ──────────────────────────────────────────────
function op(o) {
  if (operator && !justEvaled) {
    eq(true);           // chain: evaluate before setting new operator
  }
  prev = cur;
  operator = o;
  justEvaled = false;
  const sym = { '/': '÷', '*': '×', '-': '−', '+': '+' }[o];
  updateExpr(prev + ' ' + sym);
  cur = '0';
}

// ── Equals ────────────────────────────────────────────────
function eq(internal = false) {
  if (!operator || !prev) return;

  const a = parseFloat(prev);
  const b = parseFloat(cur);
  let result;

  switch (operator) {
    case '/': result = b === 0 ? 'Error' : a / b; break;
    case '*': result = a * b; break;
    case '-': result = a - b; break;
    case '+': result = a + b; break;
  }

  if (!internal) {
    const sym = { '/': '÷', '*': '×', '-': '−', '+': '+' }[operator];
    updateExpr(`${prev} ${sym} ${cur} =`);
  }

  cur = result === 'Error'
    ? 'Error'
    : parseFloat(result.toPrecision(10)).toString();

  prev = '';
  operator = '';
  justEvaled = true;
  updateDisplay();
}

// ── All Clear ─────────────────────────────────────────────
function ac() {
  cur = '0';
  prev = '';
  operator = '';
  justEvaled = false;
  updateExpr('');
  updateDisplay();
}

// ── Toggle sign ───────────────────────────────────────────
function sign() {
  if (cur !== '0' && cur !== 'Error') {
    cur = cur.startsWith('-') ? cur.slice(1) : '-' + cur;
    updateDisplay();
  }
}

// ── Percentage ────────────────────────────────────────────
function percent() {
  const v = parseFloat(cur);
  if (!isNaN(v)) {
    cur = (v / 100).toString();
    updateDisplay();
  }
}

// ── Keyboard support ──────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') num(e.key);
  else if (e.key === '.') dot();
  else if (e.key === '+') op('+');
  else if (e.key === '-') op('-');
  else if (e.key === '*') op('*');
  else if (e.key === '/') { e.preventDefault(); op('/'); }
  else if (e.key === 'Enter' || e.key === '=') eq();
  else if (e.key === 'Escape') ac();
  else if (e.key === 'Backspace') {
    if (cur.length > 1) cur = cur.slice(0, -1);
    else cur = '0';
    updateDisplay();
  }
});
