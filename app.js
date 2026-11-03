// Static GitHub Pages version: media is loaded directly from repository-root files.
const ticketCards = [...document.querySelectorAll('.ticket-card')];
const quantity = document.getElementById('quantity');
const seatMap = document.getElementById('seatMap');
let selectedTicket = null;
let selectedSeat = null;
const prices = { VIP: 30000, Regular: 10000 };
const fmt = amount => `KES ${Number(amount).toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

// Exact filenames currently shown in the user's GitHub repository.
const media = {
  bayernLogo: './bayern%20logo.png',
  ajaxLogo: './ajax%20logo.png',
  bayernVideo: './Bayern%20video.mp4',
  ajaxVideo: './Ajax%20video.mp4'
};
function loadLogo(id, fallbackId, src) {
  const img = document.getElementById(id);
  if (!img) return;
  img.onload = () => { img.hidden = false; if (fallbackId) document.getElementById(fallbackId).hidden = true; };
  img.onerror = () => { img.hidden = true; };
  img.src = src;
}
loadLogo('bayernLogo', 'bayernFallback', media.bayernLogo);
loadLogo('ajaxLogo', 'ajaxFallback', media.ajaxLogo);
loadLogo('heroBayernLogo', null, media.bayernLogo);
loadLogo('heroAjaxLogo', null, media.ajaxLogo);

// Play Bayern first, then Ajax, and repeat. Muted autoplay is required by browsers.
const video = document.getElementById('teamVideo');
if (video) {
  const clips = [media.bayernVideo, media.ajaxVideo];
  let clipIndex = 0;
  const playCurrentClip = () => {
    video.src = clips[clipIndex];
    video.load();
    const attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {
      // Browser may delay autoplay until the first user interaction.
    });
  };
  video.addEventListener('ended', () => { clipIndex = (clipIndex + 1) % clips.length; playCurrentClip(); });
  video.addEventListener('error', () => {
    if (clipIndex === 0) { clipIndex = 1; playCurrentClip(); }
  });
  playCurrentClip();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && video.paused) video.play().catch(() => {});
  });
}

const methodHint = document.getElementById('paymentHint');
document.querySelectorAll('input[name="paymentMethod"]').forEach(input => input.addEventListener('change', () => {
  methodHint.textContent = input.value === 'mpesa'
    ? 'M-Pesa payment is not connected on this static demo. A secure backend and verified Safaricom callback are required.'
    : 'Card payment is not connected on this static demo. A hosted provider checkout and verified server callback are required.';
}));

ticketCards.forEach(card => card.addEventListener('click', () => {
  ticketCards.forEach(item => item.classList.remove('selected'));
  card.classList.add('selected');
  selectedTicket = { tier: card.dataset.tier };
  updateSummary();
}));
for (let i = 1; i <= 40; i++) {
  const seat = document.createElement('button');
  seat.type = 'button'; seat.className = 'seat'; seat.textContent = i;
  seat.setAttribute('aria-label', `Seat preference ${i}`);
  seat.addEventListener('click', () => {
    document.querySelectorAll('.seat').forEach(x => x.classList.remove('chosen'));
    seat.classList.add('chosen'); selectedSeat = `Seat preference ${i}`;
    document.getElementById('seatStatus').textContent = `${selectedSeat} selected. Final seat assignment depends on organizer inventory.`;
    updateSummary();
  });
  seatMap.appendChild(seat);
}
function updateSummary() {
  const count = Number(quantity.value);
  const price = selectedTicket ? prices[selectedTicket.tier] : null;
  document.getElementById('summaryTier').textContent = selectedTicket?.tier || 'Not selected';
  document.getElementById('summarySeat').textContent = selectedSeat || 'No preference';
  document.getElementById('summaryQty').textContent = count;
  document.getElementById('summaryPrice').textContent = price == null ? 'Select ticket' : fmt(price);
  document.getElementById('summaryTotal').textContent = price == null ? 'Select ticket' : fmt(price * count);
}
quantity.addEventListener('change', updateSummary);
function updateKenyaClock() {
  const el = document.getElementById('kenyaClock');
  if (el) el.textContent = new Intl.DateTimeFormat('en-KE', { timeZone: 'Africa/Nairobi', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).format(new Date()) + ' EAT';
}
updateKenyaClock(); setInterval(updateKenyaClock, 1000);

// GitHub Pages is static hosting: never pretend to take payment or issue a ticket here.
document.getElementById('checkoutForm').addEventListener('submit', event => {
  event.preventDefault();
  const result = document.getElementById('result');
  const name = document.getElementById('customerName').value.trim();
  const email = document.getElementById('customerEmail').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const count = Number(quantity.value);
  if (!selectedTicket) return showMessage('Choose VIP or Regular before continuing.');
  if (!name || !email.includes('@') || !phone) return showMessage('Enter your full name, valid email, and phone number.');
  if (count < 1 || count > 5) return showMessage('You can select 1–5 tickets per order.');
  showMessage('Booking preview only. This GitHub Pages website does not process payments or issue tickets. To accept real M-Pesa or card payments, connect a secure backend and payment-provider callbacks first. No payment was taken.');
  function showMessage(message) {
    result.classList.remove('hidden');
    result.innerHTML = `<strong>Payment not started</strong><p>${escapeHtml(message)}</p>`;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});
updateSummary();
