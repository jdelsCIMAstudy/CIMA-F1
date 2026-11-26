# CIMA F1 study app: build kit

Live app: https://jdelscimastudy.github.io/CIMA-F1/ (GitHub user jdelsCIMAstudy, repo CIMA-F1, Pages from main / root).

The app is one offline HTML file. The engine (`engine.html`) is fixed. All content sits in one JSON block between `DATA:START` and `DATA:END`, built from `content/`.

## Files
- `engine.html`: app engine with a `__DATA__` placeholder
- `build.js`: builds `CIMA_F1_Study.html` and `dist/` (index.html, sw.js, manifest). Set `CH=ch1,ch2` to build a subset.
- `h.js`: authoring helpers: `C()` card, `Q()` chapter/practice question, `B(n)` Test Yourself bank question (id bNNN), `O(n)` objective kit question (id oNNN), `dd()` drop-down, `T()` table, `P()`, `UL()`
- `content/chN.js` (or `chN.json`): one chapter, cards `{t:'c'}` and questions `{t:'q'}` in teaching order
- `content/obj_chN.js`: objective kit questions for chapters 1–3, as `[{after: cardId, items:[...]}]`; build.js inserts each block after that card's existing questions. From Ch4 on, objective questions sit directly in chN.js.
- `content/worked.js`: every worked example, keyed by card id, in question-and-answer format: `{title, q (full question data, nothing left implied), req (Required), steps:[{d: working, w: why}], pattern}`. build.js puts each into its card and fails if any card has an old-style `ex` or a step without `d` and `w`. Keep the question complete so the steps can stay short. Test Yourself and objective questions are not affected.
- `content/glossary.js`: `{t, aka[], ch, d, see[cardIds]}`. Terms are underlined in cards automatically.
- `test_app.py`: Playwright test. Runs 60 variants per question; checks templates, duplicate options, negative answers, self-grading, expected answers (`EXP_*` and `expected_extra.json`); renders every item; tests quiz, mock, glossary, look-up (Wikipedia/Wiktionary mocked), calculator, backup. Coverage: `python3 test_app.py "<bank ranges>" "<objective ranges>"` lists missing ids.

## Rebuilding in a new session
The full source lives in the repo's `src/` folder (this file, the engine, build script, tests and all chapter content, Ch1–3 included). Clone the repo, then:
`cd src && node build.js`, then `python3 test_app.py` (needs Playwright and Chrome).
Then copy `src/dist/index.html`, `sw.js` and `manifest.webmanifest` to the repo root, commit and push.

## Question templates
`{x}` param · `{x%}` percent · `{=expr}` computed · `{=expr#2}` with 2 dp · `{?cond|yes|no}`.
Variants come from `v` (ranges `[min,max,step]` or `[[list]]`), `d` (derived values), `c` (constraint) and `alt` (logic-flipped versions). Questions with neither get a reshuffled-option variant only.
Item ids are the keys for saved progress. Never rename them.

## Coverage so far
Chapters 1–6 built. Test Yourself bank done: 001–068, 077–093, 195, 240–242, 302–325. Objective kit done: Q1–91, 95, 96, 99, 106, 110–114, 117, 119, 121, 124–132, 136–139.

Still to do, by chapter:
- Ch7 Conceptual Framework: bank 166–194, 196–201; objective 92–94, 97, 98, 100–105, 107–109, 115, 116, 118, 120, 122, 123, 133–135
- Ch8 Single entity accounts (IAS 1 / SOCIE): bank 202–209; objective 173–177
- Ch9 IAS 16 / IAS 36: bank 210–231; objective 147–162, 183, 184, 187, 190–194
- Ch10 IFRS 5: bank 094–102; objective 172, 178, 179, 181, 188
- Ch11 IFRS 16: bank 103–130; objective 195–205
- Ch12 IAS 2 / IAS 10: bank 069–076, 243, 244; objective 164–171, 180
- Ch13 IAS 7: bank 131–165; objective 140–146, 163, 182, 185, 186, 189
- Ch14–18 working capital and short-term finance: bank 232–239, 245–301; objective 206–253

## Hosting (iPhone home-screen app)
`node build.js` writes `dist/`. Copy `dist/index.html`, `dist/sw.js` and `dist/manifest.webmanifest` into the repo clone (icons and `.nojekyll` are already there), commit and push to main. The service-worker version changes with each build, so the phone picks up the new version on its next online launch. Progress (localStorage) survives updates.
