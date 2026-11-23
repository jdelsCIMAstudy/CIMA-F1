import json, sys, re
from playwright.sync_api import sync_playwright

import os
HERE = os.path.dirname(os.path.abspath(__file__))
os.makedirs(os.path.join(HERE, 'shots'), exist_ok=True)
PATH = 'file://' + os.path.join(HERE, 'CIMA_F1_Study.html')
# Expected original answers, checked by hand against the source answer keys
EXP_NUM = {'b014':3400,'b016':55750,'b017':154025,'b021':35250,'b025':62000,'b033':17250,'b082':60000,'b084':28000,
 'c1-q02':300,'c1-q04':45,'c1-q10':105250,'c1-q11':230800,'c2-t1':29250,'c2-t2':6800,'c2-t3':17750,'c2-t4':77050,'c2-t5':21574,
 'c2-t6':126000,'c2-t7':-4000,'c2-t9':73250,'c2-t10':19687.5,'c2-t19':13860,'c2-t11':25000,'c2-t12':15000,'c2-q01':20000,
 'c2-t13':160000,'c2-t14':51000,'c2-t15':21800,'c2-t21':83250,'c2-t17b':270000,'c2-t17c':38000,'c2-t16a':4000,'c2-t16b':15000,
 'c2-q02':20000,'c2-q03':6000,'c3-q01':10000,'c3-q02':44000,'c3-t1a':101250,'c3-t1b':37500,'c3-t1c':11250,'c3-t2':20000,
 'o028':1350,'o041':3460,'o050':27750,'o051':48500,'o052':14000,'o057':40800,'o071':21600,'o073':23000,'o075':45500,'o077':145000,'o084':32300,'o087':4520}
EXP_A = {'b015':1,'b018':3,'b019':3,'b020':3,'b023':2,'b028':0,'b029':[1,2],'b030':3,'b031':0,'b032':2,'b034':0,'b035':0,'b036':0,
 'b037':1,'c2-t18':3,'c2-t20':0,'b007':2,'b008':1,'c1-t3':0,'c2-t8':0,
 'o029':3,'o049':0,'o088':0,'o083':3,'o045':[0,1,0,5,1],'o047':[5,0,3,2]}
EXP_OPT = {'b015':'$3,040 payable','b018':'$485,000','b019':'$126,000','b020':'$101,000','b023':'$206,000','b028':'$17,600 balancing charge',
 'b030':'$103,000','b031':'$10,000','b034':'$120,800','b035':'$69,750','b036':'$7,700','b037':'$4,500','c2-t18':'$153,750','c2-t20':'$12,160',
 'o029':'$127,200','o049':'$36,800','o088':'$13,750','o083':'$35bn'}
try:
    EXTRA = json.load(open(os.path.join(HERE, 'expected_extra.json')))
    EXP_NUM.update(EXTRA.get('num', {})); EXP_A.update(EXTRA.get('a', {})); EXP_OPT.update(EXTRA.get('opt', {}))
except FileNotFoundError:
    pass

