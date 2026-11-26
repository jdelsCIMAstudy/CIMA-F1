// Worked examples, question-and-answer format. Keyed by card id; build.js sets card.ex from here.
// q: full question data (everything needed, no "as above"); req: what's required;
// steps: [{ d: the working, w: why }]; pattern: the reusable method.
const { T, UL } = require('../h.js');

module.exports = {

/* ---------------- Chapter 1 ---------------- */
'c1-c05': {
  title: 'Café sandwich: who bears the tax?',
  q: UL([
    'A café sells a sandwich for <b>$6</b> plus <b>20% sales tax</b>, so the customer pays $7.20',
    'The café collects the <b>$1.20</b> tax and pays it over to the tax authority',
  ]),
  req: 'State who has the formal incidence and who has the effective incidence, and whether the tax is direct or indirect.',
  steps: [
    { d: 'Formal incidence: the <b>café</b>', w: 'Formal incidence = who is legally required to pay the tax over. The café sends the $1.20 to the authority.' },
    { d: 'Effective incidence: the <b>customer</b>', w: 'Effective incidence = who actually bears the cost. The $1.20 is in the price the customer pays, so it comes out of their pocket.' },
    { d: 'The tax is <b>indirect</b>', w: 'The person who pays it over (café) is not the person who bears it (customer). Different people = indirect.' },
  ],
  pattern: 'Ask "who sends the money to the authority?" (formal) and "whose pocket is it really from?" (effective). If they differ, the tax is indirect.',
},

'c1-c07': {
  title: 'A and B: classify the tax',
  q: UL([
    'Taxpayer A earns <b>$40,000</b> and pays <b>$4,000</b> tax',
    'Taxpayer B earns <b>$80,000</b> and pays <b>$6,400</b> tax',
  ]),
  req: 'Is the tax progressive, proportional or regressive?',
  steps: [
    { d: 'A’s effective rate = 4,000 ÷ 40,000 = <b>10%</b>', w: 'The classification depends on tax as a % of income, not the dollar amount.' },
    { d: 'B’s effective rate = 6,400 ÷ 80,000 = <b>8%</b>', w: 'Same calculation for the higher earner.' },
    { d: 'The rate falls (10% → 8%) as income rises → <b>regressive</b>', w: 'Rate rises with income = progressive; stays the same = proportional; falls = regressive. B pays more dollars, but that doesn’t matter.' },
  ],
  pattern: 'Work out tax ÷ income for each person, then see which way the % moves as income goes up.',
},

'c1-c11': {
  title: 'Bread supply chain: VAT at each stage',
  q: UL([
    'VAT rate: <b>20%</b>. All prices below are net of VAT',
    'Grower sells wheat to the miller for <b>1,000</b> (the grower has no purchases)',
    'Miller sells flour to the baker for <b>2,500</b>',
    'Baker sells bread to consumers for <b>4,000</b>',
  ]),
  req: 'Calculate the VAT each business pays to the authority, and the total.',
  steps: [
    { d: 'Grower: output 20% × 1,000 = 200; input 0 → pays <b>200</b>', w: 'VAT payable = output tax (charged on sales) − input tax (paid on purchases). The grower bought nothing.' },
    { d: 'Miller: output 20% × 2,500 = 500; input (200) → pays <b>300</b>', w: 'The miller’s input tax is the 200 the grower charged it.' },
    { d: 'Baker: output 20% × 4,000 = 800; input (500) → pays <b>300</b>', w: 'The baker’s input tax is the 500 the miller charged it.' },
    { d: 'Total = 200 + 300 + 300 = <b>800</b> = 20% × 4,000', w: 'Each business only pays on the value it added. Added up, the total equals VAT on the final price, so the consumer bears all of it.' },
  ],
  pattern: 'For each business: 20% × its sales − 20% × its purchases. The total always equals 20% × the final consumer price.',
},

'c1-c13': {
  title: 'VAT inside a $124 price',
  q: UL([
    'A product costs <b>$124</b>, and that price <b>includes</b> VAT',
    'VAT rate: <b>20%</b>',
  ]),
  req: 'Calculate the VAT included in the price.',
  steps: [
    { d: 'Gross = net × 1.20, so 124 = 120% of net', w: 'The 20% is charged on the net price. $124 is the net price plus the tax, so it is 120% of net, not 100%.' },
    { d: 'VAT = 124 × 20/120 = 124 ÷ 6 = <b>$20.67</b> (net $103.33)', w: 'The VAT is 20 parts out of 120. At 20% that is always gross ÷ 6.' },
  ],
  pattern: 'Price given excluding VAT: × r. Price given including VAT: × r/(1 + r), which is ÷ 6 at 20%.',
},

'c1-c17': {
  title: 'Avoidance or evasion?',
  q: UL([
    '(a) A company sets up a subsidiary in a low-tax country to cut its tax bill, following all the rules',
    '(b) A shop owner leaves cash sales off the tax return',
    '(c) A company claims a deduction for an expense it knows is not deductible',
  ]),
  req: 'Classify each as tax avoidance or tax evasion.',
  steps: [
    { d: '(a) <b>Avoidance</b>', w: 'It is within the law, so it’s avoidance. The risk is to reputation (“not paying a fair share”), not prosecution.' },
    { d: '(b) <b>Evasion</b>', w: 'Deliberately hiding income breaks the law.' },
    { d: '(c) <b>Evasion</b>', w: 'They <i>know</i> it isn’t deductible, so it’s a deliberate false claim. An honest mistake would not be evasion.' },
  ],
  pattern: 'Legal = avoidance (reputational risk). Deliberately illegal = evasion (prosecution, fines).',
},

'c1-c18': {
  title: 'Delta Co: tax on trading profit',
  q: UL([
    'Profit before tax (PBT): <b>$450,000</b>. This figure includes:' + UL(['<b>$25,000</b> dividends received, which are <b>exempt</b> from tax', '<b>$8,000</b> client entertaining, which is <b>not allowable</b> for tax', '<b>$60,000</b> accounting depreciation']),
    'Tax depreciation (allowed by the tax authority): <b>$72,000</b>',
    'Tax rate: <b>25%</b>',
  ]),
  req: 'Calculate Delta Co’s tax payable.',
  steps: [
    { d: 'Adjust PBT to taxable profit:' + T([['PBT', '450,000'], ['− exempt dividends', '(25,000)'], ['+ client entertaining', '8,000'], ['+ accounting depreciation', '60,000'], ['− tax depreciation', '(72,000)'], ['Taxable profit', '421,000']], { tot: true }),
      w: 'For each item, ask: did it make PBT too high or too low for tax? Exempt income is in PBT but isn’t taxed, so take it out. Entertaining was deducted but isn’t allowed, so add it back. Swap the company’s depreciation for the tax authority’s.' },
    { d: 'Tax = 421,000 × 25% = <b>$105,250</b>', w: 'The rate is applied to taxable profit, never to PBT.' },
  ],
  pattern: 'PBT → take out income that isn’t taxed → add back costs that aren’t allowed → swap book depreciation for tax depreciation → × rate.',
},

'c1-c19': {
  title: 'Warehouse: chargeable gain',
  q: UL([
    'Warehouse sold for <b>$900,000</b>; agents’ fees on the sale <b>$18,000</b>',
    'Originally bought for <b>$500,000</b> plus <b>$12,000</b> legal costs',
    'Later extension cost <b>$80,000</b>',
    'Indexation factor: <b>0.10</b>, applying to all allowable costs',
  ]),
  req: 'Calculate the chargeable gain.',
  steps: [
    { d: 'Net proceeds = 900,000 − 18,000 = <b>882,000</b>', w: 'Selling costs reduce what you actually got from the sale.' },
    { d: 'Allowable costs = 500,000 + 12,000 + 80,000 = <b>592,000</b>', w: 'Purchase price, the costs of buying, and enhancement spending (the extension) all count as cost.' },
    { d: 'Indexation = 10% × 592,000 = <b>59,200</b>', w: 'Indexation removes the part of the gain caused only by inflation. Here it applies to all allowable costs.' },
    { d: 'Gain = 882,000 − 592,000 − 59,200 = <b>$230,800</b>', w: 'Net proceeds less costs less indexation.' },
  ],
  pattern: 'Net proceeds − (cost + buying costs + enhancement) − indexation = gain.',
},

/* ---------------- Chapter 2 ---------------- */
'c2-c05': {
  title: 'Orbit Co, tax payable for 20X2',
  q: UL([
    'Machine bought March 20X1 for <b>$80,000</b>',
    '<b>Company’s accounts:</b> depreciated at <b>12.5% straight line</b> on cost',
    '<b>Tax rules:</b> tax depreciation at <b>25% reducing balance</b>, with a full year given in the year of purchase',
    '<b>20X2 profit before tax (PBT): $240,000</b>. This figure includes:' + UL(['<b>$12,000</b> interest received, which is <b>exempt</b> from tax', '<b>$6,000</b> political donations, which are <b>not allowable</b> for tax']),
    '<b>Tax rate: 25%</b>',
  ]),
  req: 'Calculate Orbit Co’s tax payable for 20X2.',
  steps: [
    { d: 'Tax depreciation for 20X1 = 25% × 80,000 = 20,000. TWDV left = <b>60,000</b>', w: 'Reducing balance charges 25% on what’s left, so you need 20X1 to get the 20X2 starting point.' },
    { d: 'Tax depreciation for 20X2 = 25% × 60,000 = <b>15,000</b>', w: '25% of the balance left, not of the original cost.' },
    { d: 'Book depreciation for 20X2 = 12.5% × 80,000 = <b>10,000</b>', w: 'Already deducted in PBT, so it has to be undone.' },
    { d: 'Adjust PBT to taxable profit:' + T([['PBT', '240,000'], ['− exempt interest', '(12,000)'], ['+ political donations', '6,000'], ['+ book depreciation', '10,000'], ['− tax depreciation', '(15,000)'], ['Taxable profit', '229,000']], { tot: true }),
      w: 'Interest isn’t taxed, so take it out. Donations aren’t allowable, so add them back. Swap the company’s depreciation for the tax authority’s.' },
    { d: 'Tax = 229,000 × 25% = <b>$57,250</b>', w: 'Rate × taxable profit.' },
  ],
  pattern: 'PBT → take out income that isn’t taxed → add back costs that aren’t allowed → swap book depreciation for tax depreciation → × rate.',
},

'c2-c06': {
  title: 'Tax rate change mid-year',
  q: UL([
    'Company’s accounting year: <b>1 October 20X1 to 30 September 20X2</b>',
    'Taxable profit for the year: <b>$600,000</b>, earned evenly through the year',
    'Tax rate: <b>20%</b> up to 31 March 20X2, then <b>22%</b> from 1 April 20X2',
  ]),
  req: 'Calculate the tax payable for the year.',
  steps: [
    { d: 'Months at 20%: October to March = <b>6</b>. Months at 22%: April to September = <b>6</b>', w: 'Count from the company’s own year start (1 October), not from January.' },
    { d: '600,000 × 6/12 × 20% = <b>60,000</b>', w: 'Profit is earned evenly, so 6/12 of it falls in the old-rate period.' },
    { d: '600,000 × 6/12 × 22% = <b>66,000</b>', w: 'The other 6/12 is taxed at the new rate.' },
    { d: 'Total = 60,000 + 66,000 = <b>$126,000</b>', w: 'Add the two parts.' },
  ],
  pattern: 'Split the company’s year at the change date, then taxable profit × (months/12) × rate for each part, and add.',
},

'c2-c08': {
  title: 'Orbit Co sells the machine',
  q: UL([
    'Machine cost <b>$80,000</b>. Two years of book depreciation at <b>$10,000</b> a year have been charged',
    'Tax written-down value (TWDV) at the date of sale: <b>$45,000</b>',
    'Sold on 1 January 20X3 for <b>$50,000</b> (no depreciation of either kind in 20X3)',
    '20X3 accounting profit, after the profit or loss on disposal: <b>$200,000</b>',
    'No other adjustments',
  ]),
  req: 'Calculate the taxable profit for 20X3.',
  steps: [
    { d: 'Carrying amount = 80,000 − 20,000 = 60,000. Accounting loss = 50,000 − 60,000 = <b>(10,000)</b> → add back', w: 'The accounting loss is the company’s version of the result on sale. Tax ignores it, so it is undone. It reduced profit, so add it back.' },
    { d: 'Balancing charge = 50,000 − 45,000 = <b>5,000</b> → add', w: 'The tax result on sale: proceeds above TWDV means too much tax depreciation was given over the years, so the excess is clawed back (taxed).' },
    { d: 'Taxable profit = 200,000 + 10,000 + 5,000 = <b>$215,000</b>', w: 'Swap the accounting result on disposal for the tax result.' },
    { d: 'Shortcut: 200,000 + carrying amount 60,000 − TWDV 45,000 = 215,000 ✓', w: 'The proceeds cancel out, so with no other items it’s just PBT + carrying amount − TWDV.' },
  ],
  pattern: 'Undo the accounting profit/loss on disposal, then apply the tax result: proceeds − TWDV (positive = balancing charge, add; negative = balancing allowance, deduct).',
},

'c2-c10': {
  title: 'Trading loss: back one year, then forward',
  q: UL([
    'Loss rules: a trading loss is carried back <b>one year</b> first, then any balance is carried <b>forward</b>. Relief must use the whole of a year’s profit',
    'Year 1 profit: <b>30,000</b>',
    'Year 2 loss: <b>(70,000)</b>',
    'Year 3 profit: <b>20,000</b>',
    'Year 4 profit: <b>50,000</b>',
  ]),
  req: 'Calculate the taxable profit for each year after loss relief.',
  steps: [
    { d: 'Year 1: use 30,000 → taxable <b>0</b>. Loss left: 70,000 − 30,000 = 40,000', w: 'Carry back first. Relief takes the whole year’s profit; you can’t keep some taxable.' },
    { d: 'Year 3: use 20,000 → taxable <b>0</b>. Loss left: 20,000', w: 'The remainder now goes forward, to the next year first.' },
    { d: 'Year 4: 50,000 − 20,000 → taxable <b>30,000</b>. Loss left: 0', w: 'The last of the loss is used here.' },
  ],
  pattern: 'Keep a running “loss left” balance. Wipe out each year’s profit in the order the rules allow until the balance hits zero.',
},

'c2-c11': {
  title: 'Terminal loss carried back',
  q: UL([
    'Trade ceases in 20X4 with a loss of <b>(60,000)</b>',
    'Rules: a terminal loss is carried back up to <b>3 years</b>, latest year first',
    'Earlier profits: 20X1 <b>40,000</b>; 20X2 <b>25,000</b>; 20X3 <b>15,000</b>',
  ]),
  req: 'Calculate the revised taxable profit for each year.',
  steps: [
    { d: '20X3: use 15,000 → <b>0</b>. Loss left 45,000', w: 'Terminal relief starts with the most recent year (LIFO).' },
    { d: '20X2: use 25,000 → <b>0</b>. Loss left 20,000', w: 'Then go back one year.' },
    { d: '20X1: 40,000 − 20,000 → <b>20,000</b>. Loss left 0', w: 'Only part of 20X1 is needed. If any loss were still left after 3 years, it would be lost.' },
  ],
  pattern: 'Start at the latest year, wipe it out, move back a year, and stop when the loss is used up or you hit the time limit.',
},

'c2-c13': {
  title: 'Delta Co building: gain with indexation',
  q: UL([
    'Building bought for <b>$400,000</b> plus <b>$8,000</b> legal fees',
    'Extension added later for <b>$60,000</b>',
    'Storm damage repair: <b>$15,000</b>',
    'Sold for <b>$900,000</b>, less agent’s fee of <b>$12,000</b>',
    'Indexation factors: purchase date → sale <b>25%</b>; extension date → sale <b>10%</b>',
    'Tax rate on gains: <b>25%</b>',
  ]),
  req: 'Calculate the tax on the gain.',
  steps: [
    { d: 'Net proceeds = 900,000 − 12,000 = <b>888,000</b>', w: 'The selling fee reduces proceeds.' },
    { d: 'Allowable costs = 408,000 (cost + legal) + 60,000 (extension) = <b>468,000</b>. Repair ignored', w: 'The extension improves the asset (enhancement), so it counts. A repair only restores it, so it’s a revenue cost, not a capital cost.' },
    { d: 'Indexation = 408,000 × 25% + 60,000 × 10% = 102,000 + 6,000 = <b>108,000</b>', w: 'Each cost is indexed from its own date. The legal fees share the purchase date.' },
    { d: 'Gain = 888,000 − 468,000 − 108,000 = <b>312,000</b>', w: 'Net proceeds less costs less indexation.' },
    { d: 'Tax = 312,000 × 25% = <b>$78,000</b>', w: 'Rate × gain.' },
  ],
  pattern: 'Net proceeds − capital costs (not repairs) − indexation (each cost × its own factor) = gain; × rate.',
},

'c2-c14': {
  title: 'Capital loss carried forward',
  q: UL([
    'Rules: capital losses can be used in the <b>same year</b> or carried <b>forward</b> only',
    'Year 1 gain: <b>10,000</b>',
    'Year 2 loss: <b>(15,000)</b>',
    'Year 3 gain: <b>6,000</b>',
    'Year 4 gain: <b>12,000</b>',
  ]),
  req: 'Calculate the taxable gain for each year.',
  steps: [
    { d: 'Year 1: <b>10,000</b> taxable, unchanged', w: 'A later loss can’t go back to an earlier year under these rules.' },
    { d: 'Year 3: use 6,000 → <b>0</b>. Loss left 9,000', w: 'Carry forward to the next gain first.' },
    { d: 'Year 4: 12,000 − 9,000 = <b>3,000</b>', w: 'The rest of the loss is used here.' },
  ],
  pattern: 'Capital losses only go forward (unless told otherwise). Use them against the next gains until they’re gone.',
},

'c2-c15': {
  title: 'Rollover relief: three reinvestment amounts',
  q: UL([
    'A business asset is sold for <b>$250,000</b>, making a gain of <b>$40,000</b>',
    'Rollover relief is available on reinvestment in a replacement business asset',
    'Three cases: the company reinvests (a) <b>$260,000</b>; (b) <b>$230,000</b>; (c) <b>$200,000</b>',
  ]),
  req: 'For each case, calculate the gain taxed now and the gain deferred.',
  steps: [
    { d: '(a) Kept back = 250,000 − 260,000 → none. Taxed now <b>0</b>; deferred <b>40,000</b>', w: 'All proceeds reinvested, so the whole gain is postponed.' },
    { d: '(b) Kept back = 250,000 − 230,000 = 20,000. Taxed now <b>20,000</b>; deferred <b>20,000</b>', w: 'Cash not reinvested is taxed now, up to the size of the gain.' },
    { d: '(c) Kept back = 50,000, but capped at the 40,000 gain. Taxed now <b>40,000</b>; deferred <b>0</b>', w: 'You can’t tax more than the gain itself.' },
  ],
  pattern: 'Taxed now = the lower of the gain and (proceeds − amount reinvested). Deferred = the rest of the gain, taken off the cost of the new asset.',
},

/* ---------------- Chapter 3 ---------------- */
'c3-c04': {
  title: 'Nova Ltd: where is it resident?',
  q: UL([
    'Nova Ltd is incorporated in <b>country P</b>',
    'Its factories and sales are in <b>country Q</b>',
    'Its board meets and makes strategic decisions in <b>country R</b>',
    'All three countries use OECD-model treaties, and more than one treats Nova as resident',
  ]),
  req: 'State Nova Ltd’s country of residence.',
  steps: [
    { d: 'P (incorporation) is <b>not decisive</b>', w: 'With dual residence, the OECD tie-breaker overrides incorporation.' },
    { d: 'Q (trading) is <b>not a residence test</b>', w: 'Where profits are made doesn’t decide residence.' },
    { d: 'Resident in <b>R</b>', w: 'The tie-breaker is place of effective management: where the board makes the key decisions.' },
  ],
  pattern: 'Two countries claim residence → look for where the board actually makes its decisions.',
},

'c3-c06': {
  title: 'Foreign income: the three reliefs compared',
  q: UL([
    'Foreign income: <b>100,000</b>',
    'Foreign tax rate: <b>20%</b>',
    'Home tax rate: <b>30%</b>',
  ]),
  req: 'Calculate the total tax under (a) exemption, (b) credit relief and (c) deduction relief.',
  steps: [
    { d: '(a) Exemption: foreign tax 20,000; home tax 0. Total <b>20,000</b>', w: 'The home country doesn’t tax the income at all.' },
    { d: '(b) Credit: home tax 30% × 100,000 = 30,000 − credit 20,000 = 10,000. Total <b>30,000</b>', w: 'Foreign tax is taken off the home tax bill, so the total ends up at the higher of the two rates.' },
    { d: '(c) Deduction: home tax 30% × (100,000 − 20,000) = 24,000. Total 20,000 + 24,000 = <b>44,000</b>', w: 'Foreign tax is treated like an expense: it only reduces the income home tax is charged on, so you pay tax on tax.' },
  ],
  pattern: 'Exemption = foreign tax only. Credit = higher rate × income. Deduction = foreign tax + home rate × (income − foreign tax).',
},

'c3-c09': {
  title: 'HomeCo’s dividend from OverCo',
  q: UL([
    'HomeCo owns <b>100%</b> of overseas subsidiary OverCo',
    'OverCo: PBT <b>500,000</b>; tax <b>125,000</b>; profit after tax (PAT) <b>375,000</b>',
    'OverCo pays a dividend of <b>150,000</b> to HomeCo',
    'Withholding tax (WHT) on the dividend: <b>10%</b>',
  ]),
  req: 'Calculate the WHT, the underlying tax (UT), the cash HomeCo receives, the total foreign tax suffered and the gross foreign income for home tax.',
  steps: [
    { d: 'WHT = 150,000 × 10% = <b>15,000</b>', w: 'Tax taken off the dividend as it leaves the country.' },
    { d: 'UT = 150,000 × 125,000 / 375,000 = <b>50,000</b>', w: 'The share of OverCo’s own tax that relates to the profit paid out. The dividend is paid from PAT, so divide by PAT, not PBT.' },
    { d: 'Cash received = 150,000 − 15,000 = <b>135,000</b>. Foreign tax suffered = 15,000 + 50,000 = <b>65,000</b>', w: 'WHT reduces the cash; UT was paid inside OverCo before the dividend.' },
    { d: 'Gross foreign income = 150,000 + 50,000 = <b>200,000</b>', w: 'Home tax is charged on the profit before foreign tax: dividend + UT. (WHT is already inside the 150,000.)' },
  ],
  pattern: 'WHT = dividend × w. UT = dividend × tax/PAT. Gross income = dividend + UT. Foreign tax = WHT + UT.',
},

'c3-c10': {
  title: 'HomeCo: credit relief on the dividend',
  q: UL([
    'Gross foreign income from OverCo: <b>200,000</b>',
    'Foreign tax suffered (WHT + underlying tax): <b>65,000</b>',
    'Case (a): HomeCo’s home tax rate is <b>30%</b>',
    'Case (b): HomeCo’s home tax rate is <b>40%</b>',
  ]),
  req: 'For each case, calculate the double tax relief (DTR) and the home tax payable.',
  steps: [
    { d: '(a) Home tax = 200,000 × 30% = 60,000. DTR = lower of 65,000 and 60,000 = 60,000. Payable <b>0</b>', w: 'Relief can’t exceed the home tax bill. The extra 5,000 of foreign tax is unrelieved: it is simply lost.' },
    { d: '(b) Home tax = 200,000 × 40% = 80,000. DTR = 65,000. Payable = <b>15,000</b>', w: 'Foreign tax is lower than home tax, so it’s fully relieved and HomeCo tops up to the home rate.' },
  ],
  pattern: 'Home tax = gross income × home rate. DTR = the lower of the foreign tax and the home tax. Payable = home tax − DTR.',
},

'c3-c11': {
  title: 'Alpha and Beta: transfer pricing adjustment',
  q: UL([
    'Alpha (tax rate <b>30%</b>) sells <b>10,000</b> units to its subsidiary Beta (tax rate <b>10%</b>)',
    'Transfer price: <b>$4</b> per unit',
    'Arm’s-length (market) price: <b>$9</b> per unit',
  ]),
  req: 'Calculate the transfer pricing adjustment and say which company it applies to.',
  steps: [
    { d: 'Profit shifted = 10,000 × (9 − 4) = <b>$50,000</b>', w: 'Selling below market moves profit from Alpha to Beta, where the tax rate is lower.' },
    { d: 'Increase <b>Alpha’s</b> taxable profit by $50,000', w: 'The authority adjusts the company that under-charged and so paid less tax than it should.' },
  ],
  pattern: 'Adjustment = quantity × (market price − transfer price), added to the company that under-charged.',
},

/* ---------------- Chapter 5 ---------------- */
'c5-c06': {
  title: 'Which threat?',
  q: UL([
    '(a) The MD tells a trainee that profit is “too low” and must rise by $300,000',
    '(b) A trainee compiles staff performance scores, including her own. The scores set bonuses',
    '(c) Sales staff hint that office life will get difficult unless Sam inflates the figures. Sam gets no bonus from the figures',
  ]),
  req: 'Identify the main threat to compliance with the code of ethics in each case.',
  steps: [
    { d: '(a) <b>Intimidation</b>', w: 'Pressure from a senior person.' },
    { d: '(b) <b>Self-interest</b>', w: 'Her own bonus depends on the figures she prepares.' },
    { d: '(c) <b>Intimidation</b>, not self-interest', w: 'He is under pressure but gains nothing personally. With no personal gain, it can’t be self-interest.' },
  ],
  pattern: 'Pressure → intimidation. Personal gain → self-interest. Checking your own work → self-review. Close relationship or gifts → familiarity. Arguing someone’s case → advocacy.',
},

'c5-c09': {
  title: 'Month-end pressure',
  q: UL([
    'You are a management accountant',
    'The operations director asks you to move <b>£60,000</b> of this month’s repair costs into next month “so the division hits budget”',
    'He says he will “remember who helped”',
  ]),
  req: 'Identify the principles at risk and the threats, and say what you should do.',
  steps: [
    { d: '<b>Principles at risk:</b> integrity; professional competence and due care; objectivity', w: 'Moving the costs makes the figures misleading (integrity) and breaks accruals accounting (competence and due care). His influence affects your judgement (objectivity).' },
    { d: '<b>Threats:</b> intimidation and self-interest', w: 'A senior person is pressuring you (intimidation), and “remember who helped” implies a reward (self-interest).' },
    { d: '<b>Action:</b> refuse, explain the accounting requirement, and record the request and your reply in writing', w: 'Deal with it yourself first, and keep evidence.' },
    { d: '<b>If the pressure continues:</b> escalate to the finance director or audit committee, or use whistleblowing. Go outside the company only after internal routes fail and after legal advice', w: 'Exhaust internal routes before external ones.' },
  ],
  pattern: 'Principles at risk → threats → refuse and document → escalate internally → external only as a last resort.',
},

/* ---------------- Chapter 6 ---------------- */
'c6-c16': {
  title: 'Halden plc: spot the governance weaknesses',
  q: UL([
    'Halden plc is a listed company',
    'The founder is both <b>chair and CEO</b>',
    'The board has <b>six executives</b> and <b>two non-executive directors (NEDs)</b>; both NEDs are his former business partners',
    'The CEO <b>sets his own bonus</b>',
    'There is <b>no audit committee</b>',
  ]),
  req: 'Identify each weakness and recommend how to fix it.',
  steps: [
    { d: 'Chair = CEO → appoint an <b>independent chair</b>', w: 'One person running both the board and the company has too much power.' },
    { d: '2 NEDs out of 8 → recruit more <b>independent NEDs</b> and a <b>senior independent director</b>', w: 'Good practice is at least half the board, excluding the chair, independent NEDs.' },
    { d: 'NEDs are ex-partners → replace them or add <b>genuinely independent</b> NEDs', w: 'A close past relationship (familiarity) means they aren’t independent.' },
    { d: 'CEO sets his own pay → <b>remuneration committee</b> of independent NEDs', w: 'No one should decide their own pay.' },
    { d: 'No audit committee → set one up (<b>3 independent NEDs, one with financial expertise</b>). Explain any remaining departures in the annual report', w: 'Without one, nobody independent oversees financial reporting or the auditors. “Comply or explain” covers anything not fixed.' },
  ],
  pattern: 'Check four things: chair/CEO split, board balance and independence, who sets pay, and whether the committees exist.',
},
};
