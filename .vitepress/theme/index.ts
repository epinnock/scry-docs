// docs/.vitepress/theme/index.ts
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // Add custom layout slots here if needed in the future
    })
  },
  enhanceApp({ app, router, siteData }) {
    // Register custom global components here if needed
  }
} satisfies Theme