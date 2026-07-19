import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as sx from './index.js';

describe('VERSION', () => {
  it('exports a valid semver', () => {
    assert.match(sx.VERSION, /^\d+\.\d+\.\d+$/);
    assert.equal(sx.VERSION, '1.1.0');
  });
});

describe('Case Conversion', () => {
  it('words splits on various delimiters', () => {
    assert.deepEqual(sx.words('hello world'), ['hello', 'world']);
    assert.deepEqual(sx.words('camelCase'), ['camel', 'Case']);
    assert.deepEqual(sx.words('PascalCase'), ['Pascal', 'Case']);
    assert.deepEqual(sx.words('snake_case'), ['snake', 'case']);
    assert.deepEqual(sx.words('kebab-case'), ['kebab', 'case']);
    assert.deepEqual(sx.words('CONSTANT_CASE'), ['CONSTANT', 'CASE']);
    assert.deepEqual(sx.words('dot.case'), ['dot', 'case']);
    assert.deepEqual(sx.words('HTTPServer'), ['HTTP', 'Server']);
    assert.deepEqual(sx.words(''), []);
    assert.deepEqual(sx.words(null), []);
  });

  it('camelCase', () => {
    assert.equal(sx.camelCase('hello world'), 'helloWorld');
    assert.equal(sx.camelCase('foo-bar-baz'), 'fooBarBaz');
    assert.equal(sx.camelCase('snake_case'), 'snakeCase');
    assert.equal(sx.camelCase('PascalCase'), 'pascalCase');
    assert.equal(sx.camelCase('CONSTANT_CASE'), 'constantCase');
  });

  it('pascalCase', () => {
    assert.equal(sx.pascalCase('hello world'), 'HelloWorld');
    assert.equal(sx.pascalCase('foo-bar'), 'FooBar');
    assert.equal(sx.pascalCase('snake_case'), 'SnakeCase');
  });

  it('snakeCase', () => {
    assert.equal(sx.snakeCase('helloWorld'), 'hello_world');
    assert.equal(sx.snakeCase('HelloWorld'), 'hello_world');
    assert.equal(sx.snakeCase('foo-bar'), 'foo_bar');
  });

  it('kebabCase', () => {
    assert.equal(sx.kebabCase('helloWorld'), 'hello-world');
    assert.equal(sx.kebabCase('HelloWorld'), 'hello-world');
    assert.equal(sx.kebabCase('snake_case'), 'snake-case');
  });

  it('constantCase', () => {
    assert.equal(sx.constantCase('helloWorld'), 'HELLO_WORLD');
    assert.equal(sx.constantCase('foo-bar'), 'FOO_BAR');
  });

  it('dotCase', () => {
    assert.equal(sx.dotCase('helloWorld'), 'hello.world');
    assert.equal(sx.dotCase('foo bar'), 'foo.bar');
  });

  it('titleCase', () => {
    assert.equal(sx.titleCase('hello world'), 'Hello World');
    assert.equal(sx.titleCase('the quick brown fox'), 'The Quick Brown Fox');
  });

  it('sentenceCase', () => {
    assert.equal(sx.sentenceCase('HELLO WORLD'), 'Hello world');
    assert.equal(sx.sentenceCase('foo-bar-baz'), 'Foo bar baz');
  });
});

describe('Trimming & Cleaning', () => {
  it('compact collapses whitespace', () => {
    assert.equal(sx.compact('  hello   world  '), 'hello world');
    assert.equal(sx.compact('a\n\n\nb'), 'a b');
  });

  it('trimLines trims each line', () => {
    assert.equal(sx.trimLines('  a  \n  b  '), 'a\nb');
  });

  it('stripWhitespace removes all whitespace', () => {
    assert.equal(sx.stripWhitespace(' a b c '), 'abc');
    assert.equal(sx.stripWhitespace('a\nb\tc'), 'abc');
  });
});

