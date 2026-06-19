# Changelog

## v1.1.0 (2026-06-20)

### Bug Fixes

- **`pad()` with multi-char strings produced wrong length** — `pad('hi', 8, 'ab')` returned 14-char string instead of 8. Now slices to exact target length.
- **`padLeft()` / `padRight()` with multi-char strings** — same overflow issue. Now produces exact length.
- **`pad()` with empty char `''` returned original string** — `''.repeat(n)` = `''`, so no padding was applied. Now returns original string early.
- **`compact(null)` returned `'null'`** — `String(null)` = `'null'`. Now returns `''` for null/undefined.
- **`compact(undefined)` returned `'undefined'`** — same root cause. Fixed.
- **`trimLines(null)` returned `'null'`** — now returns `''` for null/undefined.
- **`stripWhitespace(null)` returned `'null'`** — now returns `''` for null/undefined.
- **`capitalizeWords("don't")` returned `"Don'T"`** — `\b\w` regex treated apostrophe as word boundary. Now uses `(^|\s)\w` pattern that only capitalizes after whitespace, respecting apostrophes.
- **`capitalizeWords(null)` returned `'null'`** — now returns `''` for null/undefined.
- **`truncate('hello', 0)` returned `'…'` (1 char, > maxLen)** — now returns `''`.
- **`truncate('hello', -5)` returned `'…'`** — negative maxLen now clamped to 0, returns `''`.
- **`truncate('hello', 2, '...')` returned `'..'` + `'...'`** — suffix could exceed maxLen. Now suffix is sliced to fit.

### Improvements

- Added `VERSION` export constant (`'1.1.0'`)
- Added `--version` / `-V` CLI flag
- Added `exports` field for clean ESM/CJS dual consumption
- Added `files` field (only ships index.js, cli.js, README.md, CHANGELOG.md)
- Added `engines` field (Node >=18)
- Added `prepublishOnly` script
- Added `test:core` script
- CLI help text includes version label

### Tests

- 55 new tests (52 → 107): VERSION semver, null/undefined safety for compact/trimLines/stripWhitespace/capitalizeWords, multi-char padding exact length, empty char padding, truncate zero/negative/empty-suffix/long-suffix, capitalizeWords apostrophe respect, interpolate null/undefined data/array index/deep nested/falsy values/custom regex delimiters, slugify unicode/numbers/empty/special-chars, levenshtein/similarity boundaries, words consecutive capitals/numbers/slashes, escape round-trip/numeric entities/malformed HTML, surround variants, randomString custom alphabet, chop sizes, lines \r\n, reverse emoji.

## v1.0.0 (2026-06-17)

- Initial release with 40+ string utilities: case conversion, trimming, padding, truncation, templates, slugify, HTML/RegExp escaping, validation helpers, levenshtein distance, and more.
- Zero dependencies, ESM module.
- CLI with 14+ commands.
