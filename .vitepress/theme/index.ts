// docs/.vitepress/theme/index.ts
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import MermaidDiagram from './MermaidDiagram.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // Add custom layout slots here if needed in the future
    })
  },
  enhanceApp({ app }) {
    app.component('MermaidDiagram', MermaidDiagram)
  }
} satisfies Theme