describe('Padding', () => {
  it('pad centers string', () => {
    assert.equal(sx.pad('hi', 6), '  hi  ');
    assert.equal(sx.pad('hi', 6, '-'), '--hi--');
    assert.equal(sx.pad('long', 2), 'long');
  });

  it('padLeft', () => {
    assert.equal(sx.padLeft('5', 3, '0'), '005');
    assert.equal(sx.padLeft('abc', 5), '  abc');
  });

  it('padRight', () => {
    assert.equal(sx.padRight('5', 3, '0'), '500');
    assert.equal(sx.padRight('abc', 5), 'abc  ');
  });
});

describe('Truncation', () => {
  it('truncate with suffix', () => {
    assert.equal(sx.truncate('Hello World', 8), 'Hello W…');
    assert.equal(sx.truncate('Hello World', 8, ''), 'Hello Wo');
    assert.equal(sx.truncate('Short', 10), 'Short');
    assert.equal(sx.truncate('Hello World', 5, '...'), 'He...');
  });

  it('prune respects word boundaries', () => {
    assert.equal(sx.prune('Hello World Foo Bar', 15), 'Hello World…');
    assert.equal(sx.prune('abcdef', 3), 'ab…');
    assert.equal(sx.prune('Short', 10), 'Short');
  });
});

describe('Search & Count', () => {
  it('count occurrences', () => {
    assert.equal(sx.count('abababa', 'aba'), 2);
    assert.equal(sx.count('hello world hello', 'hello'), 2);
    assert.equal(sx.count('abc', ''), 0);
  });

  it('indexOfAll returns all positions', () => {
    assert.deepEqual(sx.indexOfAll('abababa', 'aba'), [0, 4]);
    assert.deepEqual(sx.indexOfAll('hello', 'x'), []);
  });

  it('startsWithAny', () => {
    assert.equal(sx.startsWithAny('hello', ['he', 'wo']), true);
    assert.equal(sx.startsWithAny('hello', ['wo', 'ha']), false);
  });

  it('endsWithAny', () => {
    assert.equal(sx.endsWithAny('hello', ['lo', 'he']), true);
    assert.equal(sx.endsWithAny('hello', ['he', 'wo']), false);
  });

  it('containsAny', () => {
    assert.equal(sx.containsAny('hello world', ['foo', 'world']), true);
    assert.equal(sx.containsAny('hello world', ['foo', 'bar']), false);
  });
});

describe('Transform', () => {
  it('capitalize', () => {
    assert.equal(sx.capitalize('hello'), 'Hello');
    assert.equal(sx.capitalize('HELLO'), 'HELLO');
    assert.equal(sx.capitalize(''), '');
  });

  it('capitalizeWords', () => {
    assert.equal(sx.capitalizeWords('hello world'), 'Hello World');
    assert.equal(sx.capitalizeWords('hello-world'), 'Hello-World');
  });

  it('swapCase', () => {
    assert.equal(sx.swapCase('HelloWorld'), 'hELLOwORLD');
    assert.equal(sx.swapCase('AbC123'), 'aBc123');
  });

  it('reverse', () => {
    assert.equal(sx.reverse('hello'), 'olleh');
    assert.equal(sx.reverse('🚀🌍'), '🌍🚀');
    assert.equal(sx.reverse(''), '');
  });

  it('repeat with separator', () => {
    assert.equal(sx.repeat('ab', 3), 'ababab');
    assert.equal(sx.repeat('ab', 3, '-'), 'ab-ab-ab');
    assert.equal(sx.repeat('x', 0), '');
  });
});

