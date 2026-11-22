(() => {
  'use strict';
  const cfg = window.HAPPY_CONFIG || { discordUrl: 'https://discord.gg/Y5r4f4BYtm', links: {} };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (id) => document.getElementById(id);
  document.documentElement.classList.add('js');

  // Toast
  const toast = $('toast'), toastText = $('toastText'), toastIcon = $('toastIcon');
  let toastTimer;
  function showToast(msg, isError = false) {
    toastText.textContent = msg;
    toast.classList.toggle('error', isError);
    toastIcon.className = isError ? 'fa-solid fa-xmark' : 'fa-solid fa-check';
    toastIcon.style.color = isError ? '#ff4d4d' : 'var(--neon-cyan)';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // Discord (hero button + community button)
  const openDiscord = () => window.open(cfg.discordUrl, '_blank', 'noopener,noreferrer');
  document.querySelectorAll('#discordBtn,[data-discord]').forEach((b) => b.addEventListener('click', openDiscord));

  // Copy Script (clipboard logic unchanged)
  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; }
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, ta.value.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    if (!ok) throw new Error('Clipboard copy command was rejected.');
    return true;
  }
  const copyBtn = $('copyBtn');
  if (copyBtn) {
    let copyTimer;
    copyBtn.addEventListener('click', async () => {
      const label = copyBtn.querySelector('span'), icon = copyBtn.querySelector('i');
      copyBtn.disabled = true;
      try {
        await copyText($('scriptContent').textContent.trim());
        showToast('Script copied to clipboard.');
        label.textContent = 'Copied!'; icon.className = 'fa-solid fa-check';
        copyBtn.style.background = 'rgba(0, 245, 212, 0.1)';
      } catch (e) {
        console.error('Unable to copy script:', e);
        showToast('Unable to copy. Please select the command and copy it manually.', true);
      } finally {
        clearTimeout(copyTimer);
        copyTimer = setTimeout(() => {
          label.textContent = 'Copy Script'; icon.className = 'fa-solid fa-terminal';
          copyBtn.style.background = ''; copyBtn.disabled = false;
        }, 1800);
      }
    });
  }

  // Sheet Studio information modal: content is editable in assets/site-config.js.
  const infoModal = $('sheetStudioInfoModal');
  const infoTrigger = document.querySelector('[data-modal-open="sheetStudioInfo"]');
  if (infoModal && infoTrigger) {
    const info = cfg.sheetStudioInfo || {};
    const eyebrow = $('sheetStudioInfoEyebrow');
    const title = $('sheetStudioInfoTitle');
    const content = $('sheetStudioInfoContent');
    const highlights = $('sheetStudioInfoHighlights');

    if (eyebrow && info.eyebrow) eyebrow.textContent = info.eyebrow;
    if (title && info.title) title.textContent = info.title;
    if (content) content.textContent = info.content || 'More information about Sheet Studio will be added soon.';

    if (highlights) {
      highlights.replaceChildren();
      const items = Array.isArray(info.highlights) ? info.highlights : [];
      items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = String(item);
        highlights.appendChild(li);
      });
      highlights.hidden = items.length === 0;
    }

    infoTrigger.addEventListener('click', () => {
      if (typeof infoModal.showModal === 'function') infoModal.showModal();
      else infoModal.setAttribute('open', '');
    });
    infoModal.querySelectorAll('[data-modal-close]').forEach((button) => {
      button.addEventListener('click', () => {
        if (typeof infoModal.close === 'function') infoModal.close();
        else infoModal.removeAttribute('open');
      });
    });
    infoModal.addEventListener('click', (event) => {
      if (event.target === infoModal && typeof infoModal.close === 'function') infoModal.close();
    });
  }

  // Product CTAs: real link only when configured with a valid https URL; otherwise stay "Coming soon".
  document.querySelectorAll('[data-cta]').forEach((el) => {
    let url = (cfg.links || {})[el.dataset.cta];
    try { url = new URL(String(url || '')); if (url.protocol !== 'https:') url = null; } catch { url = null; }
    if (!url) return;
    const a = document.createElement('a');
    a.className = el.className.replace('is-soon', '').trim();
    a.textContent = el.dataset.label || el.textContent;
    a.href = url.href; a.target = '_blank'; a.rel = 'noopener noreferrer';
    el.replaceWith(a);
  });

  // Mobile nav
  const nav = document.querySelector('.nav'), toggle = $('navToggle');
  const setNav = (open) => { nav.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open)); };
  toggle.addEventListener('click', () => setNav(!nav.classList.contains('open')));
  document.querySelectorAll('.nav-links a').forEach((a) => a.addEventListener('click', () => setNav(false)));

  // Scroll reveal
  const items = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) items.forEach((i) => i.classList.add('in'));
  else {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
    items.forEach((i) => io.observe(i));
  }

  // Particles (unchanged behaviour)
  const canvas = $('particles'), ctx = canvas.getContext('2d');
  let w = 0, h = 0, ps = [], raf = null;
  const busy = () => document.documentElement.hasAttribute('data-swarm-building');
  function resize() {
    const r = Math.min(window.devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    canvas.width = Math.floor(w * r); canvas.height = Math.floor(h * r);
    ctx.setTransform(r, 0, 0, r, 0, 0);
  }
  const mk = () => ({ x: Math.random() * w, y: Math.random() * h, s: Math.random() * 2 + .5, vy: Math.random() * -.5 - .1, vx: (Math.random() - .5) * .5, o: Math.random() * .5, c: Math.random() > .5 ? 'rgba(255, 42, 133, ' : 'rgba(0, 245, 212, ' });
  function draw(animate) {
    ctx.clearRect(0, 0, w, h);
    for (const p of ps) {
      if (animate && !busy()) {
        p.y += p.vy; p.x += p.vx;
        if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
        if (p.x < -4) p.x = w + 4; if (p.x > w + 4) p.x = -4;
      }
      ctx.fillStyle = p.c + p.o + ')'; ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.2832); ctx.fill();
    }
    if (animate) raf = requestAnimationFrame(() => draw(true));
  }
  function init() { if (raf !== null) cancelAnimationFrame(raf); resize(); ps = Array.from({ length: 40 }, mk); draw(!reduced); }
  init();
  addEventListener('resize', init, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && raf !== null) { cancelAnimationFrame(raf); raf = null; }
    else if (!document.hidden && !reduced) draw(true);
  });
})();
