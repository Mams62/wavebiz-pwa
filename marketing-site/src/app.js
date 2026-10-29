"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;

// A deliberately illustrative pattern; this is not a payment QR code.
function conceptQR() {
  let modules = "";
  const finder = (x, y, ox, oy) => {
    const a = x - ox, b = y - oy;
    return a >= 0 && a < 7 && b >= 0 && b < 7 && (a === 0 || a === 6 || b === 0 || b === 6 || (a >= 2 && a <= 4 && b >= 2 && b <= 4));
  };
  for (let y = 0; y < 25; y++) {
    for (let x = 0; x < 25; x++) {
      const reserved = (x < 8 && y < 8) || (x > 16 && y < 8) || (x < 8 && y > 16);
      const ink = reserved ? finder(x, y, 0, 0) || finder(x, y, 18, 0) || finder(x, y, 0, 18) : ((x * 17 + y * 31 + x * y * 7) % 13) < 6;
      if (ink) modules += `M${x + 2} ${y + 2}h1v1h-1z`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29" aria-hidden="true" shape-rendering="crispEdges"><rect width="29" height="29" fill="white"/><path d="${modules}" fill="#123950"/></svg>`;
}
function fillQR(root = document) { $$('[data-qr]', root).forEach(node => { node.innerHTML = conceptQR(); }); }
fillQR();

const bars = '<i style="--height:38%"></i><i style="--height:55%"></i><i style="--height:45%"></i><i style="--height:78%"></i><i style="--height:62%"></i><i style="--height:93%"></i><i style="--height:76%"></i>';
const products = {
  customer: {
    status: "CUSTOMER APP · IN DEVELOPMENT",
    title: "Your everyday.<br>With a better flow.",
    description: "Meet the customer side of Wave Transakt: a QR-first journey that brings merchant details, payment history and receipts into a clearer experience.",
    features: ["A thoughtful scan, review and confirm journey", "A vision for traceable receipts and transaction history", "Wallets, transfers and bills on the roadmap"],
    link: "Explore the customer journey",
    visualClass: "customer-visual",
    visual: `<div class="visual-rings"></div><div class="demo-screen"><div class="demo-screen-head">${icon('qr')} My Wave wallet</div><div class="demo-screen-body"><span class="demo-screen-subtitle">Chinedu Musa Ade · Sample profile</span><span class="demo-balance-label">Illustrative balance</span><h4 class="demo-balance">₦6,300.00</h4><div class="big-qr" data-qr></div><span class="preview-tag">SAMPLE WALLET QR · NOT FOR PAYMENT</span><div class="demo-screen-footer"><span>Illustrative wallet · no funds held</span>${icon('arrow')}</div></div></div><div class="floating-mini">${icon('receipt')}<div><strong>A record that stays with you.</strong><small>Receipts & history · concept</small></div></div><span class="visual-bottom-label">WAVE TRANSAKT · PRODUCT CONCEPT</span>`
  },
  business: {
    status: "BUSINESS TOOLS · IN DEVELOPMENT",
    title: "Your business.<br>A clearer picture.",
    description: "Wavebiz is our business-management concept for Nigerian SMEs. Connect the everyday details of running a shop, so the bigger picture is easier to see.",
    features: ["Sales, stock and expenses in one business view", "Customer debts, invoices, receipts and reports", "Business tools first; payment integration planned separately"],
    link: "See the business vision",
    visualClass: "business-visual",
    visual: `<div class="visual-rings"></div><div class="business-dashboard"><div class="dashboard-top">${icon('shop')} wavebiz<span>BUSINESS CONCEPT</span></div><div class="dashboard-body"><small>YOUR BUSINESS, AT A GLANCE</small><div class="dashboard-title">From daily sales.<br>To a bigger picture.</div><div class="dashboard-chart">${bars}</div><div class="dashboard-items"><div>${icon('box')} Inventory</div><div>${icon('receipt')} Receipts</div><div>${icon('chart')} Reports</div></div></div></div><div class="floating-mini">${icon('chart')}<div><strong>Run your business smarter.</strong><small>Illustrative business overview</small></div></div><span class="visual-bottom-label">WAVEBIZ · PRODUCT CONCEPT</span>`
  },
  pos: {
    status: "CHECKOUT & TERMINALS · IN DEVELOPMENT",
    title: "At the counter.<br>In the same flow.",
    description: "A dedicated Wave POS experience, designed to connect merchant identity, terminal pairing and checkout records with the wider Wave ecosystem.",
    features: ["Separate Android app for the checkout experience", "Merchant and terminal pairing concepts", "QR-first vision, with card and contactless on the roadmap"],
    link: "Explore the checkout journey",
    visualClass: "pos-visual",
    visual: `<div class="visual-rings"></div><div class="terminal"><div class="terminal-screen">${icon('qr')}<h4>Meet Wave POS.</h4><p>Designed for the everyday checkout.</p><div class="big-qr" data-qr></div><small>CONCEPT · NOT A PAYMENT CODE</small></div><div class="terminal-keypad">${'<i></i>'.repeat(12)}</div></div><div class="floating-mini">${icon('shop')}<div><strong>Your counter. Connected.</strong><small>Merchant & terminal concept</small></div></div><span class="visual-bottom-label">WAVE POS · PRODUCT CONCEPT</span>`
  }
};

function selectProduct(key, moveFocus = false) {
  const product = products[key];
  if (!product) return;
  $$('[data-product]').forEach(tab => {
    const selected = tab.dataset.product === key;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && moveFocus) tab.focus();
  });
  const panel = $('#product-panel');
  panel.setAttribute('aria-labelledby', `tab-${key}`);
  $('.product-copy', panel).innerHTML = `<span class="product-status">${product.status}</span><h3>${product.title}</h3><p>${product.description}</p><ul class="feature-list">${product.features.map(feature => `<li>${icon('check')}${feature}</li>`).join('')}</ul><button class="inline-link" data-walkthrough data-start="${key === 'business' ? 4 : 1}">${product.link} ${icon('arrow')}</button>`;
  const visual = $('#product-visual');
  visual.className = `product-visual ${product.visualClass}`;
  visual.innerHTML = product.visual;
  fillQR(visual);
}
$$('[data-product]').forEach((tab, index, tabs) => {
  tab.addEventListener('click', () => selectProduct(tab.dataset.product));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectProduct(tabs[next].dataset.product, true); }
  });
});
const initialProduct = new URLSearchParams(location.search).get('product');
selectProduct(['customer','business','pos'].includes(initialProduct) ? initialProduct : 'customer');