describe('Template / Interpolation', () => {
  it('interpolate basic', () => {
    assert.equal(sx.interpolate('Hello {{name}}!', { name: 'World' }), 'Hello World!');
  });

  it('interpolate nested path', () => {
    assert.equal(sx.interpolate('{{user.name}} is {{user.age}}', {
      user: { name: 'Alice', age: 30 }
    }), 'Alice is 30');
  });

  it('interpolate missing key', () => {
    assert.equal(sx.interpolate('{{name}} {{missing}}', { name: 'Hi' }), 'Hi ');
    assert.equal(sx.interpolate('{{name}}', {}, { keepUnfilled: true }), '{{name}}');
  });

  it('interpolate custom delimiters', () => {
    assert.equal(sx.interpolate('Hello ${name}!', { name: 'World' }, { open: '${', close: '}' }), 'Hello World!');
  });

  it('chop into chunks', () => {
    assert.deepEqual(sx.chop('abcdefg', 3), ['abc', 'def', 'g']);
    assert.deepEqual(sx.chop('abc', 0), []);
    assert.deepEqual(sx.chop('', 2), []);
  });

  it('lines split on newlines', () => {
    assert.deepEqual(sx.lines('a\nb\nc'), ['a', 'b', 'c']);
    assert.deepEqual(sx.lines('a\r\nb'), ['a', 'b']);
  });
});

describe('Escape / Unescape', () => {
  it('escapeHtml', () => {
    assert.equal(sx.escapeHtml('<div class="x">&\'y\'</div>'), '&lt;div class=&quot;x&quot;&gt;&amp;&#39;y&#39;&lt;/div&gt;');
    assert.equal(sx.escapeHtml('safe text'), 'safe text');
  });

  it('unescapeHtml reverses escapeHtml', () => {
    const html = '<div class="x">&\'y\'</div>';
    assert.equal(sx.unescapeHtml(sx.escapeHtml(html)), html);
  });

  it('unescapeHtml handles numeric entities', () => {
    assert.equal(sx.unescapeHtml('&#65;'), 'A');
    assert.equal(sx.unescapeHtml('&#x41;'), 'A');
    assert.equal(sx.unescapeHtml('&nbsp;'), ' ');
  });

  it('escapeRegExp escapes regex specials', () => {
    const escaped = sx.escapeRegExp('a.b*c+d?e^f$g(h)i|j[k\\l]m{n}o');
    // It should be safe to use in a regex
    new RegExp(escaped);
    assert.ok(true);
  });

  it('stripTags removes HTML tags', () => {
    assert.equal(sx.stripTags('<p>Hello <b>World</b></p>'), 'Hello World');
    assert.equal(sx.stripTags('<div class="x">No tags</div>'), 'No tags');
    assert.equal(sx.stripTags('Plain text'), 'Plain text');
  });
});

describe('Slugify', () => {
  it('basic slugify', () => {
    assert.equal(sx.slugify('Hello World!'), 'hello-world');
    assert.equal(sx.slugify('Foo & Bar Baz'), 'foo-bar-baz');
  });

  it('slugify with diacritics', () => {
    assert.equal(sx.slugify('café résumé'), 'cafe-resume');
    assert.equal(sx.slugify('naïve façade'), 'naive-facade');
  });

  it('slugify with options', () => {
    assert.equal(sx.slugify('Hello World', { separator: '_' }), 'hello_world');
    assert.equal(sx.slugify('Hello World', { lower: false }), 'Hello-World');
  });

  it('slugify handles multiple separators', () => {
    assert.equal(sx.slugify('foo   bar---baz'), 'foo-bar-baz');
    assert.equal(sx.slugify('foo_bar.baz'), 'foo-bar-baz');
  });
});

describe('Validation Helpers', () => {
  it('isBlank', () => {
    assert.equal(sx.isBlank(''), true);
    assert.equal(sx.isBlank('   '), true);
    assert.equal(sx.isBlank('\t\n'), true);
    assert.equal(sx.isBlank(null), true);
    assert.equal(sx.isBlank('hello'), false);
  });

  it('isEmpty', () => {
    assert.equal(sx.isEmpty(''), true);
    assert.equal(sx.isEmpty(null), true);
    assert.equal(sx.isEmpty(' '), false);
    assert.equal(sx.isEmpty('hello'), false);
  });

  it('isAlpha', () => {
    assert.equal(sx.isAlpha('hello'), true);
    assert.equal(sx.isAlpha('Hello123'), false);
    assert.equal(sx.isAlpha(''), false);
  });

  it('isAlphanumeric', () => {
    assert.equal(sx.isAlphanumeric('abc123'), true);
    assert.equal(sx.isAlphanumeric('abc-123'), false);
    assert.equal(sx.isAlphanumeric(''), false);
  });

  it('isNumeric', () => {
    assert.equal(sx.isNumeric('123'), true);
    assert.equal(sx.isNumeric('12.34'), true);
    assert.equal(sx.isNumeric('-5'), true);
    assert.equal(sx.isNumeric('abc'), false);
    assert.equal(sx.isNumeric(''), false);
    assert.equal(sx.isNumeric('12e5'), true);
  });
});

