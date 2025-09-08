import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

function getSidebarPosts(dirPath, baseRoute = '') {
  const files = fs.readdirSync(dirPath)

  return files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const name = file.replace('.md', '')
      return {
        text: name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Pretty name
        link: path.posix.join(baseRoute, name === 'index' ? '' : name)
      }
    })
}

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
          { text: 'OceanHelm Features', link: '#' },
          { text: 'OceanHelm News', link: '#' }
        ]
      },
      { text: 'News', link: '#' },
      { text: 'Changelog', link: '#' },
      { text: 'Try OceanHelm', link: 'https://oceanhelmtech.com' }
    ],

    sidebar: [
      {
        text: 'Posts',
        items: getSidebarPosts(path.resolve(__dirname, '../posts'), '/posts/')
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