const menuToggle = $('.menu-toggle');
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
  $('#navigation').classList.remove('is-open');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  $('#navigation').classList.toggle('is-open', open);
});
$$('#navigation a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width:681px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
$('#year').textContent = String(new Date().getFullYear());

let toastTimer;
function toast(message) {
  clearTimeout(toastTimer);
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('is-visible');
  toastTimer = setTimeout(() => element.classList.remove('is-visible'), 3500);
}
const supportEmail = window.WAVE_CONFIG?.supportEmail || 'wavetransakt+support@gmail.com';
$('#copy-email').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(supportEmail);
    toast('Support email address copied.');
  } catch {
    toast('Our support email: ' + supportEmail);
  }
});

const steps = [
  {
    title: "One ecosystem. Three experiences.",
    description: "Wave Transakt for the customer. Wavebiz for the business owner. Wave POS for the checkout. A shared vision connects the people, tools and records behind everyday commerce.",
    visual: `<div class="journey-icon">${icon('shop')}</div><h4>A new wave of commerce.</h4><p>Built around customers and businesses.</p><div class="journey-apps"><span>${icon('phone')}CUSTOMER</span><span>${icon('chart')}WAVEBIZ</span><span>${icon('qr')}WAVE POS</span></div><span class="journey-pill">One connected vision.</span>`
  },
  {
    title: "Start with a simple scan.",
    description: "The intended checkout begins with the customer scanning a merchant QR. It's the first step towards connecting a payment journey with the right business and its records.",
    visual: `<h4>Meet your next checkout.</h4><p>Illustrative merchant QR</p><div class="big-qr" data-qr><span class="scan-line"></span></div><span class="journey-pill">Concept only · not for payment</span>`
  },
  {
    title: "Know who you're paying.",
    description: "Review the merchant and the amount before confirmation. Account verification and payment authorisation are part of the intended journey and require completed integrations and testing.",
    visual: `<div class="journey-icon">${icon('shop')}</div><h4>Review the details.</h4><div class="journey-row"><span>Merchant</span><strong>Example Store</strong></div><div class="journey-row"><span>Amount</span><strong>₦5,000.00</strong></div><span class="journey-pill">Illustrative details · no payment</span>`
  },
  {
    title: "Keep both sides informed.",
    description: "The vision connects customer confirmation, merchant records and traceable receipts. Live payment status and settlement will depend on verified payment providers and end-to-end testing.",
    visual: `<div class="journey-icon">${icon('receipt')}</div><h4>The story of a sale.</h4><div class="journey-row"><span>Customer</span><strong>A clear record</strong></div><div class="journey-row"><span>Merchant</span><strong>A traceable receipt</strong></div><div class="journey-row"><span>Stage</span><strong>Product concept</strong></div><span class="journey-pill">No funds moved in this preview.</span>`
  },
  {
    title: "Make the day add up.",
    description: "Beyond checkout, Wavebiz brings a vision for sales, inventory, expenses, customer debts and business reports. The goal: clearer records and a better understanding of the business day.",
    visual: `<div class="journey-icon">${icon('chart')}</div><h4>A clearer business picture.</h4><div class="dashboard-chart">${bars}</div><span class="journey-pill">Sales · stock · expenses · reports</span><p style="margin-top:10px">Illustrative business overview</p>`
  }
];