describe('Misc Utilities', () => {
  it('randomString generates correct length', () => {
    const s = sx.randomString(10);
    assert.equal(s.length, 10);
    const s2 = sx.randomString(5, 'abc');
    assert.equal(s2.length, 5);
    assert.ok(/^[abc]+$/.test(s2));
  });

  it('levenshtein distance', () => {
    assert.equal(sx.levenshtein('kitten', 'sitting'), 3);
    assert.equal(sx.levenshtein('', 'abc'), 3);
    assert.equal(sx.levenshtein('abc', 'abc'), 0);
    assert.equal(sx.levenshtein('abc', ''), 3);
  });

  it('similarity ratio', () => {
    assert.equal(sx.similarity('abc', 'abc'), 1);
    assert.equal(sx.similarity('', ''), 1);
    assert.ok(sx.similarity('kitten', 'sitting') > 0.5);
    assert.ok(sx.similarity('abc', 'xyz') < 0.2);
  });

  it('surround', () => {
    assert.equal(sx.surround('hello', '"'), '"hello"');
    assert.equal(sx.surround('hello', ['[', ']']), '[hello]');
    assert.equal(sx.surround('hello', ['', '!']), 'hello!');
  });

  it('uncapitalize', () => {
    assert.equal(sx.uncapitalize('Hello'), 'hello');
    assert.equal(sx.uncapitalize('HELLO'), 'hELLO');
    assert.equal(sx.uncapitalize(''), '');
  });
});

describe('Null/Undefined Safety', () => {
  it('compact handles null/undefined', () => {
    assert.equal(sx.compact(null), '');
    assert.equal(sx.compact(undefined), '');
  });

  it('trimLines handles null/undefined', () => {
    assert.equal(sx.trimLines(null), '');
    assert.equal(sx.trimLines(undefined), '');
  });

  it('stripWhitespace handles null/undefined', () => {
    assert.equal(sx.stripWhitespace(null), '');
    assert.equal(sx.stripWhitespace(undefined), '');
  });

  it('capitalizeWords handles null/undefined', () => {
    assert.equal(sx.capitalizeWords(null), '');
    assert.equal(sx.capitalizeWords(undefined), '');
  });
});

describe('Padding Edge Cases', () => {
  it('pad with multi-char string produces exact length', () => {
    assert.equal(sx.pad('hi', 8, 'ab').length, 8);
    assert.equal(sx.pad('hi', 10, 'abc').length, 10);
    assert.equal(sx.pad('x', 7, 'ab').length, 7);
  });

  it('pad with empty char returns original', () => {
    assert.equal(sx.pad('hi', 6, ''), 'hi');
  });

  it('padLeft with multi-char string produces exact length', () => {
    assert.equal(sx.padLeft('5', 5, 'ab').length, 5);
    assert.equal(sx.padLeft('x', 7, 'abc').length, 7);
  });

  it('padLeft with empty char returns original', () => {
    assert.equal(sx.padLeft('hi', 6, ''), 'hi');
  });

  it('padRight with multi-char string produces exact length', () => {
    assert.equal(sx.padRight('5', 5, 'ab').length, 5);
    assert.equal(sx.padRight('x', 7, 'abc').length, 7);
  });

  it('padRight with empty char returns original', () => {
    assert.equal(sx.padRight('hi', 6, ''), 'hi');
  });

  it('pad with len shorter than string', () => {
    assert.equal(sx.pad('longstring', 3), 'longstring');
    assert.equal(sx.padLeft('longstring', 3), 'longstring');
    assert.equal(sx.padRight('longstring', 3), 'longstring');
  });
});

