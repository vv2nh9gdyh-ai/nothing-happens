/* ==========================================================
   NOTHING HAPPENS — intro.js
   NO  →  O 구멍에서 HAPPENS 압출  →  THING 삽입  →  로고 완성
   픽사 12원칙: anticipation / squash&stretch / overshoot / follow-through
   ========================================================== */
(() => {
'use strict';

const $ = s => document.querySelector(s);
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 스프링 이징 */
const E = {
  out   : 'cubic-bezier(.16,1,.3,1)',
  back  : 'cubic-bezier(.34,1.56,.64,1)',     // 오버슈트
  elastic:'cubic-bezier(.22,1.5,.36,1)',      // 강한 오버슈트
  in    : 'cubic-bezier(.7,0,.84,0)',
  soft  : 'cubic-bezier(.33,1,.68,1)',
};

/* 타임라인 (ms) */
const T = {
  nIn:120, oIn:260, letterDur:620,
  antic:900,  anticDur:440,
  emerge:1240, emergeDur:900,
  wobble:2040, wobbleDur:560,
  thing:1560, thingDur:720,
  slide:1560, slideDur:860,
  chrome:2600,
  cue:2500,
  curtain:3150, curtainDur:1000,
  end:4150,
};

function done() {
  document.body.classList.remove('is-intro');
  dispatchEvent(new CustomEvent('intro:done'));
}

function finish(intro) {
  intro.classList.add('is-gone');
  setTimeout(() => intro.remove(), 900);
  done();
}

function run(fontsOK) {
  const intro = $('#intro');
  if (!intro) { done(); return; }

  const word   = $('#word'),   noGrp  = $('#noGrp'),  thingGrp = $('#thingGrp');
  const chN    = $('#chN'),    chO    = $('#chO');
  const hapMask= $('#hapMask'),hap    = $('#hap');
  const ring   = $('#oRing'),  ring2  = $('#oRing2');
  const cue    = $('#introCue'), skip = $('#introSkip');

  /* 리듀스드 모션 or 폰트 미로드 → 즉시 완성형 (깨진 좌표로 움직이는 것보다 낫다) */
  if (REDUCED || fontsOK === false) {
    word.textContent = 'NOTHING HAPPENS';
    word.classList.add('is-chrome', 'is-flat');
    setTimeout(() => finish(intro), 900);
    return;
  }

  /* ── 1. 기하 측정: O 구멍(counter) 중심 + 최종 좌표 ───────── */
  const stage = word.getBoundingClientRect();
  const oBox  = chO.getBoundingClientRect();
  const hapBox= hap.getBoundingClientRect();
  const noBox = noGrp.getBoundingClientRect();

  const fs   = parseFloat(getComputedStyle(word).fontSize);
  const cap  = fs * 0.72;                               // 대문자 높이 근사
  const oCx  = oBox.left + oBox.width / 2 - stage.left; // O 중심 X (word 기준 — 링용)
  const oCy  = oBox.bottom - cap / 2 - stage.top;       // O 중심 Y (word 기준)
  const holeRx = oBox.width * 0.17;                     // 구멍 반지름
  const holeRy = cap * 0.26;

  /* clip-path는 요소 자기 보더박스 기준 — hapMask 로컬 좌표로 변환 */
  const mBox = hapMask.getBoundingClientRect();
  const mCx  = oBox.left + oBox.width / 2 - mBox.left;
  const mCy  = oBox.bottom - cap / 2 - mBox.top;

  /* HAPPENS: 최종위치 → O 구멍으로 되돌리는 델타 */
  const hapCx = hapBox.left + hapBox.width / 2 - stage.left;
  const dxHap = oCx - hapCx;
  const dyHap = oCy - (hapBox.top + hapBox.height / 2 - stage.top);

  /* NO: 초기엔 NO만 보이므로 화면 중앙으로 밀었다가 최종위치로 돌아온다 */
  const noW   = noBox.width;
  const fullW = stage.width;                            // word 전체 폭(공백 포함)
  const dxNO  = (fullW - noW) / 2;                      // 오른쪽으로 밀어 중앙정렬

  /* 링(파동) 위치 */
  [ring, ring2].forEach(r => {
    r.style.left = oCx + 'px';
    r.style.top  = oCy + 'px';
  });

  /* ── 2. 초기 상태 ───────────────────────────────────────── */
  noGrp.style.transform = `translateX(${dxNO}px)`;
  thingGrp.querySelectorAll('.ch').forEach(c => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(-72%) scaleY(.5)';
  });
  hapMask.style.clipPath = `ellipse(${holeRx}px ${holeRy}px at ${mCx}px ${mCy}px)`;
  hap.style.transform = `translate(${dxHap}px, ${dyHap}px) scale(.16, .5)`;
  hap.style.opacity = '0';   // 압출 전엔 완전히 숨긴다(마스크 밖 파편 방지)

  const A = [];
  const anim = (el, kf, opt) => { const a = el.animate(kf, { fill:'both', ...opt }); A.push(a); return a; };

  /* ── 3. N, O 등장 (스쿼시 착지) ─────────────────────────── */
  [[chN, T.nIn], [chO, T.oIn]].forEach(([el, delay]) => {
    anim(el, [
      { opacity:0, transform:'translateY(-120%) scale(.6,1.5)' },
      { opacity:1, transform:'translateY(8%)   scale(1.18,.78)', offset:.62 },
      { opacity:1, transform:'translateY(0)    scale(1,1)' },
    ], { duration:T.letterDur, delay, easing:E.back });
  });

  /* ── 4. O 앤티시페이션: 숨 들이쉬듯 눌렸다가 부푼다 ──────── */
  anim(chO, [
    { transform:'scale(1,1)' },
    { transform:'scale(1.14,.86)', offset:.42 },   // 눌림
    { transform:'scale(.92,1.12)' },               // 늘어남(압출 직전)
  ], { duration:T.anticDur, delay:T.antic, easing:E.soft });

  /* ── 5. HAPPENS 압출 : 구멍에서 짜여 나온다 ─────────────── */
  anim(hapMask, [
    { clipPath:`ellipse(${holeRx}px ${holeRy}px at ${mCx}px ${mCy}px)` },
    { clipPath:`ellipse(${holeRx*1.7}px ${holeRy*1.6}px at ${mCx}px ${mCy}px)`, offset:.2 },
    { clipPath:`ellipse(${stage.width*1.6}px ${cap*2.6}px at ${mCx}px ${mCy}px)` },
  ], { duration:T.emergeDur, delay:T.emerge, easing:E.out });

  /* fill:'both'는 딜레이 구간에도 첫 키프레임을 적용한다.
     따라서 첫 키프레임 자체를 opacity:0으로 두고 즉시 1로 올린다. */
  anim(hap, [
    { opacity:0, transform:`translate(${dxHap}px, ${dyHap}px) scale(.16,.5)`, offset:0 },
    { opacity:1, transform:`translate(${dxHap}px, ${dyHap}px) scale(.16,.5)`, offset:.001 },
    { opacity:1, transform:`translate(${dxHap*.52}px, ${dyHap*.5}px) scale(.52,1.22)`, offset:.34 }, // 짜여나오며 세로로 늘어남
    { opacity:1, transform:`translate(${dxHap*.12}px, ${dyHap*.1}px) scale(1.1,.9)`,  offset:.68 },  // 튜어나와 납짝
    { opacity:1, transform:'translate(0,0) scale(1,1)' },
  ], { duration:T.emergeDur, delay:T.emerge, easing:E.elastic });

  /* 파동 링 2개 */
  [[ring, T.emerge + 60], [ring2, T.emerge + 220]].forEach(([r, d]) => {
    anim(r, [
      { opacity:.55, transform:'translate(-50%,-50%) scale(.2)' },
      { opacity:0,   transform:'translate(-50%,-50%) scale(3.4)' },
    ], { duration:900, delay:d, easing:E.out });
  });

  /* ── 6. O 팔로우스루: 뱉어내고 흔들림 ───────────────────── */
  anim(chO, [
    { transform:'scale(.92,1.12)' },
    { transform:'scale(1.1,.9)',  offset:.3 },
    { transform:'scale(.97,1.03)',offset:.62 },
    { transform:'scale(1,1)' },
  ], { duration:T.wobbleDur, delay:T.wobble, easing:E.soft });

  /* ── 7. THING 삽입 + NO 좌측 복귀 (동시) ────────────────── */
  thingGrp.querySelectorAll('.ch').forEach((c, i) => {
    anim(c, [
      { opacity:0, transform:'translateY(-72%) scaleY(.5)' },
      { opacity:1, transform:'translateY(6%)  scaleY(1.14)', offset:.66 },
      { opacity:1, transform:'translateY(0)   scaleY(1)' },
    ], { duration:T.thingDur, delay:T.thing + i * 62, easing:E.back });
  });

  anim(noGrp, [
    { transform:`translateX(${dxNO}px)` },
    { transform:'translateX(0)' },
  ], { duration:T.slideDur, delay:T.slide, easing:E.elastic });

  /* ── 8. 크롬 전환 ─────────────────────────────
     분해된 글자(transform 가진 flex 자식) 위에 background-clip:text를
     걸면 렌더링이 깨진다. 완성 순간 단일 텍스트로 교체해서 원인 제거. */
  const settle = () => {
    if (word.dataset.settled) return;
    word.dataset.settled = '1';
    A.forEach(a => { try { a.cancel(); } catch(e){} });
    word.textContent = 'NOTHING HAPPENS';
    word.classList.add('is-chrome', 'is-flat');
  };
  setTimeout(settle, T.chrome);

  /* ── 9. 태그라인 ───────────────────────────────────────── */
  anim(cue, [
    { opacity:0, transform:'translateY(14px)' },
    { opacity:1, transform:'translateY(0)' },
  ], { duration:700, delay:T.cue, easing:E.out });

  /* ── 10. 커튼 업 : 워드마크는 느리게(패럴랙스) ──────────── */
  setTimeout(() => {
    word.animate([{ transform:'translateY(0)' }, { transform:'translateY(-26vh)' }],
      { duration:T.curtainDur, easing:E.in, fill:'both' });
    cue.animate([{ opacity:1 }, { opacity:0 }], { duration:360, fill:'both' });
    intro.animate([{ transform:'translateY(0)' }, { transform:'translateY(-100%)' }],
      { duration:T.curtainDur, easing:'cubic-bezier(.76,0,.24,1)', fill:'both' });
  }, T.curtain);

  const endT = setTimeout(() => finish(intro), T.end);

  /* 스킵 */
  const bail = () => {
    clearTimeout(endT);
    settle();
    intro.style.transition = 'transform .7s cubic-bezier(.76,0,.24,1)';
    intro.style.transform = 'translateY(-100%)';
    setTimeout(() => finish(intro), 700);
  };
  skip.addEventListener('click', bail);
  addEventListener('keydown', e => { if (e.key === 'Escape') bail(); }, { once:true });
  setTimeout(() => skip.classList.add('is-on'), 900);
}

/* 폰트 로드 후 측정해야 좌표가 정확하다.
   단, CDN이 죽어도 인트로가 영원히 안 끝나면 안 되므로 타임아웃 레이스. */
/* ───── 부트 ─────
   인트로는 글자 좌표를 실측해서 움직인다. 그래서 Archivo 900이 들어오기 전에
   측정하면 폴백 폰트 기준으로 계산되어 나중에 전부 틀어진다.
   → fonts.ready(전체 대기) 대신 해당 페이스만 콕어서 기다린다.
   → 그래도 안 오면 애니메이션 없이 완성형으로 끝낸다(깨진 모션 > 모션 없음). */
let started = false;
const start = (fontsOK) => {
  if (started) return;
  started = true;
  window.__introT0 = performance.now();
  window.__introFonts = !!fontsOK;
  requestAnimationFrame(() => run(fontsOK));
};

if (location.search.includes('pin=1')) {
  setTimeout(() => start(true), 300);          // 검증용 고정 시작
} else if (document.fonts && document.fonts.load) {
  const timeout = new Promise(r => setTimeout(() => r('timeout'), 2500));
  Promise.race([
    document.fonts.load('900 100px Archivo').then(f => f.length ? 'ok' : 'miss'),
    timeout,
  ]).then(res => start(res === 'ok')).catch(() => start(false));
} else {
  addEventListener('load', () => start(false));
  setTimeout(() => start(false), 1500);
}
})();
