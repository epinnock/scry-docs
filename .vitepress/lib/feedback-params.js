// What the feedback page accepts from its URL (?src=scry-sync&v=0.1.0&ref=a1b2c3d4).
// The scry-feedback Worker checks the same shapes again; a value that does not fit is dropped.
const SOURCE_RE = /^[a-z0-9][a-z0-9._-]{0,39}$/i
const VERSION_RE = /^[a-z0-9][a-z0-9._+-]{0,39}$/i
const REF_RE = /^[a-z0-9][a-z0-9_-]{0,31}$/i

function pick(params, name, re) {
  const value = (params.get(name) || '').trim()
  return re.test(value) ? value : ''
}

/** @param {string} search e.g. window.location.search */
export function parseFeedbackParams(search) {
  const params = new URLSearchParams(search)
  return {
    source: pick(params, 'src', SOURCE_RE) || 'docs',
    version: pick(params, 'v', VERSION_RE),
    ref: pick(params, 'ref', REF_RE),
  }
}

export function isValidRef(value) {
  return REF_RE.test((value || '').trim())
}
