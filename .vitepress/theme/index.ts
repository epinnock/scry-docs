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
      // The SCRY wordmark block, shared with www.scrymore.com and blog.scrymore.com;
      // siteTitle ("Docs") follows it inside the same link.
      'nav-bar-title-before': () => h('span', { class: 'scry-mark' }, 'SCRY'),
    })
  },
  enhanceApp({ app }) {
    app.component('MermaidDiagram', MermaidDiagram)
  }
} satisfies Theme
