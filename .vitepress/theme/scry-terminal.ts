// Shiki themes for code blocks.
// Dark mode: the dark terminal from www.scrymore.com, cream text on near-black.
// Light mode: a printed code sheet, ink on paper.
// Both mark syntax with the landing palette: coral keywords, yellow strings and
// numbers, teal functions and types. The light sheet uses the dark-ink version
// of each color so it reads on paper.

type Palette = {
  name: string
  type: 'light' | 'dark'
  bg: string
  fg: string
  comment: string
  keyword: string
  string: string
  fn: string
  property: string
  punctuation: string
}

function theme(p: Palette) {
  return {
    name: p.name,
    type: p.type,
    colors: {
      'editor.background': p.bg,
      'editor.foreground': p.fg,
    },
    tokenColors: [
      { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: p.comment, fontStyle: 'italic' } },
      { scope: ['keyword', 'storage', 'storage.type', 'keyword.control', 'keyword.operator.new', 'keyword.operator.expression'], settings: { foreground: p.keyword } },
      { scope: ['string', 'string.quoted', 'string.template', 'markup.inline.raw'], settings: { foreground: p.string } },
      { scope: ['constant.numeric', 'constant.language', 'constant.character', 'support.constant'], settings: { foreground: p.string } },
      { scope: ['entity.name.function', 'support.function', 'meta.function-call', 'entity.name.type', 'support.type', 'entity.name.class', 'entity.other.inherited-class'], settings: { foreground: p.fn } },
      { scope: ['variable', 'variable.parameter', 'meta.definition.variable'], settings: { foreground: p.fg } },
      { scope: ['variable.other.property', 'support.type.property-name', 'meta.object-literal.key', 'entity.name.tag.yaml', 'support.type.property-name.json'], settings: { foreground: p.property } },
      { scope: ['entity.name.tag', 'meta.tag'], settings: { foreground: p.keyword } },
      { scope: ['entity.other.attribute-name'], settings: { foreground: p.fn } },
      { scope: ['punctuation', 'meta.brace', 'keyword.operator'], settings: { foreground: p.punctuation } },
      { scope: ['markup.heading', 'entity.name.section'], settings: { foreground: p.fg, fontStyle: 'bold' } },
      { scope: ['markup.inserted'], settings: { foreground: p.fn } },
      { scope: ['markup.deleted'], settings: { foreground: p.keyword } },
      { scope: ['variable.other.env', 'variable.other.normal.shell', 'punctuation.definition.variable.shell'], settings: { foreground: p.fn } },
      { scope: ['entity.name.command', 'support.function.builtin.shell'], settings: { foreground: p.fn } },
    ],
  }
}

export const scryTerminal = theme({
  name: 'scry-terminal',
  type: 'dark',
  bg: '#0b0b09',
  fg: '#fffef0',
  comment: '#8f8d82',
  keyword: '#ff6b6b',
  string: '#ffd93d',
  fn: '#4ecdc4',
  property: '#d6d4c8',
  punctuation: '#a8a69a',
})

export const scryPaper = theme({
  name: 'scry-paper',
  type: 'light',
  bg: '#f4f3ec',
  fg: '#1c1b17',
  comment: '#7d7b71',
  keyword: '#b3261e',
  string: '#7a5c00',
  fn: '#0b6b65',
  property: '#55534a',
  punctuation: '#7d7b71',
})