CHECK_JS = """(args) => {
 const [EXP_NUM, EXP_A, EXP_OPT] = args; const out = {errors: [], variants: 0, flips: 0, nums: 0};
 const bad = s => /\\{[^}]*\\}/.test(s) || /NaN|undefined|Infinity/.test(s);
 for (const q of QS) {
  const o = inst(q, 'orig');
  const allText = [o.text, ...(o.opts||[]), ...(o.items||[]), ...o.sol, o.trap].join(' || ');
  if (bad(allText)) out.errors.push(q.id + ' orig unresolved: ' + allText.slice(0, 300));
  if (q.id in EXP_NUM && Math.abs(o.ans - EXP_NUM[q.id]) > 0.01) out.errors.push(q.id + ' orig ans ' + o.ans + ' expected ' + EXP_NUM[q.id]);
  if (q.id in EXP_A && JSON.stringify(o.a) !== JSON.stringify(EXP_A[q.id])) out.errors.push(q.id + ' orig a ' + JSON.stringify(o.a) + ' expected ' + JSON.stringify(EXP_A[q.id]));
  if (q.id in EXP_OPT && !o.opts[o.a].startsWith(EXP_OPT[q.id])) out.errors.push(q.id + ' orig opt text ' + o.opts[o.a]);
  if (o.opts && (q.type==='mcq'||q.type==='multi') && new Set(o.opts).size !== o.opts.length) out.errors.push(q.id + ' orig dup opts');
  if (q.type==='match' && o.a.some(x => x == null || x < 0 || x >= o.choices.length)) out.errors.push(q.id + ' match a out of range');
  for (let k = 0; k < 60; k++) {
   const I = inst(q, 'fresh');
   if (I.kind === 'num') out.nums++; if (I.kind === 'flip') out.flips++; out.variants++;
   const t = [I.text, ...(I.opts||[]), ...(I.items||[]), ...I.sol, I.trap].join(' || ');
   if (bad(t)) { out.errors.push(q.id + ' variant unresolved: ' + t.slice(0, 400)); break; }
   if (I.opts && (q.type==='mcq'||q.type==='multi')) {
     if (new Set(I.opts).size !== I.opts.length) { out.errors.push(q.id + ' dup opts ' + JSON.stringify(I.opts)); break; }
     const as = q.type==='mcq' ? [I.a] : I.a;
     if (!as.every(x => Number.isInteger(x) && x >= 0 && x < I.opts.length)) { out.errors.push(q.id + ' bad a ' + JSON.stringify(I.a)); break; }
   }
   if (I.q.type === 'match' && I.a.some(x => x == null || x < 0 || x >= I.choices.length)) { out.errors.push(q.id + ' variant match a'); break; }
   if (I.q.type === 'num' && !isFinite(I.ans)) { out.errors.push(q.id + ' bad ans'); break; }
   if (I.q.type === 'num' && I.ans < 0 && q.id !== 'c2-t7') { out.errors.push(q.id + ' negative ans ' + I.ans + ' sc=' + JSON.stringify(I.sc)); break; }
   let r = I.q.type==='mcq' ? I.a : I.q.type==='multi' ? I.a.slice() : I.q.type==='match' ? I.a.slice() : fmt(I.ans, I.q.dp);
   if (!grade(I, r)) { out.errors.push(q.id + ' correct response not accepted: ' + r); break; }
   if (I.q.type==='num' && grade(I, String(I.ans + 50))) { out.errors.push(q.id + ' wrong accepted'); break; }
  }
 }
 const loQ = {}; QS.forEach(q => (q.lo||[]).forEach(l => loQ[l] = (loQ[l]||0) + 1));
 const loC = {}; CARDS.forEach(c => (c.lo||[]).forEach(l => loC[l] = (loC[l]||0) + 1));
 out.loQ = loQ; out.loC = loC;
 out.bank = QS.filter(q => /^b\\d{3}$/.test(q.id)).map(q => q.id).sort();
 out.obj = QS.filter(q => /^o\\d{3}$/.test(q.id)).map(q => q.id).sort();
 out.counts = {cards: CARDS.length, qs: QS.length, gloss: GL.length, byType: QS.reduce((m,q)=>(m[q.type]=(m[q.type]||0)+1,m),{})};
 out.noVariant = QS.filter(q => !((q.v && Object.keys(q.v).length) || (q.alt && q.alt.length))).map(q=>q.id);
 out.chapters = CH.map(c => [c.id, c.items.filter(i=>i.t==='c').length, c.items.filter(i=>i.t==='q').length]);
 return out;
}"""

