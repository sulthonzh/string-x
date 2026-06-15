import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as sx from './index.js';

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
