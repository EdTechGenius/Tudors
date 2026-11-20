// Special activities used in Chapters 2–4, so that each chapter plays differently.
// Every activity opens its own panel and resolves with a result object:
//   { score, max, summary, writing? }   (score/max are left out when there is no right answer)
// `api` is passed in from main.js and gives access to the shared helpers.

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const tap = (el) => new Promise((r) => { el.onclick = () => r(); });

// ---------------- The King's mood ----------------
export const MOODS = [
  { min: 75, key: 'delighted', label: 'Delighted', emoji: '😄' },
  { min: 55, key: 'pleased', label: 'Pleased', emoji: '🙂' },
  { min: 35, key: 'cross', label: 'Cross', emoji: '😠' },
  { min: -999, key: 'furious', label: 'Furious', emoji: '😡' },
];
export const moodOf = (v) => MOODS.find((m) => v >= m.min);
export function moodFaceHTML(src, v, cls = '') {
  const m = moodOf(v);
  return `<div class="mood-face mood-${m.key} ${cls}"><img src="${src}" alt="King Henry"><span class="mood-emoji">${m.emoji}</span></div>`;
}

// ---------------- 1. The conscience scale (dilemmas with no single right answer) ----------------
function scaleSVG() {
  return `<svg class="scale" viewBox="0 0 260 190" aria-hidden="true">
    <rect x="95" y="170" width="70" height="12" rx="4" fill="#6b4a22"/>
    <rect x="125" y="40" width="10" height="132" fill="#8a6430"/>
    <circle cx="130" cy="40" r="9" fill="#d9ab3c"/>
    <line class="beam" x1="40" y1="40" x2="220" y2="40" stroke="#5a3a18" stroke-width="7" stroke-linecap="round"/>
    <g class="pan pan-l"><line x1="0" y1="0" x2="-26" y2="56" stroke="#8a6430" stroke-width="2"/><line x1="0" y1="0" x2="26" y2="56" stroke="#8a6430" stroke-width="2"/>
      <path d="M-34 56 Q0 80 34 56 Z" fill="#d9ab3c" stroke="#8a6430" stroke-width="2"/><text x="0" y="52" text-anchor="middle" font-size="22">👑</text></g>
    <g class="pan pan-r"><line x1="0" y1="0" x2="-26" y2="56" stroke="#8a6430" stroke-width="2"/><line x1="0" y1="0" x2="26" y2="56" stroke="#8a6430" stroke-width="2"/>
      <path d="M-34 56 Q0 80 34 56 Z" fill="#d9ab3c" stroke="#8a6430" stroke-width="2"/><text x="0" y="52" text-anchor="middle" font-size="22">✝️</text></g>
  </svg>
  <div class="scale-labels"><span>👑 Loyalty to the King <b class="v-l"></b></span><span>✝️ Conscience <b class="v-r"></b></span></div>`;
}
function setScale(root, loyalty, conscience) {
  const a = (clamp((conscience - loyalty) * 0.55, -24, 24) * Math.PI) / 180;
  const cx = 130, cy = 40, L = 90;
  const lx = cx - L * Math.cos(a), ly = cy - L * Math.sin(a), rx = cx + L * Math.cos(a), ry = cy + L * Math.sin(a);
  const beam = root.querySelector('.beam');
  beam.setAttribute('x1', lx); beam.setAttribute('y1', ly); beam.setAttribute('x2', rx); beam.setAttribute('y2', ry);
  root.querySelector('.pan-l').setAttribute('transform', `translate(${lx} ${ly})`);
  root.querySelector('.pan-r').setAttribute('transform', `translate(${rx} ${ry})`);
  root.querySelector('.v-l').textContent = Math.round(loyalty);
  root.querySelector('.v-r').textContent = Math.round(conscience);
}
function leanText(loyalty, conscience) {
  const d = conscience - loyalty;
  if (d > 12) return 'towards your <b>conscience</b>';
  if (d < -12) return 'towards <b>loyalty to the King</b>';
  return 'almost <b>level</b>: you tried to balance both';
}

