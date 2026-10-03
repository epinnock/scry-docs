import { defineConfig } from 'vitepress'
import { scryPaper, scryTerminal } from './theme/scry-terminal'

export default defineConfig({
  title: 'Scry',
  description: 'Deploy your Storybook to the cloud with one command',

  head: [
    // Vercel Web Analytics (page views only; the project must also have Web Analytics enabled in Vercel).
    ['script', {}, 'window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };'],
    ['script', { defer: '', src: '/_vercel/insights/script.js' }],
    ['meta', { name: 'theme-color', content: '#1c1b17' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }],
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: '48x48' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-icon.png' }],
    // Shared type with www.scrymore.com and blog.scrymore.com: Martian Mono display, the IBM Plex family.
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Martian+Mono:wdth,wght@75..112.5,100..800&display=swap' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:site_name', content: 'Scry' }],
    ['meta', { property: 'og:title', content: 'Scry - Deploy Storybook to the cloud' }],
    ['meta', { property: 'og:description', content: 'One command deployment for Storybook with automatic PR previews' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Scry - Deploy Storybook' }],
    ['meta', { name: 'keywords', content: 'storybook, deployment, cloudflare, ci/cd, preview, github actions' }],
  ],

  themeConfig: {
    siteTitle: 'Docs',

    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'CLI', link: '/cli/' },
      { text: 'Services', link: '/services/overview' },
      { text: 'API', link: '/api/' },
      { text: 'Contributing', link: '/contributing/' },
      { text: 'Feedback', link: '/feedback' },
      {
        text: 'Privacy',
        items: [
          { text: 'Privacy Policy', link: '/privacy' },
          { text: 'Terms of Service', link: '/terms' },
          { text: 'Subprocessors', link: '/subprocessors' },
          { text: 'What Scry Link Collects', link: '/figma-plugin/what-we-collect' },
          { text: 'Alert Texts and Calls', link: '/alert-texts' },
        ]
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is Scry?', link: '/guide/' },
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Set Up with AI', link: '/guide/skill' },
            { text: 'Installation', link: '/guide/installation' },
          ]
        },
        {
          text: 'Getting Started',
          items: [
            { text: 'First Deployment', link: '/guide/first-deployment' },
            { text: 'GitHub Actions', link: '/guide/github-actions' },
            { text: 'PR Previews', link: '/guide/pr-previews' },
          ]
        },
        {
          text: 'Integrations',
          items: [
            { text: 'Figma Plugin', link: '/guide/figma-plugin' },
            { text: 'Reviewing a Design Sync Run', link: '/guide/design-sync-review' },
            { text: 'Design Sync Run Details', link: '/guide/design-sync-run-details' },
            { text: 'Storybook Capture Settings', link: '/guide/storybook-capture-settings' },
            { text: 'What Scry Link Collects', link: '/figma-plugin/what-we-collect' },
            { text: 'Component Requests', link: '/guide/component-requests' },
            { text: 'Members and Invites', link: '/guide/members-and-invites' },
            { text: 'Account Settings', link: '/guide/account-settings' },
            { text: 'MCP Server', link: '/guide/mcp' },
            { text: 'Fix in Figma or Code', link: '/guide/fix-in-figma-or-code' },
            { text: 'Agents: Resolving Issues', link: '/guide/mcp-issues' },
            { text: 'Notifications', link: '/guide/notifications' },
          ]
        },
        {
          text: 'Native apps',
          items: [
            { text: 'Overview', link: '/guide/native-apps' },
            { text: 'iOS (SwiftUI)', link: '/guide/ios-swiftui' },
            { text: 'Android (Compose)', link: '/guide/android-compose' },
            { text: 'React Native', link: '/guide/react-native' },
            { text: 'Capture sources', link: '/guide/capture-sources' },
            { text: 'Capture bundle format', link: '/guide/capture-bundle-format' },
          ]
        },
        {
          text: 'Scry Sync (desktop app)',
          items: [
            { text: 'Overview', link: '/guide/scry-sync/' },
            { text: 'Install and First Run', link: '/guide/scry-sync/install' },
            { text: 'Connect a Folder', link: '/guide/scry-sync/connect-a-folder' },
            { text: 'What Gets Converted', link: '/guide/scry-sync/what-gets-converted' },
            { text: 'Export an InDesign File to PDF', link: '/guide/scry-sync/export-indd-pdf' },
            { text: 'Disconnect a Device', link: '/guide/scry-sync/disconnect' },
            { text: 'What Scry Sync Collects', link: '/guide/scry-sync/privacy' },
            { text: 'Scry Sync Troubleshooting', link: '/guide/scry-sync/troubleshooting' },
          ]
        },
        {
          text: 'Help',
          items: [
            { text: 'How Credits Work', link: '/guide/credits' },
            { text: 'Troubleshooting', link: '/guide/troubleshooting' },
            { text: 'Feedback', link: '/feedback' },
          ]
        },
        {
          text: 'Privacy',
          items: [
            { text: 'Privacy Policy', link: '/privacy' },
            { text: 'Terms of Service', link: '/terms' },
            { text: 'Subprocessors', link: '/subprocessors' },
            { text: 'Alert Texts and Calls', link: '/alert-texts' },
          ]
        }
      ],

      '/figma-plugin/': [
        {
          text: 'Scry Link (Figma plugin)',
          items: [
            { text: 'Plugin guide', link: '/guide/figma-plugin' },
            { text: 'Design Sync Run Details', link: '/guide/design-sync-run-details' },
            { text: 'Storybook Capture Settings', link: '/guide/storybook-capture-settings' },
            { text: 'What Scry Link Collects', link: '/figma-plugin/what-we-collect' },
            { text: 'Fix in Figma or Code', link: '/guide/fix-in-figma-or-code' },
          ]
        },
        {
          text: 'Privacy',
          items: [
            { text: 'Privacy Policy', link: '/privacy' },
            { text: 'Terms of Service', link: '/terms' },
            { text: 'Subprocessors', link: '/subprocessors' },
            { text: 'Alert Texts and Calls', link: '/alert-texts' },
          ]
        }
      ],

      '/cli/': [
        {
          text: 'CLI Reference',
          items: [
            { text: 'Overview', link: '/cli/' },
            { text: 'Commands', link: '/cli/commands' },
            { text: 'Configuration', link: '/cli/configuration' },
            { text: 'Examples', link: '/cli/examples' },
          ]
        }
      ],

      '/services/': [
        {
          text: 'Architecture',
          items: [
            { text: 'Overview', link: '/services/overview' },
          ]
        },
        {
          text: 'Upload Service',
          items: [
            { text: 'Introduction', link: '/services/upload-service/' },
            { text: 'API Reference', link: '/services/upload-service/api-reference' },
            { text: 'Authentication', link: '/services/upload-service/authentication' },
            { text: 'Deployment', link: '/services/upload-service/deployment' },
            { text: 'Configuration', link: '/services/upload-service/configuration' },
          ]
        },
        {
          text: 'CDN Service',
          items: [
            { text: 'Introduction', link: '/services/cdn-service/' },
            { text: 'Architecture', link: '/services/cdn-service/architecture' },
            { text: 'Path Routing', link: '/services/cdn-service/path-routing' },
            { text: 'ZIP Extraction', link: '/services/cdn-service/zip-extraction' },
            { text: 'Deployment', link: '/services/cdn-service/deployment' },
          ]
        },
        {
          text: 'MCP Server',
          items: [
            { text: 'Introduction', link: '/services/mcp-server/' },
            { text: 'Tools', link: '/services/mcp-server/tools' },
            { text: 'Issue tools (guide)', link: '/guide/mcp-issues' },
            { text: 'Authentication', link: '/services/mcp-server/authentication' },
            { text: 'Deployment', link: '/services/mcp-server/deployment' },
          ]
        },
        {
          text: 'Diff Service',
          items: [
            { text: 'Introduction', link: '/services/diff-service/' },
            { text: 'API Reference', link: '/services/diff-service/api-reference' },
            { text: 'Review Model', link: '/services/diff-service/review-model' },
            { text: 'Deployment', link: '/services/diff-service/deployment' },
          ]
        },
        {
          text: 'Dashboard',
          items: [
            { text: 'Introduction', link: '/services/dashboard/' },
            { text: 'Setup', link: '/services/dashboard/setup' },
            { text: 'Firebase Config', link: '/services/dashboard/firebase-config' },
            { text: 'API Keys', link: '/services/dashboard/api-keys' },
          ]
        },
      ],

      '/self-hosting/': [
        {
          text: 'Self-Hosting',
          items: [
            { text: 'Overview', link: '/self-hosting/' },
            { text: 'Prerequisites', link: '/self-hosting/prerequisites' },
            { text: 'Complete Setup', link: '/self-hosting/complete-setup' },
            { text: 'Cloudflare Setup', link: '/self-hosting/cloudflare' },
            { text: 'Firebase Setup', link: '/self-hosting/firebase' },
            { text: 'Vercel Deployment', link: '/self-hosting/vercel' },
            { text: 'Monitoring', link: '/self-hosting/monitoring' },
          ]
        }
      ],

      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Upload Endpoints', link: '/api/upload-endpoints' },
            { text: 'CDN Endpoints', link: '/api/cdn-endpoints' },
            { text: 'Authentication', link: '/api/authentication' },
            { text: 'Webhooks', link: '/api/webhooks' },
            { text: 'Search', link: '/api/search' },
            { text: 'Request Ids', link: '/api/request-ids' },
          ]
        }
      ],

      '/contributing/': [
        {
          text: 'Contributing',
          items: [
            { text: 'How to Contribute', link: '/contributing/' },
            { text: 'Development Setup', link: '/contributing/development' },
            { text: 'Code Style', link: '/contributing/code-style' },
            { text: 'Testing', link: '/contributing/testing' },
            { text: 'Pull Requests', link: '/contributing/pull-requests' },
            { text: 'Architecture', link: '/contributing/architecture' },
          ]
        }
      ],

      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Overview', link: '/examples/' },
            { text: 'React Storybook', link: '/examples/react-storybook' },
            { text: 'Vue Storybook', link: '/examples/vue-storybook' },
            { text: 'Monorepo Setup', link: '/examples/monorepo' },
            { text: 'Custom Workflow', link: '/examples/custom-workflow' },
          ]
        }
      ],

      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Glossary', link: '/reference/glossary' },
            { text: 'Changelog', link: '/reference/changelog' },
            { text: 'Migration Guide', link: '/reference/migration' },
            { text: 'Comparison', link: '/reference/comparison' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/epinnock/scry-docs' },
    ],

    footer: {
      message: 'Released under the MIT License. · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · <a href="/subprocessors">Subprocessors</a>',
      copyright: 'Copyright © 2024-present Scry'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/epinnock/scry-docs/edit/master/:path',
      text: 'Edit this page on GitHub'
    },

    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    }
  },

  markdown: {
    config(md) {
      const defaultFence = md.renderer.rules.fence!
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        if (tokens[idx].info.trim() === 'mermaid') {
          const source = md.utils.escapeHtml(JSON.stringify(tokens[idx].content))
          return `<MermaidDiagram :source="${source}" />\n`
        }
        return defaultFence(tokens, idx, options, env, self)
      }
    },
    lineNumbers: true,
    // Light mode: a printed code sheet. Dark mode: the landing page's terminal.
    theme: {
      light: scryPaper,
      dark: scryTerminal
    }
  },

  lastUpdated: true,
  cleanUrls: true
})
