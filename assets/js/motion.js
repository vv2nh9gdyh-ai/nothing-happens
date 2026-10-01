/* ==========================================================
   NOTHING HAPPENS — motion.js
   smooth scroll / char reveal / parallax / magnetic / curtain nav
   ========================================================== */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const TOUCH   = matchMedia('(hover: none)').matches;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

const M = { y:0, target:0, vel:0, max:0 };

/* ══════════ 1. SPLIT TEXT ══════════
   <br> 보존하면서 글자 단위 span 래핑 */
function splitChars(el) {
  if (el.dataset.split) return;
  el.dataset.split = '1';
  const frag = document.createDocumentFragment();

  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        /* 소스 들여쓰기의 개행·탭은 곧이곧대로 감싸면 줄바꿈을 만든다.
           공백류는 전부 단일 공백 텍스트노드로 압축한다. */
        const txt = n.textContent.replace(/\s+/g, ' ');
        if (!txt.trim()) { if (txt) frag.appendChild(document.createTextNode(' ')); return; }
        [...txt].forEach(c => {
          if (c === ' ') { frag.appendChild(document.createTextNode(' ')); return; }
          const m = document.createElement('span');
          m.className = 'cmask';
          const s = document.createElement('span');
          s.className = 'cin';
          s.textContent = c;
          m.appendChild(s);
          frag.appendChild(m);
        });
      } else if (n.tagName === 'BR') {
        frag.appendChild(document.createElement('br'));
      } else {
        // em, span 등은 클래스 유지한 채 재귀
        const wrap = document.createElement(n.tagName.toLowerCase());
        wrap.className = n.className;
        const sub = document.createDocumentFragment();
        const prev = frag.childNodes.length;
        walk(n);
        while (frag.childNodes.length > prev) sub.appendChild(frag.childNodes[prev]);
        wrap.appendChild(sub);
        frag.appendChild(wrap);
      }
    });
  };
  walk(el);
  el.innerHTML = '';
  el.appendChild(frag);
}

/* ══════════ 2. REVEAL ══════════ */
function reveal() {
  const EASE = 'cubic-bezier(.16,1,.3,1)';
  const BACK = 'cubic-bezier(.34,1.56,.64,1)';

  $$('[data-anim]').forEach(el => {
    if (el.dataset.anim === 'chars') splitChars(el);
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, kind = el.dataset.anim;
      io.unobserve(el);

      if (REDUCED) { el.classList.add('is-in'); return; }

      if (kind === 'chars') {
        const step = +(el.dataset.step || 18);
        const wave = el.hasAttribute('data-wave');
        $$('.cin', el).forEach((c, i) => {
          c.animate([
            { transform:`translateY(110%) ${wave ? 'rotate(6deg)' : ''}`, opacity:0 },
            { transform:'translateY(0) rotate(0)', opacity:1 },
          ], { duration: wave ? 900 : 760, delay: i * step, easing: wave ? BACK : EASE, fill:'both' });
        });
        el.classList.add('is-in');

      } else if (kind === 'pop') {
        const sibs = [...el.parentElement.children].filter(n => n.dataset.anim === 'pop');
        const i = sibs.indexOf(el);
        el.animate([
          { opacity:0, transform:'translateY(44px) scale(.96)' },
          { opacity:1, transform:'translateY(0) scale(1)' },
        ], { duration:880, delay: clamp(i,0,8) * 90, easing: BACK, fill:'both' });
        el.classList.add('is-in');
        const b = $('[data-count]', el);
        if (b && !b.dataset.done) { b.dataset.done = '1'; setTimeout(() => count(b), 300); }

      } else if (kind === 'clip') {
        el.animate([
          { clipPath:'inset(0 0 100% 0)' },
          { clipPath:'inset(0 0 0% 0)' },
        ], { duration:1100, easing:EASE, fill:'both' });
        const img = $('img', el);
        img && img.animate([{ transform:'scale(1.3)' }, { transform:'scale(1)' }],
          { duration:1400, easing:EASE, fill:'both' });
        el.classList.add('is-in');

      } else {
        el.animate([{ opacity:0, transform:'translateY(18px)' }, { opacity:1, transform:'none' }],
          { duration:760, easing:EASE, fill:'both' });
        el.classList.add('is-in');
      }
    });
  }, { threshold:.14, rootMargin:'0px 0px -6% 0px' });

  $$('[data-anim]').forEach(el => io.observe(el));

  /* 섹션 구분선 그리기 */
  const lio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    lio.unobserve(e.target);
    e.target.animate([{ transform:'scaleX(0)' }, { transform:'scaleX(1)' }],
      { duration:1100, easing:EASE, fill:'both' });
  }), { threshold:.6 });
  $$('.sec-line').forEach(l => lio.observe(l));
}

