import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "OceanHelm's Blog",
  description: "OceanHelm's blog, update on smart maritime news.",
  head: [
    // Favicon
    ['link', { rel: 'icon', href: 'https://oceanhelmtech.com/favicon.ico' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: 'https://peppubuild.com/oceanhelm.jpeg',
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Product',
        items: [
          { text: 'OceanHelm Features', link: '/item-1' },
          { text: 'OceanHelm News', link: '/item-2' }
        ]
      },
      { text: 'News', link: '/markdown-examples' },
      { text: 'Changelog', link: '/markdown-examples' },
      { text: 'Try OceanHelm', link: 'https://oceanhelmtech.com' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'linkedin', link: 'https://www.linkedin.com/company/90889390' }
    ],

    docFooter: {
      prev: 'Previous Page',
      next: 'Next Page'
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-OceanHelm'
    }
  }
})
