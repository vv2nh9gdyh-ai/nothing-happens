/* ==========================================================
   NOTHING HAPPENS — main.js  (data / shop / nav)
   ========================================================== */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const pad = n => String(n).padStart(2, '0');

/* ───────── PRODUCTS ─────────
   tags = 소비자 비노출 태그. AI 큐레이션 엔진이 이걸로 매칭한다.
   장면/무드/체형보정/계절/시간대를 섞어서 넣는다. */
const PRODUCTS = [
  /* ★ 실상품 1호 — 상세페이지 보유 */
  { id:'cobalt-work-jacket',
    n:'코발트 워크 재킷', e:'Cobalt Work Jacket', p:128000, c:'outer', v:'VOL.01',
    img:'p-01', badge:'NEW', sizes:['1','2','3'], track:'TRACK 01',
    tags:['데일리','데이트','홍대','성수','연남','봄','가을','간절기','낮','밤',
          '시선강탈','포인트색상','생기도는','레이어드','오버사이즈','박시한',
          '어깨넓어보임','체형커버','필름카메라','사진잘나오는','워크웨어','프렌치','y2k'],
    detail:{
      sub:'BLEU DE TRAVAIL',
      lead:'1950년대 프랑스 작업복. 유니폼이었던 옷이 유니폼이 아니게 된 시간만큼.',
      body:'코발트 블루는 정복하기 어려운 색이다. 그래서 제일 빠르게 사람을 기억시킨다.<br>\n            검정·회색 투성이라면 이거 하나로 끝난다. 데님과의 궁합은 이미 50년간 검증됐다.',
      pts:[
        ['세 개의 패치 포켓','가슴 1 + 허리 2. 지갑·폰·담배 따로 넣고 빈손으로 나갈 수 있다.'],
        ['박시한 오버사이즈','어깨가 떨어지고 품이 넓다. 후드티·셔츠 레이어드 여유가 나온다.'],
        ['가미지 코튼 트윗','뚝뚝한 직조감. 입을수록 주름이 자리잡고 색이 바랜다.'],
        ['미술 시간 버튼','4개. 다 여믐도, 다 잠가도 성립하는 유일한 아움.'],
      ],
      spec:[['소재','면 100% 코튼 트윗 (가머진 가공)'],
            ['색상','코발트 블루'],
            ['핏','오버사이즈 / 유니섹스'],
            ['디테일','패치 포켓 3 · 버튼 4 · 커프스 버튼'],
            ['세택','찬물 단독 세택 · 표백제 금지 · 그늘 건조'],
            ['생산','대한민국']],
      size:{ head:['','어깨','가슴단면','총장','소매장'],
             rows:[['1','50','58','66','60'],['2','52','61','68','61'],['3','54','64','70','62']] },
      styling:'매장 추천은 바기 데님 + 톡 부츠. 상의가 세니까 하의는 무조건 죽이는 게 맞다.<br>\n               안에 줄무늬 셔츠를 받쳐 입으면 작업복이 아니라 옷이 된다.',
      gallery:[
        ['prod/cwj-01','착용 — 주간'],
        ['prod/cwj-02','정면'],
        ['prod/cwj-03','후면'],
        ['prod/cwj-04','측면'],
        ['prod/cwj-05','착용 — 야간'],
      ],
    } },
  { n:'워시드 메시 레이어드 탑', e:'Washed Mesh Layered Top',   p:68000,  c:'top',    v:'VOL.01', img:'p-02', badge:null,   sizes:['1','2'],
    tags:['클럽','헌팅','페스티벌','여름','봄','밤','섬세','슬림보임','레이어드','탈코리아','홈바디'] },
  { n:'로우라이즈 카고 팬츠',   e:'Lowrise Cargo Pants',       p:124000, c:'bottom', v:'VOL.01', img:'p-03', badge:'NEW',  sizes:['28','30','32'],
    tags:['데일리','대학생','캐주얼','홍대','성수','낙은허리','다리길어보임','편한','몸매커버','몸매추얰','사계절'] },
  { n:'디스트로이드 데님 재킷', e:'Distressed Denim Jacket',   p:178000, c:'outer',  v:'VOL.02', img:'p-04', badge:null,   sizes:['FREE'],
    tags:['데이트','캐주얼','낮','봄','가을','편하게','자연스러운','데일리','무난한','처음만나는','부담없는'] },
  { n:'베이비 로고 티',        e:'Baby Logo Tee',             p:52000,  c:'top',    v:'VOL.02', img:'p-05', badge:null,   sizes:['1','2','3'],
    tags:['데이트','데일리','캐주얼','여름','낮','크롭티','허리라인','써먹기좋은','무난한','처음만나는','저가'] },
  { n:'새틴 플레어 트라우저',   e:'Satin Flare Trouser',       p:138000, c:'bottom', v:'VOL.02', img:'p-06', badge:'SOLD', sizes:['28','30'],
    tags:['하객룩','결혼식','파티','데이트','밤','가을','겨울','고급스러운','드레시','키커보임','다리길어보임','튀는'] },
  { n:'메탈 버터플라이 넥피스', e:'Metal Butterfly Neckpiece', p:46000,  c:'acc',    v:'VOL.01', img:'p-07', badge:null,   sizes:['OS'],
    tags:['클럽','파티','헌팅','밤','포인트','써먹기좋은','저가','시선강탈','키치','y2k','세트마무리'] },
  { n:'프로스티드 삌더백',      e:'Frosted Shoulder Bag',      p:96000,  c:'acc',    v:'VOL.02', img:'p-08', badge:'NEW',  sizes:['OS'],
    tags:['데일리','데이트','캐주얼','사계절','포인트','무난한','가벼운','여행','매칭쉬운','데일리템'] },
];

