async function showOrder() {
  const q = new URLSearchParams(location.search);
  const id = q.get('order') || 'NL-1001';
  const root = document.querySelector('[data-order]');
  const res = await fetch('/api/refund?id=' + encodeURIComponent(id));
  const data = await res.json();
  const order = data.order;
  root.innerHTML = order ? '<h3>' + order.id + '</h3><p>' + order.productId + ' · $' + order.amount + '</p><p>' + order.status + '. ' + order.ship + '</p><p>' + (data.held ? 'Refunds held' : 'Refunds open') + '</p>' : '<p>No row for ' + id + ' yet.</p>';
  const amount = document.querySelector('[name=amount]');
  if (order && amount) amount.value = order.amount;
}
async function requestRefund(event) {
  event.preventDefault();
  const error = document.querySelector('[data-refund-error]');
  const res = await fetch('/api/refund', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: event.target.orderId.value, amount: Number(event.target.amount.value) }) });
  const data = await res.json();
  error.textContent = data.error || data.note || 'Done.';
}
document.querySelector('[data-refund]').addEventListener('submit', requestRefund);
showOrder();