export async function conscience(api, cfg) {
  const { esc } = api;
  const picks = [];
  for (let i = 0; i < cfg.dilemmas.length; i++) {
    const d = cfg.dilemmas[i];
    const p = api.openPanel(`
      <div class="kicker">⚖️ ${esc(cfg.title)} · Choice ${i + 1} of ${cfg.dilemmas.length}</div>
      <div class="card-head"><span class="year">${esc(d.year)}</span><h2>${esc(d.title)}</h2>${api.speakBtn('.dl-text')}</div>
      <div class="two-col">
        <div class="col-a">${d.img ? api.figure(d.img) : ''}<div class="scale-box">${scaleSVG()}</div></div>
        <div class="col-b"><div class="dl-text card-text">${d.text}</div>
          <h3>What will you do?</h3>
          <div class="opts">${d.choices.map((c, k) => `<button class="btn choice" data-k="${k}">${esc(c.t)}</button>`).join('')}</div>
          <div class="feedback"></div></div>
      </div>`, 'wide activity');
    api.glossify(p.querySelector('.dl-text'));
    api.autoSpeak(d.title + '. ' + d.text);
    let m = api.meters();
    setScale(p, m.favour, m.honesty);
    const k = await new Promise((r) => p.querySelectorAll('[data-k]').forEach((b) => { b.onclick = () => r(+b.dataset.k); }));
    const c = d.choices[k];
    p.querySelectorAll('[data-k]').forEach((b) => { b.disabled = true; if (+b.dataset.k === k) b.classList.add('picked'); });
    api.applyFx({ favour: c.loyalty || 0, honesty: c.conscience || 0 });
    m = api.meters();
    setScale(p, m.favour, m.honesty);
    picks.push(`${d.year} ${d.title}: "${c.t}"`);
    const fb = p.querySelector('.feedback');
    fb.innerHTML = `<p class="result">${c.result}</p>
      <div class="real"><b>📜 What the real Thomas More did:</b> ${d.real}</div>
      <div class="row"><span class="small muted">There is no single right answer. Think about why you chose it.</span><button class="btn primary" id="next">${i < cfg.dilemmas.length - 1 ? 'Next choice ▶' : 'Continue ▶'}</button></div>`;
    api.glossify(fb);
    api.autoSpeak(api.strip(c.result) + ' What the real Thomas More did: ' + api.strip(d.real));
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    await tap(fb.querySelector('#next'));
    api.closePanel();
  }
  const m = api.meters();
  const lean = leanText(m.favour, m.honesty);
  const p = api.openPanel(`
    <div class="kicker">⚖️ ${esc(cfg.title)}</div><h2>Your scale</h2>
    <div class="two-col"><div class="col-a"><div class="scale-box">${scaleSVG()}</div></div>
    <div class="col-b"><p class="card-text">By the end, your scale had tipped ${lean}.</p>
      <p>${cfg.ending}</p></div></div>
    <div class="row"><span></span><button class="btn primary" id="next">Continue ▶</button></div>`, 'wide activity');
  setScale(p, m.favour, m.honesty);
  await tap(p.querySelector('#next'));
  api.closePanel();
  return { summary: `Scale tipped ${api.strip(lean)}. ${picks.join(' · ')}` };
}

// ---------------- 2. The interrogation (answer without saying "yes" or "no") ----------------
export async function interrogation(api, cfg) {
  const { esc } = api;
  let careful = 0, traps = 0, gaveIn = 0;
  const intro = api.openPanel(`
    <div class="kicker">🗝️ ${esc(cfg.title)}</div>
    <div class="banner-pic">${api.figure(cfg.img)}</div>
    <div class="card-head"><h2>${esc(cfg.heading)}</h2>${api.speakBtn('.card-text')}</div>
    <div class="card-text">${cfg.intro}</div>
    <div class="rules">
      <div class="rule bad">❌ Say <b>"YES"</b> and you go against your conscience.</div>
      <div class="rule bad">⚠️ Say <b>"NO"</b> and it is <b>treason</b>, punished by death!</div>
      <div class="rule good">✅ Find a <b>careful answer</b> that says neither.</div>
    </div>
    <div class="row"><span></span><button class="btn primary" id="next">Begin ▶</button></div>`, 'wide activity');
  api.glossify(intro.querySelector('.card-text'));
  api.autoSpeak(cfg.intro);
  await tap(intro.querySelector('#next'));
  api.closePanel();
  for (let i = 0; i < cfg.questions.length; i++) {
    const q = cfg.questions[i];
    const order = api.shuffle(q.options.map((_, k) => k));
    const p = api.openPanel(`
      <div class="kicker">🗝️ ${esc(cfg.title)} · Question ${i + 1} of ${cfg.questions.length}</div>
      <div class="asker"><img src="${q.photo ? api.imgURL(q.photo) : api.portraitURL(q.look, 'ask' + i)}" alt=""><div><div class="dname">${esc(q.who)}</div><div class="card-text q">"${esc(q.q)}"</div></div>${api.speakBtn('.q')}</div>
      <div class="opts">${order.map((k, pos) => `<button class="btn choice" data-k="${k}"><b class="letter">${'ABC'[pos]}</b> ${esc(q.options[k].t)}</button>`).join('')}</div>
      <div class="feedback"></div>`, 'wide activity');
    api.autoSpeak(q.who + ' says: ' + q.q);
    const k = await new Promise((r) => p.querySelectorAll('[data-k]').forEach((b) => { b.onclick = () => r(+b.dataset.k); }));
    const o = q.options[k];
    p.querySelectorAll('[data-k]').forEach((b) => {
      b.disabled = true;
      const kind = q.options[+b.dataset.k].kind;
      if (kind === 'careful') b.classList.add('right'); else if (+b.dataset.k === k) b.classList.add('wrong');
    });
    if (o.kind === 'careful') careful++; else if (o.kind === 'no') traps++; else gaveIn++;
    const head = o.kind === 'careful' ? '<p class="good">✅ A careful answer! You said neither yes nor no.</p>'
      : o.kind === 'no' ? '<p class="bad trap">⚠️ TRAP! You said "no". That is treason!</p>'
        : '<p class="bad">😟 You said "yes" and went against your conscience.</p>';
    const fb = p.querySelector('.feedback');
    fb.innerHTML = `${head}<p>${esc(o.why)}</p>
      <div class="row"><span>Careful answers: ${careful} of ${i + 1}</span><button class="btn primary" id="next">${i < cfg.questions.length - 1 ? 'Next question ▶' : 'Continue ▶'}</button></div>`;
    if (o.kind === 'no') p.classList.add('shake');
    api.autoSpeak(api.strip(head) + ' ' + o.why);
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    await tap(fb.querySelector('#next'));
    api.closePanel();
  }
  const end = api.openPanel(`
    <div class="kicker">🗝️ ${esc(cfg.title)}</div>
    <h2>${careful === cfg.questions.length ? '🗝️ You never fell into a trap!' : `You gave ${careful} careful answer${careful === 1 ? '' : 's'} out of ${cfg.questions.length}`}</h2>
    <div class="card-text">${cfg.after}</div>
    <div class="row"><span></span><button class="btn primary" id="next">Continue ▶</button></div>`, 'card activity');
  api.glossify(end.querySelector('.card-text'));
  api.autoSpeak(cfg.after);
  await tap(end.querySelector('#next'));
  api.closePanel();
  return { score: careful, max: cfg.questions.length, summary: `${careful} careful answers, ${traps} treason trap${traps === 1 ? '' : 's'}, gave in ${gaveIn} time${gaveIn === 1 ? '' : 's'}` };
}

