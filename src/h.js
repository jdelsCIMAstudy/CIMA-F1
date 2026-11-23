// Authoring helpers for content files. Output is plain HTML strings / item objects that go into the JSON data block.
const isNum = s => /^[\(\−\-]?[\d$£]/.test(String(s).trim()) && !/[a-z]{3,}/i.test(String(s));
function T(rows, o = {}) {
  let h = '<table>';
  if (o.head) h += '<tr>' + o.head.map((c, i) => `<th class="${i && (o.numcols ? o.numcols.includes(i) : true) ? 'r' : ''}">${c}</th>`).join('') + '</tr>';
  rows.forEach((r, ri) => {
    const tot = (o.tot && ri === rows.length - 1) || (o.totRows && o.totRows.includes(ri));
    h += `<tr${tot ? ' class="tot"' : ''}>` + r.map((c, i) => `<td class="${i && isNum(c) ? 'r' : ''}">${c}</td>`).join('') + '</tr>';
  });
  return h + '</table>';
}
const EQ = s => `<span class="eq">${s}</span>`;
const P = s => `<p>${s}</p>`;
const UL = a => '<ul>' + a.map(x => `<li>${x}</li>`).join('') + '</ul>';
const pad = n => String(n).padStart(3, '0');
// Objective kit question (id oNNN), Test Yourself bank question (bNNN), chapter TYU / practice question (custom id)
const O = (n, o) => Object.assign({ id: 'o' + pad(n), t: 'q', type: 'mcq', src: 'Objective Q' + n }, o);
const B = (n, o) => Object.assign({ id: 'b' + pad(n), t: 'q', type: 'mcq', src: 'Bank ' + pad(n) }, o);
const Q = (id, src, o) => Object.assign({ id, t: 'q', type: 'mcq', src }, o);
const C = (id, o) => Object.assign({ id, t: 'c' }, o);
// drop-down "complete the sentence": a one-row match question
const dd = (sentence, choices, a) => ({ type: 'match', items: [sentence], choices, a: [a] });
module.exports = { T, EQ, P, UL, O, B, Q, C, dd };