const walkthrough = $('#walkthrough-dialog');
let step = 0, elapsed = 0, playing = false, ended = false, clock, lastTick;
let previousFocus;
const stepDuration = 6500;

function showDialog(dialog) {
  previousFocus = document.activeElement;
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('dialog-open');
}
function syncPlayback() {
  $('#step-pause').textContent = ended ? 'Replay' : playing ? 'Pause' : 'Play';
  $('#walkthrough-stage').classList.toggle('stage-paused', !playing);
}
function renderStep(next) {
  step = Math.max(0, Math.min(next, steps.length - 1));
  elapsed = 0;
  ended = false;
  const current = steps[step];
  $('#step-number').textContent = `STEP 0${step + 1} / 0${steps.length}`;
  $('#step-title').textContent = current.title;
  $('#step-description').textContent = current.description;
  $('#walkthrough-stage').innerHTML = `<div class="journey-card">${current.visual}</div>`;
  fillQR($('#walkthrough-stage'));
  // Add the scanner after replacing the QR container's contents.
  if (step === 1) $('.big-qr', $('#walkthrough-stage')).insertAdjacentHTML('beforeend', '<span class="scan-line"></span>');
  $$('#step-dots button').forEach((dot, index) => {
    if (index === step) dot.setAttribute('aria-current', 'step');
    else dot.removeAttribute('aria-current');
  });
  $('#step-previous').disabled = step === 0;
  $('#step-next').innerHTML = `${step === steps.length - 1 ? 'Replay' : 'Next'} ${icon('arrow')}`;
  syncPlayback();
  updateProgress();
}
function updateProgress() {
  $('#walkthrough-progress').style.width = `${((step + Math.min(elapsed / stepDuration, 1)) / steps.length) * 100}%`;
}
function openWalkthrough(start = 0) {
  $('#walkthrough-content').hidden = false;
  $('#actual-video').hidden = true;
  $('#actual-video').replaceChildren();
  $('#walkthrough-title').textContent = 'One connected journey.';
  playing = !window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  renderStep(start);
  showDialog(walkthrough);
  clearInterval(clock);
  lastTick = performance.now();
  clock = setInterval(() => {
    const now = performance.now();
    const delta = now - lastTick;
    lastTick = now;
    if (!playing || document.hidden) return;
    elapsed += Math.min(delta, 300);
    if (elapsed >= stepDuration) {
      if (step < steps.length - 1) renderStep(step + 1);
      else { elapsed = stepDuration; playing = false; ended = true; syncPlayback(); }
    }
    updateProgress();
  }, 150);
}
$('#step-dots').innerHTML = steps.map((chapter, index) => `<button aria-label="Step ${index + 1}: ${chapter.title}" data-step="${index}"></button>`).join('');
$$('#step-dots button').forEach(dot => dot.addEventListener('click', () => renderStep(Number(dot.dataset.step))));
$('#step-next').addEventListener('click', () => { if (step === steps.length - 1) { playing = true; renderStep(0); } else renderStep(step + 1); });
$('#step-previous').addEventListener('click', () => renderStep(step - 1));
$('#step-pause').addEventListener('click', () => {
  if (ended) { playing = true; renderStep(0); }
  else playing = !playing;
  syncPlayback();
});
document.addEventListener('click', event => {
  const productLink = event.target.closest('[data-select-product]');
  if (productLink) selectProduct(productLink.dataset.selectProduct);
  const trigger = event.target.closest('[data-walkthrough]');
  if (trigger) openWalkthrough(Number(trigger.dataset.start || 0));
});
$$('[data-chapter]').forEach(button => button.addEventListener('click', () => openWalkthrough(Number(button.dataset.chapter))));