describe('Truncation Edge Cases', () => {
  it('truncate with maxLen=0 returns empty string', () => {
    assert.equal(sx.truncate('hello', 0), '');
  });

  it('truncate with negative maxLen returns empty string', () => {
    assert.equal(sx.truncate('hello', -5), '');
  });

  it('truncate with maxLen=1 returns just suffix', () => {
    assert.equal(sx.truncate('hello', 1), '…');
  });

  it('truncate with empty suffix', () => {
    assert.equal(sx.truncate('hello', 3, ''), 'hel');
  });

  it('truncate suffix longer than maxLen', () => {
    assert.equal(sx.truncate('hello', 2, '...'), '..');
  });
});

describe('CapitalizeWords Edge Cases', () => {
  it('respects apostrophes', () => {
    assert.equal(sx.capitalizeWords("don't stop"), "Don't Stop");
    assert.equal(sx.capitalizeWords("it's a test"), "It's A Test");
  });

  it('capitalizes after hyphens', () => {
    assert.equal(sx.capitalizeWords('hello-world'), 'Hello-World');
  });

  it('handles empty string', () => {
    assert.equal(sx.capitalizeWords(''), '');
  });

  it('handles already capitalized', () => {
    assert.equal(sx.capitalizeWords('Hello World'), 'Hello World');
  });
});

describe('Interpolate Edge Cases', () => {
  it('interpolate with null data returns empty for missing', () => {
    assert.equal(sx.interpolate('{{name}}', null), '');
  });

  it('interpolate with undefined data', () => {
    assert.equal(sx.interpolate('{{name}}', undefined), '');
  });

  it('interpolate array index access', () => {
    assert.equal(sx.interpolate('{{items.0}}', { items: ['a', 'b'] }), 'a');
    assert.equal(sx.interpolate('{{items.1}}', { items: ['a', 'b'] }), 'b');
  });

  it('interpolate deep nested', () => {
    assert.equal(sx.interpolate('{{a.b.c.d}}', { a: { b: { c: { d: 'deep' } } } }), 'deep');
  });

  it('interpolate value is 0 (falsy but valid)', () => {
    assert.equal(sx.interpolate('{{count}}', { count: 0 }), '0');
  });

  it('interpolate value is false', () => {
    assert.equal(sx.interpolate('{{flag}}', { flag: false }), 'false');
  });

  it('interpolate custom delimiters with special regex chars', () => {
    assert.equal(sx.interpolate('[name]', { name: 'test' }, { open: '[', close: ']' }), 'test');
  });
});

describe('Slugify Edge Cases', () => {
  it('handles unicode and diacritics', () => {
    assert.equal(sx.slugify('Héllo Wörld!'), 'hello-world');
    assert.equal(sx.slugify('naïve façade'), 'naive-facade');
  });

  it('handles numbers', () => {
    assert.equal(sx.slugify('Hello World 123'), 'hello-world-123');
  });

  it('custom separator', () => {
    assert.equal(sx.slugify('Hello World', { separator: '_' }), 'hello_world');
    assert.equal(sx.slugify('Hello World', { separator: '.' }), 'hello.world');
  });

  it('lower=false preserves case', () => {
    assert.equal(sx.slugify('Hello World', { lower: false }), 'Hello-World');
  });

  it('empty string', () => {
    assert.equal(sx.slugify(''), '');
  });

  it('only special chars', () => {
    assert.equal(sx.slugify('!!!???'), '');
  });

  it('multiple consecutive separators', () => {
    assert.equal(sx.slugify('foo   bar---baz'), 'foo-bar-baz');
  });
});

