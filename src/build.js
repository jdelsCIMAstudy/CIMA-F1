// Build: node build.js  →  CIMA_F1_Study.html and dist/ (installable offline web app)
// Content lives in content/:
//   chN.js or chN.json         one chapter: { id, n, title, area, lo, items:[cards {t:'c'} and questions {t:'q'}] }
//   obj_chN.js (optional)      objective-kit questions for chapter N: [{ after: cardId, items:[...] }]
//                              each block is inserted after the card's existing questions (before the next card)
//   glossary.js                [{ t: term, aka:[...], ch:'chN', d: html, see:[cardIds] }]
// To add a chapter: write content/chN.js, add it to CHAPTERS, remove it from PENDING, rebuild, run test_app.py.
const fs = require('fs');
const path = require('path');
const CHAPTERS = process.env.CH ? process.env.CH.split(',') : ['ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6'];
const PENDING = ['7 Conceptual framework', '8 Single entity accounts', '9 IAS 16 and IAS 36', '10 IFRS 5', '11 IFRS 16', '12 IAS 2 and IAS 10', '13 IAS 7', '14 Short-term finance', '15 Working capital', '16 Receivables and payables', '17 Inventory control', '18 Cash control'];

const outcomes = {
  A1a: 'Identify the major regulators', A1b: 'Describe what regulators do', A1c: 'Explain why they regulate financial reporting',
  A2a: 'Describe the role of the board in corporate governance', A2b: 'Apply governance and stewardship principles to financial reporting',
  B1a: 'Identify the main elements of financial statements (Conceptual Framework)',
  B2a: 'Explain standards on non-current assets', B2b: 'Explain standards on leases', B2c: 'Explain standards on impairment', B2d: 'Explain standards on inventory', B2e: 'Explain standards on events after the period',
  B3a: 'Prepare a statement of financial position', B3b: 'Prepare a statement of comprehensive income', B3c: 'Prepare a statement of changes in equity', B3d: 'Prepare a statement of cash flows',
  C1a: 'Distinguish direct v indirect taxes', C1b: 'Distinguish corporate v personal taxes',
  C2a: 'Explain the basis of taxation', C2b: 'Explain accounting profit v taxable profit', C2c: 'Calculate corporate tax',
  C3a: 'Explain taxation across international borders', C3b: 'Explain the ethics of taxation',
  D1a: 'Distinguish types of short-term finance', D1b: 'Distinguish financial institutions',
  D2a: 'Explain and calculate the operating cycle', D2b: 'Explain and calculate the cash flow cycle',
  D3a: 'Apply working capital policies', D3b: 'Prepare forecasts', D3c: 'Explain working capital risks'
};

const about = `<p>Built from your study text chapters, the F1 syllabus and the two exam-kit question banks. Calibrated to the objective test: 90 minutes, 60 questions, one technique per question.</p>
<p><b>Question sources.</b> <i>Objective Q</i> = the kit's objective-test section (Q1–Q253). <i>Bank</i> = the kit's Test Yourself bank (001–325). <i>Chapter TYU</i> = the study text's Test your understanding. <i>Practice</i> = extra questions written for gaps.</p>
<p><b>How questions work.</b> The first time you see a question it is the original. After that, practice, review and the wrong-answer queue serve fresh variants: numbers changed with the answer recalculated, or the logic flipped (e.g. "which is NOT" ↔ "which IS").</p>
<p><b>Objective quiz</b> picks kit questions from the chapters you choose (untried first, then weakest) and lists your answer next to the correct one at the end. <b>Mock test</b> is the timed, mixed version.</p>
<p><b>Look up anything.</b> Long-press any word or phrase and tap <b>Look up</b>. You get the glossary entry and every card that mentions it (offline), plus a Wikipedia summary and dictionary definition when you're online. Underlined terms in cards open their glossary entry directly.</p>
<p><b>Wrong answers</b> stay in the queue until you get that question right twice in a row. <b>Spaced review</b> brings questions back 1, 3, 7, 14 and 30 days after each correct answer.</p>
<p><b>Purple boxes</b> are either real-world updates since the textbook (not needed for the exam) or flags where the source question has a problem.</p>
<p><b>Your progress</b> is stored on this device only. Use Backup before switching browser or phone.</p>`;

const load = n => fs.existsSync(path.join(__dirname, 'content', n + '.js')) ? require('./content/' + n + '.js') : require('./content/' + n + '.json');
const chapters = CHAPTERS.map(n => {
  const ch = JSON.parse(JSON.stringify(load(n)));
  const of = path.join(__dirname, 'content', 'obj_' + n + '.js');
  if (fs.existsSync(of)) require(of).forEach(blk => {
    const i = ch.items.findIndex(x => x.id === blk.after);
    if (i < 0) throw new Error(`obj_${n}: no card ${blk.after}`);
    let j = i + 1; while (j < ch.items.length && ch.items[j].t !== 'c') j++;
    ch.items.splice(j, 0, ...blk.items);
  });
  return ch;
});
const glossary = fs.existsSync(path.join(__dirname, 'content', 'glossary.js')) ? require('./content/glossary.js') : [];