def nums(s):
    out = []
    for part in s.split(','):
        part = part.strip()
        if '-' in part:
            a, b = part.split('-'); out += list(range(int(a), int(b) + 1))
        elif part: out.append(int(part))
    return out

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
    pg = ctx.new_page()
    errs = []
    pg.on('pageerror', lambda e: errs.append('pageerror: ' + str(e)))
    pg.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' and 'net::' not in m.text else None)
    pg.goto(PATH); pg.wait_for_timeout(300)
    res = pg.evaluate(CHECK_JS, [EXP_NUM, EXP_A, EXP_OPT])
    print('counts', res['counts'], 'variants', res['variants'], 'num', res['nums'], 'flip', res['flips'])
    print('chapters (id, cards, questions)', res['chapters'])
    print('no variant (%d):' % len(res['noVariant']), ' '.join(res['noVariant']))
    print('LO questions', res['loQ']); print('LO cards', res['loC'])
    if len(sys.argv) > 1:
        want_b = set('b%03d' % n for n in nums(sys.argv[1])); want_o = set('o%03d' % n for n in nums(sys.argv[2] if len(sys.argv) > 2 else ''))
        print('MISSING bank:', sorted(want_b - set(res['bank'])), 'MISSING objective:', sorted(want_o - set(res['obj'])))
    print('bank ids', len(res['bank']), 'objective ids', len(res['obj']))
    print('ERRORS', len(res['errors']))
    for e in res['errors'][:60]: print(' -', e)
    # walk every learn item in every chapter
    chs = pg.evaluate("CH.map(c=>[c.id,c.items.length])")
    for ch, n in chs:
        for i in range(n):
            pg.goto(f'{PATH}#/learn/{ch}/{i}'); pg.wait_for_timeout(8)
            if pg.locator('text=Something went wrong').count(): errs.append(f'render fail {ch} {i}: ' + pg.inner_text('#app')[:300])
    # an mcq submit in learn flow
    pg.goto(PATH + '#/learn/ch1/1'); pg.wait_for_timeout(100)
    pg.locator('.opt').nth(0).click(); pg.locator('.sub').click(); pg.wait_for_timeout(100)
    assert pg.locator('.box.bad, .box.ok').count() >= 1
    # number entry
    idx = pg.evaluate("chById('ch2').items.findIndex(x=>x.id==='b016')")
    pg.goto(f'{PATH}#/learn/ch2/{idx}'); pg.wait_for_timeout(100)
    pg.fill('input[type=text]', '55,750'); pg.locator('.sub').click(); pg.wait_for_timeout(100)
    print('num correct accepted:', pg.locator('.box.ok').count())
    # inline calculator on a number question: BIDMAS and 'use result'
    pg.goto(PATH + '#/'); pg.goto(f'{PATH}#/learn/ch2/{idx}'); pg.wait_for_timeout(100)
    for k in ['2','+','3','×','4','^','2','−','(','1','0',')','÷','4']: pg.locator(f'.calc .ck[data-k="{k}"]').first.click()
    print('calc display (2+3×4^2−(10)÷4 → 47.5):', pg.inner_text('.calc .cres'))
    pg.locator('.calc .ck[data-k="="]').click(); pg.locator('.cuse').click()
    print('answer box after use:', pg.input_value('.numrow input'))
    pg.screenshot(path=os.path.join(HERE, 'shots', 'shot_calc.png'), full_page=True)
    # glossary-underlined term in a card, tap → look-up sheet
    pg.goto(PATH + '#/'); pg.wait_for_timeout(100)
    print('home tiles:', pg.locator('.tile b').all_inner_texts())
    pg.screenshot(path=os.path.join(HERE, 'shots', 'shot_home.png'), full_page=True)
    gl = pg.evaluate("(()=>{for(const c of CARDS){const ch=chById(c.ch);location.hash='#/learn/'+ch.id+'/'+ch.items.indexOf(c);route();if(document.querySelector('.gl'))return c.id;}return null})()")
    print('first card with underlined term:', gl)
    if gl:
        pg.locator('.gl').first.click(); pg.wait_for_timeout(200)
        print('lookup sheet open:', pg.locator('.sheet.lk').count(), pg.locator('.sheet.lk h3').all_inner_texts())
        pg.screenshot(path=os.path.join(HERE, 'shots', 'shot_lookup_offline.png'), full_page=False)
    # mocked online look-up (Wikipedia + Wiktionary)
    def wiki(route):
        u = route.request.url
        if 'list=search' in u: route.fulfill(status=200, content_type='application/json', headers={'Access-Control-Allow-Origin': '*'}, body=json.dumps({'query': {'search': [{'title': 'Tax deduction', 'snippet': 'x'}, {'title': 'Expense', 'snippet': 'y'}]}}))
        elif 'page/summary' in u: route.fulfill(status=200, content_type='application/json', headers={'Access-Control-Allow-Origin': '*'}, body=json.dumps({'extract': 'A tax deduction is a reduction of income that is able to be taxed.', 'content_urls': {'mobile': {'page': 'https://en.m.wikipedia.org/wiki/Tax_deduction'}}}))
        elif 'wiktionary' in u: route.fulfill(status=200, content_type='application/json', headers={'Access-Control-Allow-Origin': '*'}, body=json.dumps({'en': [{'partOfSpeech': 'Adjective', 'definitions': [{'definition': '<b>Not</b> allowable.'}]}]}))
        else: route.abort()
    ctx.route(re.compile(r'https://en\.(wikipedia|wiktionary)\.org/.*'), wiki)
    pg.goto(PATH + '#/glossary'); pg.wait_for_timeout(100)
    pg.evaluate("lookup('disallowable')"); pg.wait_for_timeout(600)
    print('online lookup text:', pg.inner_text('#lon')[:200].replace('\n', ' | '))
    pg.screenshot(path=os.path.join(HERE, 'shots', 'shot_lookup.png'), full_page=False)
    pg.evaluate("closeLookup()")
    # glossary search
    pg.fill('#gq', 'disallowable'); pg.wait_for_timeout(300)
    print('glossary search hits:', pg.locator('#gr .gle').count(), 'cards:', pg.locator('#gr .list a').count())
    pg.screenshot(path=os.path.join(HERE, 'shots', 'shot_glossary.png'), full_page=True)
    # selection → look-up pill
    pg.goto(PATH + '#/learn/ch2/0'); pg.wait_for_timeout(100)
    pg.evaluate("(()=>{const el=document.querySelector('.card h2');const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);})()"); pg.wait_for_timeout(400)
    print('pill visible:', pg.locator('.lkpill:not(.hide)').count(), pg.locator('.lkpill').inner_text())
    pg.locator('.lkpill').click(); pg.wait_for_timeout(200)
    print('pill opened sheet:', pg.locator('.sheet.lk').count())
    pg.evaluate("closeLookup()")
    # objective quiz: answers at the end
    pg.goto(PATH + '#/quiz'); pg.wait_for_timeout(150)
    print('quiz avail:', pg.inner_text('#avail'))
    pg.select_option('#mn', '5'); pg.locator('#mgo').click(); pg.wait_for_timeout(100)
    for i in range(5):
        if pg.locator('.opt').count(): pg.locator('.opt').nth(0).click()
        elif pg.locator('input[type=text]').count(): pg.fill('input[type=text]', '100')
        elif pg.locator('select').count():
            for s in pg.locator('select').all(): s.select_option(index=1)
        if i < 4: pg.locator('#nx').click(); pg.wait_for_timeout(30)
    pg.locator('#end').click(); pg.wait_for_timeout(100); pg.locator('.modal .myes').click(); pg.wait_for_timeout(200)
    print('quiz result:', pg.locator('h2').first.inner_text(), '| answer rows:', pg.locator('.ansrow').count())
    pg.screenshot(path=os.path.join(HERE, 'shots', 'shot_quiz.png'), full_page=True)
    # objective quiz with instant feedback
    pg.goto(PATH + '#/'); pg.wait_for_timeout(50); pg.goto(PATH + '#/quiz'); pg.wait_for_timeout(100)
    pg.check('#me'); pg.select_option('#mn', '5'); pg.locator('#mgo').click(); pg.wait_for_timeout(100)
    if pg.locator('.opt').count(): pg.locator('.opt').nth(0).click()
    elif pg.locator('input[type=text]').count(): pg.fill('input[type=text]', '100')
    else:
        for s in pg.locator('select').all(): s.select_option(index=1)
    pg.locator('.sub').click(); pg.wait_for_timeout(100)
    print('instant feedback shown:', pg.locator('.fb .box').count())
    pg.locator('#end').click(); pg.wait_for_timeout(100); pg.locator('.modal .myes').click(); pg.wait_for_timeout(200)
    print('instant quiz result:', pg.locator('h2').first.inner_text())
    # mock (timed)
    pg.goto(PATH + '#/'); pg.wait_for_timeout(50); pg.goto(PATH + '#/mock'); pg.wait_for_timeout(100)
    pg.select_option('#mn', '10'); pg.locator('#mgo').click(); pg.wait_for_timeout(100)
    print('mock timer:', pg.inner_text('#tm'))
    for i in range(9):
        if pg.locator('.opt').count(): pg.locator('.opt').nth(0).click()
        elif pg.locator('input[type=text]').count(): pg.fill('input[type=text]', '100')
        pg.locator('#nx').click(); pg.wait_for_timeout(30)
    pg.locator('#end').click(); pg.wait_for_timeout(100); pg.locator('.modal .myes').click(); pg.wait_for_timeout(200)
    print('mock result:', pg.locator('h2').first.inner_text())
    # backup round trip
    pg.goto(PATH + '#/backup'); pg.wait_for_timeout(100)
    code = pg.input_value('#ex'); before = pg.evaluate("JSON.stringify(S.q)")
    pg.evaluate("S = blank(); save();"); pg.fill('#im', code); pg.locator('#ib').click(); pg.wait_for_timeout(100)
    print('backup roundtrip ok:', before == pg.evaluate("JSON.stringify(S.q)"))
    pg.reload(); pg.wait_for_timeout(200)
    print('persisted q records:', pg.evaluate("Object.keys(S.q).length"))
    pg.emulate_media(color_scheme='dark'); pg.goto(PATH + '#/glossary'); pg.wait_for_timeout(100)
    pg.screenshot(path=os.path.join(HERE, 'shots', 'shot_dark.png'), full_page=False)
    print('PAGE ERRORS', errs[:20])
    b.close()
