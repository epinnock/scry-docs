// Run: node --test tests/*.test.mjs
// The feedback page reads ?src=&v=&ref= from its URL. The URL is editable by anyone, so each value
// must fit a strict shape or be dropped. These shapes match the scry-feedback Worker, which checks
// them again on its side.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseFeedbackParams } from '../.vitepress/lib/feedback-params.js'

test('reads the three values the Scry Sync app sends', () => {
  assert.deepEqual(parseFeedbackParams('?src=scry-sync&v=0.1.0&ref=a1b2c3d4'), {
    source: 'scry-sync',
    version: '0.1.0',
    ref: 'a1b2c3d4',
  })
})

test('the plugin links still work and a missing ref is empty', () => {
  assert.deepEqual(parseFeedbackParams('?src=plugin-footer&v=v0.8.0-12-g1a2b3c4'), {
    source: 'plugin-footer',
    version: 'v0.8.0-12-g1a2b3c4',
    ref: '',
  })
})

test('no query string means the docs source and nothing else', () => {
  assert.deepEqual(parseFeedbackParams(''), { source: 'docs', version: '', ref: '' })
})

test('values that do not fit are dropped, not repaired', () => {
  const p = parseFeedbackParams('?src=a%60b&v=%3Cb%3E&ref=a%20b%0A%23x')
  assert.equal(p.source, 'docs')
  assert.equal(p.version, '')
  assert.equal(p.ref, '')
})

test('over-long values are dropped', () => {
  const p = parseFeedbackParams(`?src=${'a'.repeat(41)}&v=${'1'.repeat(41)}&ref=${'a'.repeat(33)}`)
  assert.deepEqual(p, { source: 'docs', version: '', ref: '' })
})

test('only the first value of a repeated parameter counts', () => {
  assert.equal(parseFeedbackParams('?ref=aaaa1111&ref=bbbb2222').ref, 'aaaa1111')
})
