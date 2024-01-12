import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "TemplatePlus",
  description: "一站式项目模板",
  base: "/template-plus/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      // { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '简介',
          items: [
            { text: '什么是TemplatePlus', link: '/guide/what-is-templateplus' },
            { text: '快速开始', link: '/guide/getting-started' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhounie/create-vue3-template' }
    ],

    footer: {
      copyright: '版权所有 © 2023-present TemplatePlus Contributors'
    }
  }
})