// ---------------- 3. The cipher wheel ----------------
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const shiftLetter = (ch, n) => { const i = ABC.indexOf(ch); return i < 0 ? ch : ABC[(i + n + 26 * 4) % 26]; };
const encode = (t, n) => [...t.toUpperCase()].map((c) => shiftLetter(c, n)).join('');

function wheelSVG() {
  const R1 = 118, R2 = 86, step = 360 / 26;
  const ring = (r, cls, size) => [...ABC].map((c, i) => {
    const a = ((i * step - 90) * Math.PI) / 180;
    return `<text class="${cls}" x="${150 + r * Math.cos(a)}" y="${150 + r * Math.sin(a)}" font-size="${size}" text-anchor="middle" dominant-baseline="central" transform="rotate(${i * step} ${150 + r * Math.cos(a)} ${150 + r * Math.sin(a)})">${c}</text>`;
  }).join('');
  return `<svg class="wheel" viewBox="0 0 300 300" aria-label="Cipher wheel">
    <circle cx="150" cy="150" r="140" fill="#f3e4bd" stroke="#8a6430" stroke-width="4"/>
    <circle cx="150" cy="150" r="102" fill="none" stroke="#8a6430" stroke-width="2"/>
    ${ring(R1, 'outer', 20)}
    <g class="inner-ring"><circle cx="150" cy="150" r="100" fill="#7b1d1d"/>${ring(R2, 'inner', 18)}<circle cx="150" cy="150" r="58" fill="#5a1414"/>
      <text x="150" y="150" fill="#f4d77a" font-size="30" text-anchor="middle" dominant-baseline="central">✠</text></g>
    <path d="M150 4 L142 -8 L158 -8 Z" fill="#c0141c" transform="translate(0 10)"/>
  </svg>`;
}

export async function cipher(api, cfg) {
  const { esc } = api;
  const secret = encode(cfg.message, cfg.shift);
  let w = 0, wrong = 0;
  const p = api.openPanel(`
    <div class="kicker">🔐 ${esc(cfg.title)}</div>
    <div class="card-head"><h2>${esc(cfg.heading)}</h2>${api.speakBtn('.cipher-intro')}</div>
    <div class="cipher-intro card-text">${cfg.intro}</div>
    <p class="secret">${esc(secret)}</p>
    <div class="two-col">
      <div class="col-a wheel-box">${wheelSVG()}
        <div class="row center"><button class="btn" id="left">◀ Turn</button><button class="btn" id="right">Turn ▶</button></div></div>
      <div class="col-b">
        <h3>Step 1: Set the wheel</h3>
        <p>${cfg.clue}</p>
        <p class="wheel-status small">Turn the red inner wheel.</p>
        <h3>Step 2: Read the first word</h3>
        <p class="small">To decode a letter, find it on the <b>red inner wheel</b>, then read the letter just outside it.</p>
        <p>The first word in code is <b class="code">${esc(secret.split(' ')[0])}</b>. What does it say?</p>
        <div class="row"><input id="word" maxlength="20" autocomplete="off" autocapitalize="characters" placeholder="Type the word"><button class="btn primary" id="check">Check ✔</button></div>
        <div class="feedback"></div>
      </div>
    </div>`, 'wide activity');
  api.autoSpeak(cfg.intro);
  const inner = p.querySelector('.inner-ring');
  const status = p.querySelector('.wheel-status');
  const turn = () => {
    inner.style.transform = `rotate(${-w * (360 / 26)}deg)`;
    const set = ((w % 26) + 26) % 26 === cfg.shift;
    status.innerHTML = set ? '✅ <b>The wheel is set!</b> Now decode the first word.' : `On the outside, A sits above <b>${ABC[((w % 26) + 26) % 26]}</b> on the inside.`;
    status.classList.toggle('good', set);
  };
  p.querySelector('#left').onclick = () => { w--; turn(); };
  p.querySelector('#right').onclick = () => { w++; turn(); };
  turn();
  const first = cfg.message.split(' ')[0].toUpperCase();
  await new Promise((resolve) => {
    const check = () => {
      const v = p.querySelector('#word').value.trim().toUpperCase();
      const fb = p.querySelector('.feedback');
      if (v === first) { resolve(); return; }
      wrong++;
      const hint = wrong === 1 ? cfg.hint1 : wrong === 2 ? `Hint: the first letter is <b>${first[0]}</b>.` : `The first word is <b>${first}</b>. Type it in to carry on.`;
      fb.innerHTML = `<p class="bad">❌ Not quite. ${hint}</p>`;
    };
    p.querySelector('#check').onclick = check;
    p.querySelector('#word').onkeydown = (e) => { if (e.key === 'Enter') check(); };
  });
  const solved = wrong < 3;
  api.closePanel();
  const q = cfg.question;
  const order = api.shuffle(q.options.map((_, k) => k));
  const p2 = api.openPanel(`
    <div class="kicker">🔐 ${esc(cfg.title)}</div>
    <h2>🔓 Code cracked!</h2>
    <p class="secret">${esc(secret)}</p>
    <p class="decoded">${esc(cfg.message)}</p>
    <div class="card-text">${cfg.meaning}</div>
    <div class="question"><h3>🕵️ ${esc(q.q)}</h3>
      <div class="opts">${order.map((k, pos) => `<button class="btn choice" data-k="${k}"><b class="letter">${'ABCD'[pos]}</b> ${esc(q.options[k].t)}</button>`).join('')}</div>
      <div class="feedback"></div></div>`, 'card activity');
  api.glossify(p2.querySelector('.card-text'));
  api.autoSpeak(cfg.message + '. ' + cfg.meaning);
  const k = await new Promise((r) => p2.querySelectorAll('[data-k]').forEach((b) => { b.onclick = () => r(+b.dataset.k); }));
  const o = q.options[k];
  p2.querySelectorAll('[data-k]').forEach((b) => { b.disabled = true; if (q.options[+b.dataset.k].ok) b.classList.add('right'); else if (+b.dataset.k === k) b.classList.add('wrong'); });
  const fb = p2.querySelector('.feedback');
  fb.innerHTML = `<p class="${o.ok ? 'good' : 'bad'}">${o.ok ? '✅ Correct!' : '❌ Not quite.'} ${esc(o.why)}</p><div class="row"><span></span><button class="btn primary" id="next">Continue ▶</button></div>`;
  await tap(fb.querySelector('#next'));
  api.closePanel();
  const score = (solved ? 1 : 0) + (o.ok ? 1 : 0);
  return { score, max: 2, summary: `${solved ? 'Cracked the code' : 'Needed help to crack the code'}${wrong ? ` (${wrong} wrong guess${wrong === 1 ? '' : 'es'})` : ' first time'}; question ${o.ok ? 'correct' : 'incorrect'}` };
}

