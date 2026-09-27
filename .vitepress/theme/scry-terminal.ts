// Shiki theme for code blocks: the dark terminal from www.scrymore.com.
// Cream text on near-black; the landing palette marks syntax (coral keywords,
// yellow strings, teal functions and types). Used for both light and dark mode.
export const scryTerminal = {
  name: 'scry-terminal',
  type: 'dark' as const,
  colors: {
    'editor.background': '#111110',
    'editor.foreground': '#fffef0',
  },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#8f8d82', fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'storage.type', 'keyword.control', 'keyword.operator.new', 'keyword.operator.expression'], settings: { foreground: '#ff6b6b' } },
    { scope: ['string', 'string.quoted', 'string.template', 'markup.inline.raw'], settings: { foreground: '#ffd93d' } },
    { scope: ['constant.numeric', 'constant.language', 'constant.character', 'support.constant'], settings: { foreground: '#ffd93d' } },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call', 'entity.name.type', 'support.type', 'entity.name.class', 'entity.other.inherited-class'], settings: { foreground: '#4ecdc4' } },
    { scope: ['variable', 'variable.parameter', 'meta.definition.variable'], settings: { foreground: '#fffef0' } },
    { scope: ['variable.other.property', 'support.type.property-name', 'meta.object-literal.key', 'entity.name.tag.yaml', 'support.type.property-name.json'], settings: { foreground: '#d6d4c8' } },
    { scope: ['entity.name.tag', 'meta.tag'], settings: { foreground: '#ff6b6b' } },
    { scope: ['entity.other.attribute-name'], settings: { foreground: '#4ecdc4' } },
    { scope: ['punctuation', 'meta.brace', 'keyword.operator'], settings: { foreground: '#a8a69a' } },
    { scope: ['markup.heading', 'entity.name.section'], settings: { foreground: '#fffef0', fontStyle: 'bold' } },
    { scope: ['markup.inserted'], settings: { foreground: '#4ecdc4' } },
    { scope: ['markup.deleted'], settings: { foreground: '#ff6b6b' } },
    { scope: ['variable.other.env', 'variable.other.normal.shell', 'punctuation.definition.variable.shell'], settings: { foreground: '#4ecdc4' } },
    { scope: ['entity.name.command', 'support.function.builtin.shell'], settings: { foreground: '#4ecdc4' } },
  ],
}