// integrity checks
const ids = new Set(); const errs = [];
chapters.forEach(ch => ch.items.forEach(it => {
  if (ids.has(it.id)) errs.push('Duplicate id ' + it.id); ids.add(it.id);
  (it.lo || []).forEach(l => { if (!outcomes[l]) errs.push(it.id + ' unknown LO ' + l); });
  if (it.t === 'q') {
    if (!['mcq', 'multi', 'num', 'match'].includes(it.type)) errs.push(it.id + ' bad type');
    if (it.type === 'num' && !it.ans) errs.push(it.id + ' missing ans');
    if ((it.type === 'mcq' || it.type === 'multi') && !it.opts) errs.push(it.id + ' missing opts');
    if (it.type === 'match' && (!it.items || !it.choices || it.a.length !== it.items.length)) errs.push(it.id + ' bad match');
    if (it.a == null && it.type !== 'num') errs.push(it.id + ' missing a');
    if (!it.q && it.type !== 'match') errs.push(it.id + ' missing q');
  }
}));
const gnames = new Set();
glossary.forEach(g => {
  const k = g.t.toLowerCase(); if (gnames.has(k)) errs.push('Duplicate glossary term ' + g.t); gnames.add(k);
  (g.see || []).forEach(id => { if (!ids.has(id)) errs.push('Glossary ' + g.t + ' links missing card ' + id); });
  if (g.ch && !CHAPTERS.includes(g.ch)) errs.push('Glossary ' + g.t + ' bad ch ' + g.ch);
});
if (errs.length) { console.error(errs.join('\n')); process.exit(1); }
// a match question with no q text shows its items; give it a default stem
chapters.forEach(ch => ch.items.forEach(it => { if (it.t === 'q' && it.type === 'match' && !it.q) it.q = 'Choose the correct option to complete the sentence.'; }));

const DATA = { title: 'CIMA F1 Financial Reporting', version: new Date().toISOString().slice(0, 10), outcomes, pending: PENDING, about, chapters, glossary };
const json = JSON.stringify(DATA).replace(/<\//g, '<\\/');
const html = fs.readFileSync(path.join(__dirname, 'engine.html'), 'utf8').replace('__DATA__', () => json);
const out = path.join(__dirname, 'CIMA_F1_Study.html');
fs.writeFileSync(out, html);
const all = chapters.flatMap(c => c.items), qs = all.filter(i => i.t === 'q');
console.log(`Built ${out}: ${chapters.length} chapters, ${all.length - qs.length} cards, ${qs.length} questions (${qs.filter(q => /^o\d{3}$/.test(q.id)).length} objective, ${qs.filter(q => /^b\d{3}$/.test(q.id)).length} bank), ${glossary.length} glossary terms, ${(html.length / 1024).toFixed(0)} KB`);

// ---- installable offline web app (home-screen app on iPhone) → dist/
const crypto = require('crypto');
const dist = path.join(__dirname, 'dist'); if (!fs.existsSync(dist)) fs.mkdirSync(dist);
fs.writeFileSync(path.join(dist, 'index.html'), html);
const ver = crypto.createHash('sha1').update(html).digest('hex').slice(0, 10);
fs.writeFileSync(path.join(dist, 'manifest.webmanifest'), JSON.stringify({
  name: 'CIMA F1 Study', short_name: 'CIMA F1', start_url: './', scope: './', display: 'standalone',
  background_color: '#f6f7f9', theme_color: '#1f3a5f',
  icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }]
}, null, 1));
fs.writeFileSync(path.join(dist, 'sw.js'), `// Offline cache. Version changes with every build so phones pick up new content.
const CACHE = 'cima-f1-${ver}';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// same-origin files: serve from cache instantly, refresh in the background. Other sites (look-up) go straight to the network.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(caches.open(CACHE).then(c => c.match(e.request, { ignoreSearch: true }).then(hit => {
    const net = fetch(e.request).then(r => { if (r && r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  })));
});
`);
['icon-180.png', 'icon-192.png', 'icon-512.png'].forEach(f => { const s = [path.join(__dirname, '..', f), path.join(__dirname, '..', 'cima-f1', f)].find(x => fs.existsSync(x)) || ''; if (fs.existsSync(s) && !fs.existsSync(path.join(dist, f))) fs.copyFileSync(s, path.join(dist, f)); });
console.log('dist/ ready (version ' + ver + ')');
