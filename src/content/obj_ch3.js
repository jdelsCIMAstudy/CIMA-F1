// Objective kit questions for Chapter 3 (International taxation)
const { O, dd } = require('../h.js');
const a = ['C3a'], ab = ['C3a', 'C3b'];
const resOpts = (o) => o;
module.exports = [
{ after: 'c3-c02', items: [
O(59, { lo: a, q: 'Which is not used to decide corporate residence?', opts: ['Where control is exercised', 'Where it was incorporated', 'Where board meetings are held', 'Where most goods are sold'], a: 3,
  sol: ['Residence tests look at incorporation and where central management and control sits (board meetings).', 'Where sales happen is not a residence test.'], trap: 'Thinking the main market decides residence. It might create a permanent establishment, but not residence.',
  alt: [{ q: 'Which IS normally used to decide corporate residence?', opts: ['Where most customers are', 'Where most staff are employed', 'Where central management and control is exercised', 'Where the shares are listed'], a: 2, sol: ['Place of central management and control (and, in many countries, incorporation).'], trap: 'A stock exchange listing says nothing about residence.' }] }),
]},
{ after: 'c3-c03', items: [
O(13, { lo: a, type: 'multi', q: 'Select TWO. Under the OECD model, which are permanent establishments?', opts: ['An office from which the business is managed', 'A depot used only to store goods', 'A separately incorporated subsidiary', 'A mine', 'A building project lasting eight months'], a: [0, 3],
  sol: ['PEs include a place of management, office, branch, factory, workshop and mine or quarry.', 'Storage-only facilities are excluded; a subsidiary is a separate person; building sites count only if they last more than 12 months.'], trap: 'The building project: under 12 months, so not a PE.' }),
O(53, { lo: a, p: { m: 10 }, v: { m: [[3, 6, 8, 10, 11]] }, q: 'Which is not a permanent establishment under the OECD model?', opts: ['A branch', 'A workshop', 'A gas well', 'A construction site lasting {m} months'], a: 3,
  sol: ['A construction site is a PE only if it lasts more than 12 months. {m} months is too short.'], trap: 'A gas well looks unusual, but wells, mines and quarries are all on the list.',
  alt: [{ q: 'Which IS a permanent establishment under the OECD model?', opts: ['A warehouse used only to store goods', 'A construction site lasting {m} months', 'A quarry', 'A facility used only to display goods'], a: 2, sol: ['Quarries are listed PEs. Storage-only and display-only facilities, and short sites, are not.'], trap: 'The construction site is under 12 months.' }] }),
]},
{ after: 'c3-c04', items: [
O(32, { lo: a, ...dd('Under the OECD model an entity is generally resident in the country of its ______.', ['effective management', 'incorporation', 'highest revenue'], 0),
  sol: ['The OECD tie-breaker for companies is the place of effective management.'], trap: 'Incorporation is a domestic test in many countries, but the treaty tie-breaker is effective management.' }),
O(58, { lo: a, ...dd('Under the OECD model, a company is resident in the country of ______.', ['incorporation', 'directors\' homes', 'effective management', 'main production'], 2),
  sol: ['Effective management: where key management and commercial decisions are made.'], trap: 'Where directors live is not the test; where they meet and decide is.' }),
O(60, { lo: a, q: 'A company is incorporated in Country 1, trades in Country 2 and is managed and controlled from Country 3 (OECD treaties). Where is it resident?', opts: ['Country 1', 'Country 2', 'Country 3', 'Countries 2 and 3'], a: 2, fixed: true,
  sol: ['Place of effective management decides: Country 3.'], trap: 'Picking the trading country. Trading there may create a PE, not residence.',
  alt: [{ q: 'A company is incorporated in Country 1, is managed and controlled from Country 2, and trades in Country 3 (OECD treaties). Where is it resident?', a: 1, sol: ['Effective management is in Country 2, so it is resident there.'], trap: 'Country 1 (incorporation) loses to effective management under the tie-breaker.' }] }),
O(63, { lo: a, q: 'A company trades in P, is incorporated in Q, is controlled from R (no sales there) and is listed in S. Where is it resident?', opts: ['P', 'Q', 'R', 'S'], a: 2, fixed: true,
  sol: ['Control (effective management) is in R, so R, even with no sales there.'], trap: 'Thinking residence needs trade in that country.',
  alt: [{ q: 'A company trades in P, is controlled from Q, is incorporated in R and is listed in S. Where is it resident?', a: 1, sol: ['Control is in Q.'], trap: 'Listing location is irrelevant.' }] }),
O(86, { lo: a, q: 'A company is incorporated in X, managed and controlled from Y (no sales there), and trades in Z. Where is it resident under OECD rules?', opts: ['X', 'Y', 'Z', 'Y and Z'], a: 1, fixed: true,
  sol: ['Effective management in Y decides.'], trap: 'D: a company has one treaty residence after the tie-breaker.' }),
]},
{ after: 'c3-c05', items: [
O(62, { lo: a, q: 'Double tax relief aims to:', opts: ['Make sure no income is ever taxed twice', 'Reduce the double taxation of overseas income', 'Stop domestic group dividends being taxed twice', 'Help companies paying tax at double rates'], a: 1,
  sol: ['DTR reduces (mitigates) tax paid twice on overseas income. It often doesn\'t remove it completely, e.g. when foreign tax exceeds home tax.'], trap: 'A is too strong: "ever" and "no income" overclaim.' }),
O(3, { lo: a, type: 'multi', q: 'Select TWO. Which are recognised ways of giving double tax relief?', opts: ['Exempting the foreign income from home-country tax', 'Deducting the foreign tax from the foreign income before home tax is charged', 'Carrying a trading loss back', 'Withholding relief', 'Group relief'], a: [0, 1],
  sol: ['The three methods: exemption, deduction and credit. Credit relief isn\'t offered here.'], trap: '"Withholding relief" isn\'t a thing. Withholding tax is what creates the double tax.' }),
O(65, { lo: a, type: 'multi', q: 'Select TWO. Which are methods of double tax relief?', opts: ['Credit relief', 'Deduction relief', 'Trading loss relief', 'Group relief', 'Rollover relief'], a: [0, 1],
  sol: ['Exemption, deduction and credit are the three DTR methods.'], trap: 'Group and rollover relief are domestic reliefs, not DTR.' }),
]},
{ after: 'c3-c07', items: [
O(54, { lo: a, q: 'Which does not usually apply to an overseas branch?', opts: ['Assets can be moved to it without a gain', 'Tax is charged only on profits sent home', 'Tax depreciation can be claimed on its assets', 'Its losses can be set against the company\'s other income at once'], a: 1,
  sol: ['A branch is part of the company, so all its profits are taxed at home as they arise, whether or not they are remitted.'], trap: 'B describes a subsidiary: only dividends sent home are taxed.',
  alt: [{ q: 'Which usually applies to an overseas subsidiary but not to a branch?', opts: ['Its losses are set against the parent\'s profits at once', 'Only dividends it pays to the parent are taxed at home', 'Assets can be moved to it without a gain', 'The parent claims tax depreciation on its assets'], a: 1, sol: ['A subsidiary is a separate company; home tax falls only on dividends remitted.'], trap: 'A, C and D describe a branch.' }] }),
O(82, { lo: a, q: 'Which is an advantage of trading abroad through a subsidiary rather than a branch?', opts: ['Losses abroad are available to the group at once', 'Only dividends received from the subsidiary are taxed at home', 'All overseas profits are taxed at home', 'Tax depreciation can be claimed on the foreign assets'], a: 1,
  sol: ['A subsidiary\'s profits are taxed abroad; home tax only falls on dividends sent home, so tax can be deferred.'], trap: 'A and D are branch advantages.' }),
]},
{ after: 'c3-c08', items: [
O(55, { lo: a, q: 'A withholding tax is:', opts: ['Tax kept back from the authority', 'Tax paid less an amount held back', 'Tax deducted at source from interest or dividends', 'Tax on increases in investment values'], a: 2,
  sol: ['Withholding tax is deducted at source by the payer (e.g. on dividends sent abroad) and paid to that country\'s authority.'], trap: '"Withheld" doesn\'t mean kept from the authority.' }),
O(61, { lo: a, p: { rc: 72000, wh: 8000 }, v: { rc: [20000, 200000, 1000], wh: [1000, 30000, 500] }, c: 'wh<rc*0.4', q: 'A company owns 30% of a foreign company and receives a ${rc} dividend after ${wh} was deducted abroad. The ${wh} is:', opts: ['Corporate income tax', 'Underlying tax', 'Capital tax', 'Withholding tax'], a: 3, fixed: true,
  sol: ['Tax deducted from the dividend on payment = withholding tax.', 'Underlying tax is the tax already paid on the profits the dividend came out of.'], trap: 'Underlying tax isn\'t deducted from the dividend; it is embedded in the profits.' }),
O(64, { lo: a, p: { pf: 500000, tx: 125000, gd: 200000, w: 0.15 }, v: { pf: [200000, 900000, 10000], tx: [40000, 250000, 5000], gd: [50000, 300000, 10000], w: [[0.05, 0.1, 0.15, 0.2]] }, c: 'tx<pf*0.4 && gd<pf-tx', q: 'A subsidiary makes ${pf} profit, pays ${tx} tax and pays a gross dividend of ${gd} to its overseas parent, deducting {w%} on payment. The {w%} is:', opts: ['Underlying tax', 'Corporate income tax', 'Foreign tax', 'Withholding tax'], a: 3, fixed: true,
  sol: ['Deducted on payment of the dividend = withholding tax.', 'The ${tx} on profits gives rise to underlying tax on the dividend.'], trap: 'Picking "foreign tax": both are foreign taxes; the specific term is withholding tax.',
  alt: [{ q: 'A subsidiary makes ${pf} profit, pays ${tx} tax and pays a gross dividend of ${gd} to its overseas parent, deducting {w%} on payment. The share of the ${tx} that relates to the dividend is called:', a: 0, sol: ['Tax on the profits out of which the dividend is paid = underlying tax.', 'Here: {gd} ÷ {=pf-tx} × {tx} = {=gd/(pf-tx)*tx#0}.'], trap: 'Withholding tax is the deduction on payment, not the tax on profits.' }] }),
O(79, { lo: a, q: 'Underlying tax is:', opts: ['Tax deducted from a dividend before payment', 'The tax on the profits out of which a dividend is paid', 'The DTR that can be claimed', 'Home-country tax on foreign income'], a: 1,
  sol: ['Underlying tax = corporate tax paid by the subsidiary on the profits that fund the dividend.'], trap: 'A is withholding tax.',
  alt: [{ q: 'Withholding tax is:', opts: ['Tax deducted from a dividend or interest payment at source', 'The tax on the profits out of which a dividend is paid', 'The DTR that can be claimed', 'Home-country tax on foreign income'], a: 0, sol: ['Deducted by the payer when the dividend or interest is paid.'], trap: 'B is underlying tax.' }] }),
]},
{ after: 'c3-c11', items: [
O(91, { lo: ab, type: 'multi', q: 'Select TWO. Which describe transfer pricing?', opts: ['Intra-group trading not at arm\'s length, shifting profits between countries', 'It has no effect on individual company profits', 'It arises when group companies trade or lend to each other at favourable prices', 'It affects only the group\'s total profit, not where it is taxed'], a: [0, 2],
  sol: ['Transfer pricing is the price set on trade between group companies. Non-arm\'s-length prices shift profit to low-tax countries.'], trap: 'B and D are backwards: transfer pricing moves profit between companies, and so between tax jurisdictions.' }),
]},
];
