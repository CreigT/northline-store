async function loadBook() {
  const root = document.querySelector('[data-book]');
  const res = await fetch('/api/book', { cache: 'no-store' });
  if (!res.ok) { root.textContent = 'Open this on Vercel so the book can be read.'; return; }
  const data = await res.json();
  const rows = data.orders || [];
  root.innerHTML = rows.map((order) => '<article class="card"><h3>' + order.id + '</h3><p>' + order.productId + ' · $' + order.amount + '</p><p>' + order.status + '. ' + order.ship + '</p></article>').join('') || 'No paid rows yet.';
}
loadBook();