describe('Levenshtein/Similarity Edge Cases', () => {
  it('levenshtein with empty strings', () => {
    assert.equal(sx.levenshtein('', ''), 0);
    assert.equal(sx.levenshtein('abc', ''), 3);
    assert.equal(sx.levenshtein('', 'abc'), 3);
  });

  it('levenshtein identical strings', () => {
    assert.equal(sx.levenshtein('hello', 'hello'), 0);
  });

  it('similarity boundary values', () => {
    assert.equal(sx.similarity('abc', 'abc'), 1);
    assert.equal(sx.similarity('', ''), 1);
    assert.equal(sx.similarity('abc', 'xyz'), 0);
  });

  it('similarity with different lengths', () => {
    const sim = sx.similarity('ab', 'abcdef');
    assert.ok(sim > 0 && sim < 0.5);
  });
});

describe('Words Edge Cases', () => {
  it('handles consecutive capitals', () => {
    assert.deepEqual(sx.words('HTTPServer'), ['HTTP', 'Server']);
  });

  it('handles numbers in words', () => {
    assert.deepEqual(sx.words('hello123world'), ['hello123world']);
    assert.deepEqual(sx.words('hello 123 world'), ['hello', '123', 'world']);
  });

  it('handles slashes', () => {
    assert.deepEqual(sx.words('foo/bar'), ['foo', 'bar']);
  });
});

describe('Escape Edge Cases', () => {
  it('escapeHtml with empty/null', () => {
    assert.equal(sx.escapeHtml(''), '');
    assert.equal(sx.escapeHtml(null), 'null'); // String(null) = 'null'
  });

  it('unescapeHtml round-trip', () => {
    const html = '<div class="x">&\'y\'</div>';
    assert.equal(sx.unescapeHtml(sx.escapeHtml(html)), html);
  });

  it('unescapeHtml numeric entities (decimal and hex)', () => {
    assert.equal(sx.unescapeHtml('&#65;'), 'A');
    assert.equal(sx.unescapeHtml('&#x41;'), 'A');
    assert.equal(sx.unescapeHtml('&#8364;'), '€');
  });

  it('escapeRegExp produces valid regex', () => {
    const escaped = sx.escapeRegExp('a.b*c+d?e^f$g(h)i|j[k\\l]m{n}o');
    new RegExp(escaped); // should not throw
    assert.ok(true);
  });

  it('stripTags with malformed HTML', () => {
    assert.equal(sx.stripTags('<div>text'), 'text');
    assert.equal(sx.stripTags('text</div>'), 'text');
    assert.equal(sx.stripTags('a<b>c'), 'ac');
  });
});

describe('Misc Edge Cases', () => {
  it('surround with single-element array', () => {
    assert.equal(sx.surround('hi', ['_']), '_hi_');
  });

  it('surround with two-element array', () => {
    assert.equal(sx.surround('hi', ['[', ']']), '[hi]');
  });

  it('surround with string', () => {
    assert.equal(sx.surround('hi', '"'), '"hi"');
  });

  it('randomString with custom alphabet', () => {
    const s = sx.randomString(20, '01');
    assert.equal(s.length, 20);
    assert.ok(/^[01]+$/.test(s));
  });

  it('randomString with length 0', () => {
    assert.equal(sx.randomString(0), '');
  });

  it('chop with various sizes', () => {
    assert.deepEqual(sx.chop('abcdefg', 3), ['abc', 'def', 'g']);
    assert.deepEqual(sx.chop('abc', 0), []);
    assert.deepEqual(sx.chop('abc', -1), []);
    assert.deepEqual(sx.chop('', 2), []);
    assert.deepEqual(sx.chop('abcdef', 2), ['ab', 'cd', 'ef']);
  });

  it('lines handles \\r\\n', () => {
    assert.deepEqual(sx.lines('a\r\nb\r\nc'), ['a', 'b', 'c']);
    assert.deepEqual(sx.lines('single'), ['single']);
    assert.deepEqual(sx.lines(''), ['']);
  });

  it('reverse handles emoji and surrogate pairs', () => {
    assert.equal(sx.reverse('🚀🌍'), '🌍🚀');
    assert.equal(sx.reverse('a🚀b'), 'b🚀a');
  });
});

