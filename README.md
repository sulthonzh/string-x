# string-x

Zero-dependency string manipulation utilities. Case conversion, trimming, padding, truncation, templates, slugify, HTML escaping, and more.

## Why

Every project needs string utilities. You either pull in lodash (47KB min), write the same helpers again, or skip cleanup and ship messy strings. `string-x` gives you ~50 utilities in one tiny zero-dependency package.

## Install

```bash
npm install string-x
```

## Usage

```js
import { camelCase, slugify, truncate, interpolate, escapeHtml } from 'string-x';

camelCase('hello world')        // → 'helloWorld'
slugify('Café Résumé!')         // → 'cafe-resume'
truncate('Hello World', 8)      // → 'Hello W…'
interpolate('Hi {{name}}!', { name: 'Alice' })  // → 'Hi Alice!'
escapeHtml('<script>alert(1)</script>')  // → '&lt;script&gt;alert(1)&lt;/script&gt;'
```

## API

### Case Conversion

| Function | Example Input | Output |
|---|---|---|
| `camelCase` | `'foo-bar baz'` | `'fooBarBaz'` |
| `pascalCase` | `'foo-bar baz'` | `'FooBarBaz'` |
| `snakeCase` | `'fooBar baz'` | `'foo_bar_baz'` |
| `kebabCase` | `'fooBar baz'` | `'foo-bar-baz'` |
| `constantCase` | `'foo-bar'` | `'FOO_BAR'` |
| `dotCase` | `'foo bar'` | `'foo.bar'` |
| `titleCase` | `'hello world'` | `'Hello World'` |
| `sentenceCase` | `'HELLO WORLD'` | `'Hello world'` |
| `words` | `'camelCase snake_case'` | `['camel', 'Case', 'snake', 'case']` |

### Trimming & Cleaning

- **`compact(str)`** — Collapse all whitespace runs to single spaces, trim ends
- **`trimLines(str)`** — Trim each line in a multiline string
- **`stripWhitespace(str)`** — Remove ALL whitespace

### Padding

- **`pad(str, len, char=' ')`** — Center-pad to target length
- **`padLeft(str, len, char=' ')`** — Left-pad (e.g., zero-pad numbers)
- **`padRight(str, len, char=' ')`** — Right-pad

### Truncation

- **`truncate(str, maxLen, suffix='…')`** — Hard cut at maxLen
- **`prune(str, maxLen, suffix='…')`** — Cut at word boundary, cleaner results

### Search & Count

- **`count(str, substr)`** — Count non-overlapping occurrences
- **`indexOfAll(str, substr)`** — All indices of substr
- **`startsWithAny(str, prefixes[])`** — Check multiple prefixes
- **`endsWithAny(str, suffixes[])`** — Check multiple suffixes
- **`containsAny(str, substrings[])`** — Check multiple substrings

### Transform

- **`capitalize(str)`** — First character uppercase
- **`capitalizeWords(str)`** — First char of each word
- **`uncapitalize(str)`** — First character lowercase
- **`swapCase(str)`** — Swap case of all characters
- **`reverse(str)`** — Reverse (surrogate-pair safe)
- **`repeat(str, n, separator='')`** — Repeat with optional separator

### Template / Interpolation

```js
interpolate('Hello {{user.name}}, age {{user.age}}', {
  user: { name: 'Alice', age: 30 }
})
// → 'Hello Alice, age 30'

// Custom delimiters
interpolate('Hello ${name}!', { name: 'World' }, { open: '${', close: '}' })
// → 'Hello World!'

// Keep unfilled placeholders
interpolate('{{missing}}', {}, { keepUnfilled: true })
// → '{{missing}}'
```

- **`chop(str, size)`** — Split into N-char chunks
- **`lines(str)`** — Split on newlines (handles `\r\n`)

### Escape / Unescape

- **`escapeHtml(str)`** — Escape `& < > " '`
- **`unescapeHtml(str)`** — Reverse escapeHtml + numeric entities (`&#65;` → `A`)
- **`escapeRegExp(str)`** — Escape regex special characters
- **`stripTags(str)`** — Remove HTML tags

### Slugify

```js
slugify('Héllo Wörld!')        // → 'hello-world'
slugify('Foo & Bar', { separator: '_' })  // → 'foo_bar'
slugify('KeepIt', { lower: false })       // → 'KeepIt'
```

### Validation Helpers

- **`isBlank(str)`** — Empty or whitespace-only
- **`isEmpty(str)`** — Zero-length
- **`isAlpha(str)`** — Letters only
- **`isAlphanumeric(str)`** — Letters and numbers
- **`isNumeric(str)`** — Valid number string

### Misc Utilities

- **`randomString(len, alphabet)`** — Random string from alphabet
- **`levenshtein(a, b)`** — Edit distance
- **`similarity(a, b)`** — Similarity ratio (0–1)
- **`surround(str, wrapper)`** — Wrap with prefix/suffix

## CLI

```bash
# Case conversion
string-x camel "hello world"      # helloWorld
string-x snake "HelloWorld"      # hello_world
string-x kebab "HelloWorld"      # hello-world

# Slugify
string-x slug "Héllo Wörld!"     # hello-world

# Truncate
echo "Hello World" | string-x truncate 8   # Hello W…

# Template
string-x template "Hello {{name}}" --data '{"name":"World"}'

# Escape
string-x escape "<div>test</div>"

# Levenshtein
string-x levenshtein kitten sitting   # 3
```

## Zero Dependencies

No deps. No sub-deps. No supply chain risk. Just one file.

## License

MIT
