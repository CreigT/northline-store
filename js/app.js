const TOKEN_KEY = 'northline_owner_token';
async function unlock(event) {
  event.preventDefault();
  const error = document.querySelector('[data-error]');
  const res = await fetch('/api/access', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: event.target.code.value }) });
  const data = await res.json();
  if (!res.ok) { error.textContent = data.error || 'Could not open.'; return; }
  localStorage.setItem(TOKEN_KEY, data.token);
  document.querySelector('[data-gate]').classList.add('hidden');
  document.querySelector('[data-panel]').classList.remove('hidden');
}
async function authed(path, body, errorSel, downloadName) {
  const error = document.querySelector(errorSel);
  const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, token: localStorage.getItem(TOKEN_KEY) }) });
  let data = await res.json();
  if (res.status === 409 && data.needsConfirm && confirm(data.error)) {
    const again = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, confirm: true, token: localStorage.getItem(TOKEN_KEY) }) });
    data = await again.json();
  }
  error.textContent = data.error || ((data.from !== undefined ? data.from + ' -> ' + data.to : data.id || 'Done') + '. Download, replace the file, push, redeploy.');
  if (data.file) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([data.file], { type: 'application/json' }));
    a.download = downloadName;
    a.click();
  }
}
const unlockForm = document.querySelector('[data-unlock]');
if (unlockForm) unlockForm.addEventListener('submit', unlock);
const priceForm = document.querySelector('[data-price]');
if (priceForm) priceForm.addEventListener('submit', (event) => { event.preventDefault(); authed('/api/price', { id: event.target.id.value, price: Number(event.target.price.value) }, '[data-price-error]', 'catalog.json'); });
const stockForm = document.querySelector('[data-stock]');
if (stockForm) stockForm.addEventListener('submit', (event) => { event.preventDefault(); authed('/api/stock', { id: event.target.id.value, stock: Number(event.target.stock.value) }, '[data-stock-error]', 'catalog.json'); });
const shipForm = document.querySelector('[data-ship]');
if (shipForm) shipForm.addEventListener('submit', (event) => { event.preventDefault(); authed('/api/ship', { id: event.target.id.value, note: event.target.note.value }, '[data-ship-error]', 'orders.json'); });