const won = v => v.toLocaleString('ko-KR') + '원';

function renderShop(filter = 'all') {
  const grid = $('#shopGrid');
  if (!grid) return;
  const list = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.c === filter);

  grid.innerHTML = list.map(p => `
    <article class="pc" data-c data-cur="${p.detail ? 'VIEW' : (p.badge === 'SOLD' ? 'SOLD' : 'ADD')}"${p.id ? ` data-pid="${p.id}"` : ''}>
      <div class="pc-img">
        <img src="assets/img/${p.img}.jpg" alt="${p.e}" loading="lazy">
        ${p.badge ? `<span class="pc-badge ${p.badge === 'SOLD' ? 'sold' : ''}">${p.badge}</span>` : ''}
      </div>
      <div class="pc-body">
        <div class="pc-vol">${p.v}</div>
        <h3 class="pc-name">${p.n}</h3>
        <div class="pc-en">${p.e}</div>
        <div class="pc-price">${won(p.p)}</div>
        <div class="pc-sizes">${p.sizes.map(s => `<span>${s}</span>`).join('')}</div>
      </div>
    </article>`).join('');

  /* 카드 스태거 등장 */
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $$('.pc', grid).forEach((el, i) => {
      el.animate([
        { opacity:0, transform:'translateY(38px) scale(.97)' },
        { opacity:1, transform:'translateY(0) scale(1)' },
      ], { duration:820, delay:i * 70, easing:'cubic-bezier(.34,1.56,.64,1)', fill:'both' });
    });
  }
  /* 상세페이지 보유 상품 클릭 → PDP */
  $$('.pc[data-pid]', grid).forEach(card =>
    card.addEventListener('click', () => openPDP(card.dataset.pid)));

  window.bindCursor && window.bindCursor();
}