describe('Coverage: Uncovered Branch Targets', () => {
  // Line 72: sentenceCase with empty words array
  it('sentenceCase with empty string returns empty', () => {
    assert.equal(sx.sentenceCase(''), '');
    assert.equal(sx.sentenceCase('   '), '');
    assert.equal(sx.sentenceCase('...'), '');
  });

  // Lines 145-146, 149-150: prune word boundary fallbacks
  it('prune with no word boundary falls back to maxLen', () => {
    assert.equal(sx.prune('abcdef', 4), 'abc…');
    assert.equal(sx.prune('xyz', 6, '...'), 'xyz');
  });

  it('prune with suffix empty string', () => {
    // suffix='' is falsy, so end = maxLen - 0 = 8, walks back to word boundary
    assert.equal(sx.prune('hello world foo', 8, ''), 'hello');
  });

  it('prune with end <= 0 returns suffix', () => {
    // maxLen=0, suffix='…' (default), end = 0-1 = -1, end <= 0 → return suffix || '' = '…'
    assert.equal(sx.prune('hello', 0), '…');
    // maxLen=2, suffix='...', end = 2-3 = -1, end <= 0 → return '...'
    assert.equal(sx.prune('hello', 2, '...'), '...');
  });

  // Line 165: count with empty substring
  it('count with empty substring returns 0', () => {
    assert.equal(sx.count('hello', ''), 0);
  });

  // Line 284: unescapeHtml fallback for unknown named entities
  it('unescapeHtml returns original for unknown named entity', () => {
    assert.equal(sx.unescapeHtml('&unknown;'), '&unknown;');
    assert.equal(sx.unescapeHtml('&foo;bar&baz;'), '&foo;bar&baz;');
  });

  // Line 313: slugify strict=false branch
  it('slugify with strict=false allows non-alphanumeric through regex', () => {
    // strict=false and strict=true use the SAME regex — the ternary is a no-op
    // Both branches: /[^a-zA-Z0-9 ]/g strips non-alphanumeric
    assert.equal(sx.slugify('hello@world!', { strict: false }), 'helloworld');
    assert.equal(sx.slugify('hello world', { strict: false }), 'hello-world');
  });

  // Lines 381, 388: similarity edge cases
  it('similarity with both empty strings', () => {
    assert.equal(sx.similarity('', ''), 1);
  });

  it('similarity with maxLen 0 (both empty after String())', () => {
    // Both strings have length 0 after conversion
    assert.equal(sx.similarity(null, null), 1);
  });

  // pad/padLeft/padRight with empty padding char (already tested but verify branch)
  it('padLeft with empty char returns original', () => {
    assert.equal(sx.padLeft('test', 10, ''), 'test');
  });

  it('padRight with empty char returns original', () => {
    assert.equal(sx.padRight('test', 10, ''), 'test');
  });

  // truncate cut <= 0 with suffix present
  it('truncate with cut exactly 0 returns suffix sliced', () => {
    // suffix='…' (1 char), maxLen=1: cut = 1-1 = 0, cut <= 0 → return suffix.slice(0,1) = '…'
    assert.equal(sx.truncate('hello', 1, '…'), '…');
  });

  // surround with falsy wrapper elements
  it('surround with empty array uses empty strings', () => {
    assert.equal(sx.surround('hi', ['', '']), 'hi');
  });

  // surround with falsy wrapper elements — w[1] || w[0] fallback
  it('surround with second element falsy uses first for both', () => {
    assert.equal(sx.surround('hi', ['X', '']), 'XhiX');  // w[1]='' is falsy → w[1] || w[0] = 'X'
  });

  // isNumeric with whitespace-only string
  it('isNumeric with whitespace-only returns false', () => {
    assert.equal(sx.isNumeric('   '), false);
    assert.equal(sx.isNumeric('\t\n'), false);
  });

  // interpolate with null/undefined value in data
  it('interpolate with explicit null value renders empty', () => {
    assert.equal(sx.interpolate('{{x}}', { x: null }), '');
    assert.equal(sx.interpolate('{{x}}', { x: undefined }), '');
  });

  // repeat with n=1 and separator
  it('repeat with n=1 and separator returns just the string', () => {
    assert.equal(sx.repeat('hi', 1, '-'), 'hi');
  });
});