// ---------------- 4. Free writing with the quill ----------------
export async function freewrite(api, cfg) {
  const { esc } = api;
  const p = api.openPanel(`
    <div class="kicker">✒️ ${esc(cfg.kicker)}</div>
    <div class="card-head"><h2>${esc(cfg.title)}</h2>${api.speakBtn('.fw-text')}</div>
    <div class="two-col">
      <div class="col-a">${cfg.img ? api.figure(cfg.img) : ''}<div class="fw-text card-text">${cfg.text}</div>
        ${cfg.starters ? `<div class="starters"><b>Sentence starters:</b><ul>${cfg.starters.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>` : ''}</div>
      <div class="col-b"><div id="fwpad"></div>
        <label class="small typed-toggle"><input type="checkbox" id="typeans"> I would rather type</label>
        <textarea id="typedans" rows="6" placeholder="Type here" hidden></textarea></div>
    </div>
    <div class="row"><span class="small muted">Your writing will appear in your Royal Report for your teacher.</span><button class="btn primary" id="done" disabled>${esc(cfg.button || 'Finished ✔')}</button></div>`, 'wide activity quill-panel');
  api.glossify(p.querySelector('.fw-text'));
  api.autoSpeak(cfg.text);
  const typed = p.querySelector('#typedans');
  const chk = () => { p.querySelector('#done').disabled = p.querySelector('#typeans').checked ? typed.value.trim().length < 3 : pad.isEmpty(); };
  const pad = api.createQuillPad(p.querySelector('#fwpad'), { height: cfg.height || 300, lines: true, placeholder: cfg.placeholder || 'Write here…', ink: cfg.ink, onChange: chk });
  p.querySelector('#typeans').onchange = () => { const t = p.querySelector('#typeans').checked; typed.hidden = !t; p.querySelector('#fwpad').hidden = t; chk(); };
  typed.oninput = chk;
  await tap(p.querySelector('#done'));
  const writing = p.querySelector('#typeans').checked ? { title: cfg.title, text: typed.value.trim() } : { title: cfg.title, img: pad.toDataURL(600) };
  api.closePanel();
  return { summary: 'Written ✔', writing };
}

// ---------------- 5. Royal matchmaking ----------------
export async function matchmaker(api, cfg) {
  const { esc } = api;
  const C = cfg.candidates;
  const rate = {};
  const pic = (c) => (c.img ? `<img src="${api.imgURL(c.img)}" alt="">` : `<img src="${api.portraitURL(c.look, 'cand' + c.id)}" alt="">`);
  const p = api.openPanel(`
    <div class="kicker">💍 ${esc(cfg.title)} · Step 1 of 2</div>
    <div class="card-head"><h2>${esc(cfg.heading)}</h2>${api.speakBtn('.mm-intro')}</div>
    <div class="mm-intro card-text">${cfg.intro}</div>
    <div class="cands">${C.map((c) => `
      <div class="cand" data-c="${c.id}">
        <div class="cand-top">${pic(c)}<div><b>${esc(c.name)}</b><div class="small">${esc(c.who)}</div></div></div>
        <ul class="small">${c.facts.map((f) => `<li>${f}</li>`).join('')}</ul>
        <div class="henry-wants small">👑 <b>What Henry hears:</b> ${esc(c.henry)}</div>
        <div class="rate"><span class="small"><b>Good for England's safety?</b></span>
          <div class="yn"><button class="btn" data-r="${c.id}" data-v="1">✅ Yes</button><button class="btn" data-r="${c.id}" data-v="0">❌ No</button></div></div>
        <div class="verdict small" hidden></div>
      </div>`).join('')}</div>
    <div class="row"><span class="small muted">Remember: England needs a strong ally against the Emperor, and a bride who is free to marry.</span><button class="btn primary" id="check" disabled>Check my ratings ✔</button></div>`, 'wide activity');
  api.glossify(p.querySelector('.mm-intro'));
  api.autoSpeak(cfg.intro);
  p.querySelectorAll('[data-r]').forEach((b) => {
    b.onclick = () => {
      rate[b.dataset.r] = b.dataset.v === '1';
      p.querySelectorAll(`[data-r="${b.dataset.r}"]`).forEach((x) => x.classList.toggle('picked', x === b));
      p.querySelector('#check').disabled = Object.keys(rate).length < C.length;
    };
  });
  await tap(p.querySelector('#check'));
  let ratings = 0;
  for (const c of C) {
    const ok = rate[c.id] === c.england;
    if (ok) ratings++;
    const card = p.querySelector(`[data-c="${c.id}"]`);
    card.classList.add(ok ? 'ok' : 'no');
    card.querySelectorAll('[data-r]').forEach((b) => { b.disabled = true; });
    const v = card.querySelector('.verdict');
    v.hidden = false;
    v.innerHTML = `${ok ? '✅' : '❌'} ${c.verdict}`;
  }
  const row = p.querySelector('#check').parentElement;
  row.innerHTML = `<span><b>You rated ${ratings} of ${C.length} correctly.</b></span><button class="btn primary" id="next">Choose the bride ▶</button>`;
  await tap(row.querySelector('#next'));
  api.closePanel();
  // Step 2: choose
  let pick = null, reason = null;
  const p2 = api.openPanel(`
    <div class="kicker">💍 ${esc(cfg.title)} · Step 2 of 2</div>
    <h2>Who will you recommend to the King?</h2>
    <div class="cands pickable">${C.map((c) => `<button class="cand mini" data-p="${c.id}">${pic(c)}<b>${esc(c.name)}</b></button>`).join('')}</div>
    <h3>Why?</h3>
    <div class="opts">${api.shuffle(cfg.reasons.map((_, k) => k)).map((k) => `<button class="btn choice" data-why="${k}">${esc(cfg.reasons[k].t)}</button>`).join('')}</div>
    <div class="feedback"></div>
    <div class="row"><span></span><button class="btn primary" id="go" disabled>💍 Recommend her</button></div>`, 'wide activity');
  const upd = () => {
    p2.querySelectorAll('[data-p]').forEach((b) => b.classList.toggle('picked', b.dataset.p === pick));
    p2.querySelectorAll('[data-why]').forEach((b) => b.classList.toggle('picked', +b.dataset.why === reason));
    p2.querySelector('#go').disabled = pick === null || reason === null;
  };
  p2.querySelectorAll('[data-p]').forEach((b) => { b.onclick = () => { pick = b.dataset.p; upd(); }; });
  p2.querySelectorAll('[data-why]').forEach((b) => { b.onclick = () => { reason = +b.dataset.why; upd(); }; });
  await tap(p2.querySelector('#go'));
  const cand = C.find((c) => c.id === pick);
  const r = cfg.reasons[reason];
  const choiceScore = cand.pick;
  p2.querySelectorAll('button').forEach((b) => { b.disabled = true; });
  const fb = p2.querySelector('.feedback');
  fb.innerHTML = `<p class="${choiceScore === 2 ? 'good' : 'bad'}">${choiceScore === 2 ? '✅' : choiceScore === 1 ? '🤔' : '❌'} ${cand.pickWhy}</p>
    <p class="${r.ok ? 'good' : 'bad'}">${r.ok ? '✅' : '❌'} ${esc(r.why)}</p>
    ${choiceScore === 2 ? '' : `<p class="real">📜 ${cfg.real}</p>`}`;
  fb.insertAdjacentHTML('beforeend', '<div class="row"><span></span><button class="btn primary" id="next">Continue ▶</button></div>');
  api.autoSpeak(api.strip(fb.innerHTML));
  fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  await tap(fb.querySelector('#next'));
  api.closePanel();
  const score = ratings + choiceScore + (r.ok ? 1 : 0);
  return { score, max: C.length + 3, choice: pick, summary: `Rated ${ratings}/${C.length} brides correctly; recommended ${cand.name}; reason ${r.ok ? 'good' : 'weak'}` };
}

// ---------------- 6. Portrait detective: can you trust a painting? ----------------
export async function portraitDetective(api, cfg) {
  const { esc } = api;
  const sorted = {};
  const p = api.openPanel(`
    <div class="kicker">🖼️ ${esc(cfg.title)}</div>
    <div class="card-head"><h2>${esc(cfg.heading)}</h2>${api.speakBtn('.pd-intro')}</div>
    <div class="two-col">
      <div class="col-a">${api.figure(cfg.img)}</div>
      <div class="col-b"><div class="pd-intro card-text">${cfg.intro}</div>
        <div class="stmts">${cfg.statements.map((s, k) => `
          <div class="stmt" data-s="${k}">
            <div class="small muted">${esc(s.who)} · ${esc(s.when)}</div>
            <blockquote class="parch">"${esc(s.quote)}"</blockquote>
            <div class="yn"><button class="btn" data-k="${k}" data-v="true">👍 She looked like the painting</button><button class="btn" data-k="${k}" data-v="false">👎 She did not</button></div>
            <div class="why small" hidden></div>
          </div>`).join('')}</div>
      </div>
    </div>
    <div class="row"><span></span><button class="btn primary" id="check" disabled>Check ✔</button></div>`, 'wide activity');
  api.glossify(p.querySelector('.pd-intro'));
  api.autoSpeak(cfg.intro);
  p.querySelectorAll('[data-k]').forEach((b) => {
    b.onclick = () => {
      sorted[b.dataset.k] = b.dataset.v;
      p.querySelectorAll(`[data-k="${b.dataset.k}"]`).forEach((x) => x.classList.toggle('picked', x === b));
      p.querySelector('#check').disabled = Object.keys(sorted).length < cfg.statements.length;
    };
  });
  await tap(p.querySelector('#check'));
  let right = 0;
  cfg.statements.forEach((s, k) => {
    const ok = sorted[k] === String(s.side);
    if (ok) right++;
    const el = p.querySelector(`[data-s="${k}"]`);
    el.classList.add(ok ? 'ok' : 'no');
    el.querySelectorAll('button').forEach((b) => { b.disabled = true; });
    const w = el.querySelector('.why');
    w.hidden = false;
    w.innerHTML = `${ok ? '✅' : '❌'} <b>Why might they say this?</b> ${esc(s.why)}`;
  });
  const row = p.querySelector('#check').parentElement;
  row.innerHTML = `<span><b>You sorted ${right} of ${cfg.statements.length} correctly.</b> Read why each person might have said it.</span><button class="btn primary" id="next">Next ▶</button>`;
  await tap(row.querySelector('#next'));
  api.closePanel();
  const q = cfg.question;
  const order = api.shuffle(q.options.map((_, k) => k));
  const p2 = api.openPanel(`
    <div class="kicker">🖼️ ${esc(cfg.title)}</div>
    <div class="card-head"><h2 class="q">${esc(q.q)}</h2>${api.speakBtn('.q')}</div>
    <div class="opts">${order.map((k, pos) => `<button class="btn choice" data-k="${k}"><b class="letter">${'ABCD'[pos]}</b> ${esc(q.options[k].t)}</button>`).join('')}</div>
    <div class="feedback"></div>`, 'card activity');
  const k = await new Promise((r) => p2.querySelectorAll('[data-k]').forEach((b) => { b.onclick = () => r(+b.dataset.k); }));
  const o = q.options[k];
  p2.querySelectorAll('[data-k]').forEach((b) => { b.disabled = true; if (q.options[+b.dataset.k].ok) b.classList.add('right'); else if (+b.dataset.k === k) b.classList.add('wrong'); });
  const fb = p2.querySelector('.feedback');
  fb.innerHTML = `<p class="${o.ok ? 'good' : 'bad'}">${o.ok ? '✅ Well reasoned!' : '❌ Not quite.'} ${esc(o.why)}</p><p class="real">${cfg.after}</p><div class="row"><span></span><button class="btn primary" id="next">Continue ▶</button></div>`;
  api.autoSpeak(o.why + ' ' + api.strip(cfg.after));
  await tap(fb.querySelector('#next'));
  api.closePanel();
  return { score: right + (o.ok ? 1 : 0), max: cfg.statements.length + 1, summary: `Sorted ${right}/${cfg.statements.length} descriptions; final judgement ${o.ok ? 'correct' : 'incorrect'}` };
}

// ---------------- 7. Plan the welcome on a budget ----------------
export async function budget(api, cfg) {
  const { esc } = api;
  const on = new Set();
  const money = (n) => '£' + n.toLocaleString('en-GB');
  const p = api.openPanel(`
    <div class="kicker">💰 ${esc(cfg.title)}</div>
    <div class="card-head"><h2>${esc(cfg.heading)}</h2>${api.speakBtn('.bd-intro')}</div>
    <div class="bd-intro card-text">${cfg.intro}</div>
    <div class="purse"><div>💰 Budget <b>${money(cfg.budget)}</b></div><div>🧾 Spent <b id="spent">£0</b></div><div>🪙 Left <b id="left">${money(cfg.budget)}</b></div>
      <div class="pbar"><span id="pbar"></span></div></div>
    <div class="items">${cfg.items.map((it) => `<button class="item" data-i="${it.id}"><span class="iic">${it.icon}</span><span class="iname"><b>${esc(it.name)}</b><small>${esc(it.desc)}</small></span><span class="icost">${money(it.cost)}</span></button>`).join('')}</div>
    <div class="feedback"></div>
    <div class="row"><span class="small muted">Tap things to add or remove them. You cannot spend more than the budget!</span><button class="btn primary" id="go">📜 Send my plan to the Treasury</button></div>`, 'wide activity');
  api.glossify(p.querySelector('.bd-intro'));
  api.autoSpeak(cfg.intro);
  const total = () => cfg.items.filter((it) => on.has(it.id)).reduce((a, it) => a + it.cost, 0);
  const upd = () => {
    const t = total();
    p.querySelector('#spent').textContent = money(t);
    p.querySelector('#left').textContent = money(cfg.budget - t);
    p.querySelector('#pbar').style.width = Math.min(100, (t / cfg.budget) * 100) + '%';
    p.querySelector('.purse').classList.toggle('over', t > cfg.budget);
    p.querySelectorAll('[data-i]').forEach((b) => b.classList.toggle('picked', on.has(b.dataset.i)));
    p.querySelector('#go').disabled = t > cfg.budget || on.size === 0;
    p.querySelector('.feedback').innerHTML = t > cfg.budget ? `<p class="bad">❌ The Treasurer shakes his head: "That is ${money(t - cfg.budget)} too much, Master Cromwell!" Remove something.</p>` : '';
  };
  p.querySelectorAll('[data-i]').forEach((b) => { b.onclick = () => { if (on.has(b.dataset.i)) on.delete(b.dataset.i); else on.add(b.dataset.i); upd(); }; });
  upd();
  await tap(p.querySelector('#go'));
  api.closePanel();
  const ess = cfg.items.filter((it) => it.essential);
  const gotEss = ess.filter((it) => on.has(it.id));
  const bonus = cfg.items.filter((it) => it.bonus && on.has(it.id));
  const t = total();
  // maths question
  const q = cfg.maths;
  const order = api.shuffle(q.options.map((_, k) => k));
  const p2 = api.openPanel(`
    <div class="kicker">💰 ${esc(cfg.title)}</div>
    <h2>The Treasury checks your plan</h2>
    <ul class="feedback-list">
      ${ess.map((it) => `<li class="${on.has(it.id) ? 'good' : 'bad'}">${on.has(it.id) ? '✅' : '❌'} <b>${esc(it.name)}</b>: ${esc(it.why)}</li>`).join('')}
      ${cfg.items.filter((it) => it.bonus).map((it) => `<li class="${on.has(it.id) ? 'good' : 'ok'}">${on.has(it.id) ? '🌟' : '🤔'} <b>${esc(it.name)}</b>: ${esc(it.why)}</li>`).join('')}
      <li>🧾 You spent <b>${money(t)}</b> and saved <b>${money(cfg.budget - t)}</b> for the King's defences.</li>
    </ul>
    <div class="question"><h3>🧮 Tudor money challenge: ${esc(q.q)}</h3><p class="small muted">${esc(q.hint)}</p>
      <div class="opts">${order.map((k, pos) => `<button class="btn choice" data-k="${k}"><b class="letter">${'ABCD'[pos]}</b> ${esc(q.options[k])}</button>`).join('')}</div>
      <div class="feedback"></div></div>`, 'card activity');
  const k = await new Promise((r) => p2.querySelectorAll('[data-k]').forEach((b) => { b.onclick = () => r(+b.dataset.k); }));
  const ok = k === q.answer;
  p2.querySelectorAll('[data-k]').forEach((b) => { b.disabled = true; if (+b.dataset.k === q.answer) b.classList.add('right'); else if (+b.dataset.k === k) b.classList.add('wrong'); });
  const fb = p2.querySelector('.feedback');
  fb.innerHTML = `<p class="${ok ? 'good' : 'bad'}">${ok ? '✅ Correct!' : '❌ Not quite.'} ${esc(q.why)}</p><div class="row"><span></span><button class="btn primary" id="next">Continue ▶</button></div>`;
  await tap(fb.querySelector('#next'));
  api.closePanel();
  const score = gotEss.length + bonus.length + (ok ? 1 : 0);
  return { score, max: ess.length + cfg.items.filter((it) => it.bonus).length + 1, summary: `Spent ${money(t)} of ${money(cfg.budget)}; ${gotEss.length}/${ess.length} essentials; money question ${ok ? 'correct' : 'incorrect'}` };
}

// ---------------- 8. Damage control: three bars to keep balanced ----------------
export async function crisis(api, cfg) {
  const { esc } = api;
  const bars = { mood: api.meters().favour, alliance: cfg.start.alliance, safety: cfg.start.safety };
  const barsHTML = () => `<div class="cbars">
    <div class="cbar"><span>👑 King's mood</span><span class="rbar"><span style="width:${clamp(bars.mood, 0, 100)}%"></span></span></div>
    <div class="cbar"><span>🤝 Alliance with Cleves</span><span class="rbar"><span style="width:${clamp(bars.alliance, 0, 100)}%"></span></span></div>
    <div class="cbar"><span>🛡️ Your safety</span><span class="rbar"><span style="width:${clamp(bars.safety, 0, 100)}%"></span></span></div></div>`;
  for (let i = 0; i < cfg.rounds.length; i++) {
    const r = cfg.rounds[i];
    const p = api.openPanel(`
      <div class="kicker">🔥 ${esc(cfg.title)} · Problem ${i + 1} of ${cfg.rounds.length}</div>
      <div class="card-head"><span class="year">${esc(r.year)}</span><h2>${esc(r.title)}</h2>${api.speakBtn('.cr-text')}</div>
      <div class="two-col"><div class="col-a">${moodFaceHTML(api.imgURL('henry'), bars.mood, 'big')}<div class="bars-slot">${barsHTML()}</div></div>
      <div class="col-b"><div class="cr-text card-text">${r.text}</div>
        <div class="opts">${r.choices.map((c, k) => `<button class="btn choice" data-k="${k}">${esc(c.t)}</button>`).join('')}</div>
        <div class="feedback"></div></div></div>`, 'wide activity');
    api.glossify(p.querySelector('.cr-text'));
    api.autoSpeak(r.title + '. ' + r.text);
    const k = await new Promise((res) => p.querySelectorAll('[data-k]').forEach((b) => { b.onclick = () => res(+b.dataset.k); }));
    const c = r.choices[k];
    p.querySelectorAll('[data-k]').forEach((b) => { b.disabled = true; if (+b.dataset.k === k) b.classList.add('picked'); });
    api.applyFx({ favour: c.mood || 0 });
    bars.mood = api.meters().favour;
    bars.alliance = clamp(bars.alliance + (c.alliance || 0), 0, 100);
    bars.safety = clamp(bars.safety + (c.safety || 0), 0, 100);
    p.querySelector('.bars-slot').innerHTML = barsHTML();
    p.querySelector('.mood-face').outerHTML = moodFaceHTML(api.imgURL('henry'), bars.mood, 'big');
    const fb = p.querySelector('.feedback');
    fb.innerHTML = `<p class="result">${c.result}</p><div class="real"><b>📜 What really happened:</b> ${r.real}</div>
      <div class="row"><span></span><button class="btn primary" id="next">${i < cfg.rounds.length - 1 ? 'Next problem ▶' : 'Continue ▶'}</button></div>`;
    api.glossify(fb);
    api.autoSpeak(api.strip(c.result) + ' What really happened: ' + api.strip(r.real));
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    await tap(fb.querySelector('#next'));
    api.closePanel();
  }
  const good = [bars.mood, bars.alliance, bars.safety].filter((v) => v >= 50).length;
  const p = api.openPanel(`<div class="kicker">🔥 ${esc(cfg.title)}</div><h2>${good === 3 ? 'You kept everything in balance!' : `You kept ${good} of 3 things safe`}</h2>
    ${barsHTML()}<div class="card-text">${cfg.ending}</div>
    <div class="row"><span></span><button class="btn primary" id="next">Continue ▶</button></div>`, 'card activity');
  api.glossify(p.querySelector('.card-text'));
  await tap(p.querySelector('#next'));
  api.closePanel();
  return { score: good, max: 3, summary: `King's mood ${Math.round(bars.mood)}%, alliance ${bars.alliance}%, your safety ${bars.safety}%` };
}

// ---------------- 9. Persuade the King (his face reacts to every word) ----------------
export async function persuade(api, cfg) {
  const { esc } = api;
  let mood = cfg.startMood, good = 0;
  const lines = [];
  for (let i = 0; i < cfg.parts.length; i++) {
    const part = cfg.parts[i];
    const p = api.openPanel(`
      <div class="kicker">🗣️ ${esc(cfg.title)} · Part ${i + 1} of ${cfg.parts.length}</div>
      <div class="two-col">
        <div class="col-a center"><div class="face-slot">${moodFaceHTML(api.imgURL('henry'), mood, 'big')}</div><b class="mood-word">King Henry is ${moodOf(mood).label.toLowerCase()}</b>
          <div class="speech parchment small">${lines.length ? lines.map((l) => `<p>${esc(l)}</p>`).join('') : '<p class="blank">Catherine\'s words will appear here…</p>'}</div></div>
        <div class="col-b"><div class="card-text">${i === 0 ? cfg.intro : ''}</div>
          <h3>${esc(part.label)}</h3>
          <div class="opts">${api.shuffle(part.options.map((_, k) => k)).map((k) => `<button class="btn choice" data-k="${k}">"${esc(part.options[k].t)}"</button>`).join('')}</div>
          <div class="feedback"></div></div>
      </div>`, 'wide activity');
    if (i === 0) { api.glossify(p.querySelector('.card-text')); api.autoSpeak(cfg.intro); }
    const k = await new Promise((r) => p.querySelectorAll('[data-k]').forEach((b) => { b.onclick = () => r(+b.dataset.k); }));
    const o = part.options[k];
    p.querySelectorAll('[data-k]').forEach((b) => { b.disabled = true; if (+b.dataset.k === k) b.classList.add(o.ok ? 'right' : 'wrong'); });
    mood = clamp(mood + o.mood, 0, 100);
    if (o.ok) good++;
    lines.push(o.t);
    p.querySelector('.face-slot').innerHTML = moodFaceHTML(api.imgURL('henry'), mood, 'big react');
    p.querySelector('.mood-word').textContent = `King Henry is ${moodOf(mood).label.toLowerCase()}`;
    const fb = p.querySelector('.feedback');
    fb.innerHTML = `<p class="henry-says">👑 <i>"${esc(o.reply)}"</i></p><p class="${o.ok ? 'good' : 'bad'}">${o.ok ? '✅' : '❌'} ${esc(o.why)}</p>
      <div class="row"><span></span><button class="btn primary" id="next">${i < cfg.parts.length - 1 ? 'Next ▶' : 'Continue ▶'}</button></div>`;
    api.autoSpeak(o.reply);
    fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    await tap(fb.querySelector('#next'));
    api.closePanel();
  }
  const won = mood >= cfg.winMood;
  const p = api.openPanel(`<div class="kicker">🗣️ ${esc(cfg.title)}</div>
    <div class="card-head">${moodFaceHTML(api.imgURL('henry'), mood)}<h2>${won ? 'The King is won over!' : 'The King is still suspicious…'}</h2></div>
    <div class="card-text">${won ? cfg.success : cfg.fail}</div>
    <div class="row"><span></span><button class="btn primary" id="next">Continue ▶</button></div>`, 'card activity');
  api.glossify(p.querySelector('.card-text'));
  api.autoSpeak(api.strip(won ? cfg.success : cfg.fail));
  await tap(p.querySelector('#next'));
  api.closePanel();
  return { score: good, max: cfg.parts.length, summary: `Chose ${good} of ${cfg.parts.length} wise answers; the King ended ${moodOf(mood).label.toLowerCase()}` };
}

export const ACTIVITIES = { conscience, interrogation, cipher, freewrite, matchmaker, portraitDetective, budget, crisis, persuade };