function count(el) {
  const t = +el.dataset.count;
  if (!t) { el.textContent = '0'; return; }
  const d = 1500, t0 = performance.now();
  const step = now => {
    const p = Math.min((now - t0) / d, 1);
    el.textContent = Math.round(t * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ══════════ 3. SMOOTH SCROLL ══════════ */
function smooth() {
  const wrap = $('#swrap');
  if (!wrap || REDUCED || TOUCH) {
    document.body.style.height = 'auto';
    wrap && (wrap.style.position = 'static');
    return false;
  }
  const resize = () => {
    M.max = wrap.scrollHeight - innerHeight;
    document.body.style.height = wrap.scrollHeight + 'px';
  };
  resize();
  new ResizeObserver(resize).observe(wrap);
  addEventListener('resize', resize);
  return true;
}

/* ══════════ 4. RAF LOOP ══════════ */
function loop(useSmooth) {
  const wrap = $('#swrap'), hd = $('#hd'), bar = $('#progBar'),
        heroBg = $('#heroBg'), tickerRow = $('#tickerRow');
  const px = $$('[data-speed]');
  const secs = $$('[data-sec]');
  const hdSec = $('#hdSec');
  let lastSec = '';
  let tickerX = 0;

  const frame = () => {
    M.target = scrollY;
    const prev = M.y;
    M.y = useSmooth ? lerp(M.y, M.target, .095) : M.target;
    M.vel = M.y - prev;

    if (useSmooth) wrap.style.transform = `translate3d(0,${-M.y}px,0)`;

    /* 헤더 */
    hd.classList.toggle('is-stick', M.y > 60);

    /* 진행바 */
    if (bar) bar.style.transform = `scaleX(${clamp(M.y / (M.max || 1), 0, 1)})`;

    /* 히어로 패럴랙스 */
    if (heroBg && M.y < innerHeight) heroBg.style.transform = `translate3d(0,${M.y * .3}px,0) scale(1.06)`;

    /* 이미지 패럴랙스 + 속도 스트레치 */
    const stretch = 1 + clamp(Math.abs(M.vel) * .0016, 0, .07);
    px.forEach(img => {
      const r = img.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) return;
      const off = (r.top + r.height / 2 - innerHeight / 2) * +img.dataset.speed;
      img.style.transform = `translate3d(0,${off}px,0) scale(${1.12 * stretch})`;
    });

    /* 티커: 스크롤 속도 반영 */
    if (tickerRow) {
      tickerX -= .55 + M.vel * .06;
      const w = tickerRow.scrollWidth / 2;
      if (w) { if (tickerX <= -w) tickerX += w; if (tickerX > 0) tickerX -= w; }
      tickerRow.style.transform = `translate3d(${tickerX}px,0,0)`;
    }

    /* 섹션 인디케이터 — 기준선을 지나간 마지막 섹션을 선택(긴 섹션이 뒤를 가리지 않게) */
    const lineY = innerHeight * .4;
    let active = null;
    for (const s of secs) {
      if (s.getBoundingClientRect().top <= lineY) active = s;
    }
    if (active) {
      const label = active.dataset.sec;
      if (label !== lastSec && hdSec) {
        lastSec = label;
        hdSec.animate([{ opacity:0, transform:'translateY(6px)' }, { opacity:1, transform:'none' }],
          { duration:420, easing:'cubic-bezier(.16,1,.3,1)', fill:'both' });
        hdSec.textContent = label;
      }
    }

    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

/* ══════════ 5. MAGNETIC ══════════ */
function magnetic() {
  if (TOUCH || REDUCED) return;
  $$('[data-mag]').forEach(el => {
    let raf = null, tx = 0, ty = 0, cx = 0, cy = 0;
    const run = () => {
      cx = lerp(cx, tx, .18); cy = lerp(cy, ty, .18);
      el.style.transform = `translate(${cx}px,${cy}px)`;
      if (Math.abs(cx - tx) > .1 || Math.abs(cy - ty) > .1) raf = requestAnimationFrame(run);
      else { raf = null; el.style.transform = `translate(${tx}px,${ty}px)`; }
    };
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - r.left - r.width / 2) * .34;
      ty = (e.clientY - r.top - r.height / 2) * .34;
      if (!raf) raf = requestAnimationFrame(run);
    });
    el.addEventListener('mouseleave', () => {
      tx = ty = 0;
      if (!raf) raf = requestAnimationFrame(run);
    });
  });
}

/* ══════════ 6. CURTAIN NAV ══════════ */
function nav(useSmooth) {
  const curtain = $('#curtain');

  const goTo = y => {
    if (useSmooth) { scrollTo(0, y); }
    else scrollTo({ top:y, behavior:'instant' });
  };

  $$('[data-nav]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const id = href.slice(1);
      const t = id === 'top' ? null : document.getElementById(id);
      const y = t ? (t.getBoundingClientRect().top + M.y) : 0;

      if (REDUCED) { goTo(y); return; }

      curtain.classList.add('is-on');
      curtain.animate([
        { clipPath:'inset(0 0 100% 0)' },
        { clipPath:'inset(0 0 0% 0)' },
      ], { duration:620, easing:'cubic-bezier(.76,0,.24,1)', fill:'both' })
      .finished.then(() => {
        goTo(y);
        M.y = y;                                   // 스무스 점프
        const w = $('#swrap');
        if (useSmooth && w) w.style.transform = `translate3d(0,${-y}px,0)`;
        return curtain.animate([
          { clipPath:'inset(0 0 0% 0)' },
          { clipPath:'inset(100% 0 0 0)' },
        ], { duration:720, delay:90, easing:'cubic-bezier(.76,0,.24,1)', fill:'both' }).finished;
      })
      .then(() => curtain.classList.remove('is-on'));
    });
  });
}