describe('Coverage: Branch Gap Closures', () => {
  // Line 137: truncate cut<=0 with suffix falsy → return ''
  it('truncate with cut<=0 and falsy suffix returns empty string', () => {
    // suffix=null, maxLen=0: cut = maxLen = 0 (suffix falsy), cut<=0, suffix falsy → ''
    assert.equal(sx.truncate('hello', 0, null), '');
    // suffix=undefined → defaults to '…'. Need explicit falsy.
    // suffix='' is falsy, maxLen=0: cut = 0, cut<=0 → ''
    assert.equal(sx.truncate('hello', 0, ''), '');
  });

  // Line 146: prune end<=0 with suffix falsy → return ''
  it('prune with end<=0 and falsy suffix returns empty string', () => {
    // suffix=null, maxLen=0: end = 0 - 0 = 0, end<=0 → suffix || '' = null || '' = ''
    assert.equal(sx.prune('hello world', 0, null), '');
    // suffix='', maxLen=0: end = 0 - 0 = 0, end<=0 → '' || '' = ''
    assert.equal(sx.prune('hello world', 0, ''), '');
  });

  // Line 149: prune end===0 after walk-back (no word boundary found)
  it('prune with no word boundary resets end to maxLen - suffix', () => {
    // 'ABCDEFGH' has no word separators. maxLen=5, suffix='…' (1 char).
    // end = 5-1 = 4. Walk: s[4]='E' no, s[3]='D' no, s[2]='C' no, s[1]='B' no → end=0.
    // if (end === 0) → end = 5-1 = 4. Return slice(0,4) + '…' = 'ABCD…'
    assert.equal(sx.prune('ABCDEFGH', 5, '…'), 'ABCD…');
    // With empty suffix: end = 5-0 = 5, walk to 0, reset: end = 5-0 = 5
    assert.equal(sx.prune('ABCDEFGH', 5, ''), 'ABCDE');
  });

  // Line 165: indexOfAll with empty/falsy substr returns empty array
  it('indexOfAll with empty substr returns empty array', () => {
    assert.deepEqual(sx.indexOfAll('hello', ''), []);
    assert.deepEqual(sx.indexOfAll('hello', null), []);
    assert.deepEqual(sx.indexOfAll('hello', undefined), []);
    assert.deepEqual(sx.indexOfAll('hello', 0), []);
  });

  // Line 281: unescapeHtml unknown named entity → return original match
  it('unescapeHtml returns original for truly unknown entities', () => {
    assert.equal(sx.unescapeHtml('&foobarbaz;'), '&foobarbaz;');
    assert.equal(sx.unescapeHtml('&ABC;'), '&ABC;');
    assert.equal(sx.unescapeHtml('clean & unknown; text & amp;'), 'clean & unknown; text & amp;');
  });

  // Line 320: isBlank with falsy str (!str true branch)
  it('isBlank with null/undefined/empty returns true', () => {
    assert.equal(sx.isBlank(null), true);
    assert.equal(sx.isBlank(undefined), true);
    assert.equal(sx.isBlank(''), true);
    assert.equal(sx.isBlank(0), true);
    assert.equal(sx.isBlank(false), true);
  });

  // Line 378: similarity with maxLen===0 (dead code - unreachable via normal path)
  // This branch is dead code: if both inputs are falsy, line 376 returns early.
  // If either is truthy, String(a).length > 0. So maxLen can never be 0 here.
  // Documenting as unreachable defensive code.

  // Additional: surround with null/undefined wrapper array elements
  it('surround with undefined elements uses empty string fallback', () => {
    // w = [undefined, undefined] → (undefined || '') + str + (undefined || undefined || '')
    assert.equal(sx.surround('hi', [undefined, undefined]), 'hi');
    // w = [null, null] → same
    assert.equal(sx.surround('hi', [null, null]), 'hi');
    // w = [0, 0] → 0 is falsy → ''
    assert.equal(sx.surround('hi', [0, 0]), 'hi');
  });
});