/* ───────── PRODUCT DETAIL ───────── */
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function buildPDP(p) {
  const d = p.detail;
  /* 세로사진 5장을 한 줄로 깔면 갤러리만 6800px다.
     착용컷 2장은 풀폭, 행거컷 3장은 3단 그리드로 압축한다. */
  const wear = d.gallery.filter(g => g[1].includes('착용'));
  const flat = d.gallery.filter(g => !g[1].includes('착용'));
  const shot = ([src, cap]) => `
    <figure class="pdp-shot">
      <img src="assets/img/${src}.jpg" alt="${esc(p.e)} — ${esc(cap)}" loading="lazy">
      <figcaption>${esc(cap)}</figcaption>
    </figure>`;

  return `
  <div class="pdp-top">
    <div class="pdp-gal">
      ${shot(wear[0])}
      <div class="pdp-flats">${flat.map(shot).join('')}</div>
      ${wear[1] ? shot(wear[1]) : ''}
    </div>

    <div class="pdp-info">
      <div class="pdp-track">${esc(p.v)} / ${esc(p.track)}</div>
      <h2 class="pdp-name">${esc(p.n)}</h2>
      <div class="pdp-en">${esc(p.e)}</div>
      <div class="pdp-sub">${esc(d.sub)}</div>
      <div class="pdp-price">${won(p.p)}</div>
      <p class="pdp-lead">${esc(d.lead)}</p>

      <div class="pdp-sizes">
        <div class="pdp-label">SIZE</div>
        <div class="pdp-sz" id="pdpSz">
          ${p.sizes.map((s, i) => `<button type="button" data-s="${esc(s)}"${i === 1 ? ' class="is-on"' : ''}>${esc(s)}</button>`).join('')}
        </div>
      </div>

      <button class="pdp-cart" id="pdpCart" type="button">ADD TO BAG</button>
      <p class="pdp-note" id="pdpNote" role="status" aria-live="polite"></p>
    </div>
  </div>

  <div class="pdp-body">
    <section class="pdp-sec">
      <div class="pdp-h"><i>01</i><h3>STORY</h3></div>
      <p class="pdp-story">${d.body}</p>
    </section>

    <section class="pdp-sec">
      <div class="pdp-h"><i>02</i><h3>DETAIL</h3></div>
      <div class="pdp-pts">
        ${d.pts.map(([t, x]) => `<div class="pdp-pt"><b>${esc(t)}</b><span>${esc(x)}</span></div>`).join('')}
      </div>
    </section>

    <section class="pdp-sec">
      <div class="pdp-h"><i>03</i><h3>SPEC &amp; SIZE</h3></div>
      <div class="pdp-split">
        <table class="pdp-tbl">
          <tbody>${d.spec.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</tbody>
        </table>
        <div>
          <table class="pdp-tbl">
            <thead><tr>${d.size.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>
            <tbody>${d.size.rows.map(r => `<tr>${r.map((c, i) => i === 0 ? `<td>${esc(c)}</td>` : `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
          </table>
          <p class="pdp-unit">단위 cm · 실측이므로 1~3cm 오차가 있습니다</p>
        </div>
      </div>
    </section>

    <section class="pdp-sec">
      <div class="pdp-h"><i>04</i><h3>STYLING</h3></div>
      <div class="pdp-styling">${d.styling}</div>
    </section>
  </div>`;
}

function openPDP(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const pdp = $('#pdp'), scroll = $('#pdpScroll');
  if (!p || !p.detail || !pdp) return;

  scroll.innerHTML = buildPDP(p);
  scroll.scrollTop = 0;
  pdp.classList.add('is-open');
  pdp.setAttribute('aria-hidden', 'false');
  document.body.classList.add('pdp-on');
  history.replaceState(null, '', '#product/' + id);

  /* 사이즈 선택 */
  $$('#pdpSz button').forEach(b => b.addEventListener('click', () => {
    $$('#pdpSz button').forEach(x => x.classList.remove('is-on'));
    b.classList.add('is-on');
  }));

  /* 장바구니 — 결제 미연결 */
  const cart = $('#pdpCart'), note = $('#pdpNote');
  cart && cart.addEventListener('click', () => {
    const sz = $('#pdpSz .is-on');
    note.innerHTML = `SIZE <b>${sz ? esc(sz.dataset.s) : '-'}</b> 선택됨 — 결제는 준비중입니다.`;
  });

  window.bindCursor && window.bindCursor();
}

function closePDP() {
  const pdp = $('#pdp');
  if (!pdp || !pdp.classList.contains('is-open')) return;
  pdp.classList.remove('is-open');
  pdp.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('pdp-on');
  history.replaceState(null, '', location.pathname);
}

function pdpInit() {
  $('#pdpClose') && $('#pdpClose').addEventListener('click', closePDP);
  addEventListener('keydown', e => { if (e.key === 'Escape') closePDP(); });
  /* 딥링크 */
  const m = location.hash.match(/^#product\/(.+)$/);
  if (m) setTimeout(() => openPDP(m[1]), 400);
}

/* ───────── CLOCK ───────── */
function clocks() {
  const ft = $('#ftClock'), hd = $('#heroDate');
  const M = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const run = () => {
    const d = new Date();
    if (ft) ft.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    if (hd) hd.textContent = `${pad(d.getDate())} ${M[d.getMonth()]} ${d.getFullYear()}`;
  };
  run(); setInterval(run, 1000);
}

/* ───────── TICKER ───────── */
function ticker() {
  const row = $('#tickerRow');
  if (!row) return;
  const items = ['NOTHING HAPPENS','VOL.01 FALSE ALARM — OUT NOW','UNISEX / FREE SIZE',
                 'SEOUL 37.5665°N','NO REPRESS','EST. 2000','WORLDWIDE SHIPPING'];
  const html = items.map(t => `<span>${t}</span>`).join('');
  row.innerHTML = html + html;
}

/* ───────── FILTER / NAV ───────── */
function filters() {
  $$('.f-btn').forEach(btn => btn.addEventListener('click', () => {
    if (btn.classList.contains('is-on')) return;
    $$('.f-btn').forEach(x => x.classList.remove('is-on'));
    btn.classList.add('is-on');
    const grid = $('#shopGrid');
    $$('.pc', grid).forEach((el, i) => {
      el.animate([{ opacity:1, transform:'none' }, { opacity:0, transform:'translateY(-20px) scale(.98)' }],
        { duration:300, delay:i * 25, easing:'cubic-bezier(.7,0,.84,0)', fill:'both' });
    });
    setTimeout(() => renderShop(btn.dataset.f), 240);
  }));
}

function burger() {
  const b = $('#burger'), m = $('#mnav');
  if (!b) return;
  b.addEventListener('click', () => {
    const open = !m.classList.contains('is-open');
    b.classList.toggle('is-on', open);
    m.classList.toggle('is-open', open);
    if (open) {
      $$('.mnav a').forEach((a, i) => a.animate(
        [{ opacity:0, transform:'translateY(44px)' }, { opacity:1, transform:'none' }],
        { duration:700, delay:90 + i * 70, easing:'cubic-bezier(.34,1.56,.64,1)', fill:'both' }));
    }
  });
  $$('.mnav a').forEach(a => a.addEventListener('click', () => {
    b.classList.remove('is-on'); m.classList.remove('is-open');
  }));
}

/* ───────── ASK (목업) ─────────
   TODO: 엔진 연결 시 질문 → PRODUCTS[].tags 매칭 → 결과 그리드 렌더.
   지금은 입력/로딩까지만 진짜고 결과는 준비중 안내. */
const ASK_SAMPLES = [
  '홍대 가서 헌팅할 때 입을 옷',
  '여자친구랑 첫 데이트룩',
  '밤새 놀아도 안 구겨지는 옷',
  '친구 결혼식인데 튀고 싶어',
  '다리 길어 보이는 바지',
];

function typePlaceholder() {
  const box = $('#askPh'), out = $('#askPhText'), input = $('#askInput');
  if (!box || !out) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    out.textContent = ASK_SAMPLES[0];
    return;
  }

  let si = 0, ci = 0, dir = 1;
  const tick = () => {
    if (input.value) { box.classList.add('is-off'); setTimeout(tick, 400); return; }
    box.classList.remove('is-off');

    const s = ASK_SAMPLES[si];
    ci += dir;
    out.textContent = s.slice(0, ci);

    let wait = dir > 0 ? 62 : 28;
    if (dir > 0 && ci >= s.length) { dir = -1; wait = 1900; }
    else if (dir < 0 && ci <= 0) { dir = 1; si = (si + 1) % ASK_SAMPLES.length; wait = 320; }
    setTimeout(tick, wait);
  };
  tick();
}

function ask() {
  const form = $('#askForm'), input = $('#askInput'),
        note = $('#askNote'), go = $('#askGo'), ph = $('#askPh');
  if (!form) return;

  input.addEventListener('input', () => ph.classList.toggle('is-off', !!input.value));

  /* 커스텀 커서가 타이핑을 방해하지 않게 */
  const cur = $('#cursor');
  if (cur) {
    input.addEventListener('mouseenter', () => cur.style.opacity = '0');
    input.addEventListener('mouseleave', () => cur.style.opacity = '');
  }

  $$('.chip').forEach(c => c.addEventListener('click', () => {
    input.value = c.dataset.q;
    ph.classList.add('is-off');
    input.focus();
    form.requestSubmit();
  }));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) { input.focus(); return; }

    go.classList.add('is-busy');
    go.textContent = '···';
    note.textContent = '스타일을 찾는 중…';

    setTimeout(() => {
      go.classList.remove('is-busy');
      go.textContent = '→';
      note.innerHTML = '큐레이션 엔진은 <b>VOL.03</b> 공개 시 열립니다 — 그때까지는 아무 일도 일어나지 않습니다.';
    }, 1250);
  });
}

/* ───────── INIT ───────── */
function boot() { renderShop(); filters(); burger(); clocks(); ticker(); typePlaceholder(); ask(); pdpInit(); }

if (document.readyState === 'loading') addEventListener('DOMContentLoaded', boot);
else boot();
})();