/* ══════════ 7. CURSOR ══════════ */
function cursor() {
  const c = $('#cursor'), label = $('#cursorLabel');
  if (!c || TOUCH) { document.body.style.cursor = 'auto'; c && (c.style.display = 'none'); return; }
  let tx = 0, ty = 0, cx = 0, cy = 0;
  addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  (function run() {
    cx = lerp(cx, tx, .2); cy = lerp(cy, ty, .2);
    c.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(run);
  })();

  window.bindCursor = () => {
    $$('a,button,[data-c]').forEach(el => {
      if (el.dataset.cb) return;
      el.dataset.cb = '1';
      el.addEventListener('mouseenter', () => {
        c.classList.add('is-hover');
        const t = el.dataset.cur;
        if (t) { label.textContent = t; c.classList.add('is-label'); }
      });
      el.addEventListener('mouseleave', () => {
        c.classList.remove('is-hover', 'is-label');
        label.textContent = '';
      });
    });
  };
  window.bindCursor();
}

/* ══════════ INIT ══════════ */
function boot() {
  const useSmooth = smooth();
  cursor(); reveal(); magnetic(); nav(useSmooth); loop(useSmooth);
}

if (document.body.classList.contains('is-intro')) {
  addEventListener('intro:done', boot, { once:true });
  setTimeout(() => { if (!window.__booted) { window.__booted = 1; boot(); } }, 6000); // 안전망
} else {
  addEventListener('DOMContentLoaded', boot);
}
addEventListener('intro:done', () => { window.__booted = 1; }, { once:true });
})();
