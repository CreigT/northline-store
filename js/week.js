async function loadWeek() {
  const res = await fetch('/api/week', { cache: 'no-store' });
  if (!res.ok) return;
  const data = await res.json();
  document.querySelector('[data-week]').innerHTML = '<article class="card"><h3>Sales</h3><p>$' + data.sales + ' from ' + data.paidCount + ' paid</p></article><article class="card"><h3>Shipped</h3><p>' + data.sentCount + ' sent. ' + data.waitingCount + ' waiting.</p></article><article class="card"><h3>Holds</h3><p>Store ' + (data.paused ? 'paused' : 'open') + '. Refunds ' + (data.refundsHeld ? 'held' : 'open') + '.</p></article>';
  document.querySelector('[data-rows]').innerHTML = (data.rows || []).map((row) => '<article class="card"><h3>' + row.id + '</h3><p>' + row.productId + ' · $' + row.amount + ' · ' + row.status + '</p></article>').join('');
}
loadWeek();