function configuredVideo() {
  const raw = window.WAVE_CONFIG?.demoVideoUrl?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw, location.href);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return null;
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'www.youtu.be', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(url.hostname)) {
      let id = url.hostname.endsWith('youtu.be') ? url.pathname.slice(1) : url.searchParams.get('v') || (/^\/(?:embed|shorts)\/([^/?]+)/.exec(url.pathname)?.[1]);
      if (!/^[A-Za-z0-9_-]{11}$/.test(id || '')) return null;
      return { type: 'youtube', url: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` };
    }
    if (/\.mp4$/i.test(url.pathname)) return { type: 'mp4', url: url.href };
  } catch { /* Keep the functional concept walkthrough when a video URL is invalid. */ }
  return null;
}
const video = configuredVideo();
if (video) {
  $('#watch-button').setAttribute('aria-label', 'Watch the Wave Transakt explainer video');
  $('#video-format').textContent = 'THE WAVE TRANSAKT EXPLAINER';
  $('#video-intro').textContent = 'Watch our product explainer, then explore the intended customer and business journeys in the interactive chapters below.';
}
$('#watch-button').addEventListener('click', () => {
  if (!video) { openWalkthrough(); return; }
  clearInterval(clock);
  playing = false;
  $('#walkthrough-content').hidden = true;
  const container = $('#actual-video');
  container.hidden = false;
  container.replaceChildren();
  if (video.type === 'youtube') {
    const iframe = document.createElement('iframe');
    iframe.src = video.url;
    iframe.title = 'How Wave Transakt works';
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    container.append(iframe);
  } else {
    const player = document.createElement('video');
    player.controls = true;
    player.playsInline = true;
    player.preload = 'metadata';
    player.src = video.url;
    player.setAttribute('aria-label', 'How Wave Transakt works');
    player.addEventListener('error', () => {
      if ($('.video-load-error', container)) return;
      const message = document.createElement('p');
      message.className = 'video-load-error';
      message.textContent = 'The video could not load. Close this window and use the interactive chapters to explore the concept.';
      container.append(message);
    });
    container.append(player);
    player.play().catch(() => {});
  }
  showDialog(walkthrough);
});

$$('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
$$('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (dialog === walkthrough) {
      clearInterval(clock);
      playing = false;
      $('#actual-video').replaceChildren();
    }
    document.body.classList.toggle('dialog-open', $$('dialog[open]').length > 0);
    previousFocus?.focus();
  });
});
