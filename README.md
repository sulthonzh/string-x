# string-x-utils

Stop writing the same string helpers in every project. 40+ utilities — case conversion, slugify, truncation, templates, HTML escaping, Levenshtein distance — in one tiny zero-dependency package.

## Why

Every project needs string utilities. You either pull in lodash (47KB min), write the same helpers again, or skip cleanup and ship messy strings. `string-x-utils` gives you a comprehensive toolkit in one tiny zero-dependency package.

## Install

```bash
npm install string-x-utils
```

## Quick Start

```js
import { camelCase, slugify, truncate, interpolate, escapeHtml } from 'string-x-utils';

camelCase('hello world')        // → 'helloWorld'
slugify('Café Résumé!')         // → 'cafe-resume'
truncate('Hello World', 8)      // → 'Hello W…'
interpolate('Hi {{name}}!', { name: 'Alice' })  // → 'Hi Alice!'
escapeHtml('<script>alert(1)</script>')  // → '&lt;script&gt;alert(1)&lt;/script&gt;'
```

## vs Alternatives

| Feature | string-x | lodash | voca | change-case | suckerpinch |
|---------|----------|--------|------|-------------|-------------|
| Size | ~8KB | ~47KB | ~50KB | ~5KB | ~3KB |
| Dependencies | 0 | 0 | 0 | 2 | 0 |
| Case conversion | ✅ | ✅ | ✅ | ✅ | ❌ |
| Slugify | ✅ | ❌ | ✅ | ❌ | ❌ |
| HTML escape/unescape | ✅ | ✅ | ✅ | ❌ | ❌ |
| Template interpolation | ✅ | ✅ (template) | ❌ | ❌ | ❌ |
| Levenshtein distance | ✅ | ❌ | ✅ | ❌ | ❌ |
| Truncation (smart) | ✅ | ✅ | ✅ | ❌ | ❌ |
| CLI included | ✅ | ❌ | ❌ | ❌ | ❌ |
| ESM-first | ✅ | ❌ | ❌ | ❌ | ❌ |

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

- **`pad(str, len, char=' ')`** — Center-pad to target length (multi-char safe)
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
- **`capitalizeWords(str)`** — First char of each word (respects apostrophes: `"don't"` → `"Don't"`)
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
string-x-utils camel "hello world"      # helloWorld
string-x-utils snake "HelloWorld"      # hello_world
string-x-utils kebab "HelloWorld"      # hello-world

# Slugify
string-x-utils slug "Héllo Wörld!"     # hello-world

# Truncate
echo "Hello World" | string-x-utils truncate 8   # Hello W…

# Template
string-x-utils template "Hello {{name}}" --data '{"name":"World"}'

# Escape
string-x-utils escape "<div>test</div>"

# Levenshtein
string-x-utils levenshtein kitten sitting   # 3
```

## Real-World Examples

### 1. Form Data Normalization (Express/Hono middleware)

```js
import { compact, camelCase, slugify } from 'string-x-utils';

function normalizeFormData(req, res, next) {
  for (const [key, value] of Object.entries(req.body)) {
    const normalized = compact(value);       // trim + collapse whitespace
    req.body[camelCase(key)] = normalized;
  }
  // Auto-generate slug from title
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  next();
}
```

### 2. Search Relevance Ranking

```js
import { similarity, levenshtein } from 'string-x-utils';

function searchProducts(query, products) {
  return products
    .map(p => ({
      ...p,
      score: similarity(query.toLowerCase(), p.name.toLowerCase())
    }))
    .filter(p => p.score > 0.3)
    .sort((a, b) => b.score - a.score);
}

// "laptop" matches "Laptop Pro" (0.53) better than "Lapel Pin" (0.17)
```

### 3. Email Template Rendering

```js
import { interpolate, capitalizeWords } from 'string-x-utils';

const template = `Hello {{user.firstName}},

Your order #{{order.id}} has been {{order.status}}.

Items:
{{order.items}}`;

const rendered = interpolate(template, {
  user: { firstName: 'alice' },
  order: { id: '42', status: 'shipped', items: 'Widget, Gizmo' }
});
// → "Hello alice,\n\nYour order #42 has been shipped.\n\nItems:\nWidget, Gizmo"
```

## Zero Dependencies

No deps. No sub-deps. No supply chain risk. Just one file.

## License

MIT
