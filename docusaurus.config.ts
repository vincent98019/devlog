import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Vincent’s DevLog",
  // tagline: 'Dinosaurs are cool',
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://vlon.cc",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "vincent98019", // Usually your GitHub org/user name.
  projectName: "devlog", // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "zh",
    locales: ["zh"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/vincent98019/devlog/tree/main/",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          editUrl: "https://github.com/vincent98019/devlog/tree/main/",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "Vincent’s DevLog",
      logo: {
        alt: "Vincent’s DevLog Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          position: "left",
          label: "Java系列",
          items: [
            {
              label: "Java基础",
              to: "/docs/Java/基础/Java概述",
            },
            {
              label: "Java面向对象",
              to: "/docs/Java/面向对象/Java类与对象",
            },
            {
              label: "Java常用类",
              to: "/docs/Java/常用类/Java方法main",
            },
            {
              label: "Java集合",
              to: "/docs/Java/集合/JavaCollection",
            },
            {
              label: "Spring",
              to: "/docs/Spring/Spring/Spring概述",
            },
            {
              label: "SpringMVC",
              to: "/docs/Spring/SpringMVC/SpringMVC入门",
            },
          ],
        },
        {
          // type: 'docSidebar',
          // sidebarId: 'tutorialSidebar',
          position: "left",
          label: "工具｜部署",
          items: [
            {
              type: "docSidebar",
              sidebarId: "gitSidebar",
              label: "Git",
            },
          ],
        },
        {
          type: "docSidebar",
          sidebarId: "linuxSidebar",
          position: "left",
          label: "Linux",
        },
        // {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: "https://github.com/vincent98019/devlog",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "友情链接",
          items: [
            // {
            //   label: "Tutorial",
            //   to: "/docs/intro",
            // },
            {
              label: "比蜂科技",
              href: "https://beefic.com",
            },
          ],
        },
        //   {
        //     title: 'Community',
        //     items: [
        //       {
        //         label: 'Stack Overflow',
        //         href: 'https://stackoverflow.com/questions/tagged/docusaurus',
        //       },
        //       {
        //         label: 'Discord',
        //         href: 'https://discordapp.com/invite/docusaurus',
        //       },
        //       {
        //         label: 'X',
        //         href: 'https://x.com/docusaurus',
        //       },
        //     ],
        //   },
        // {
        //   title: "More",
        //   items: [
        //     {
        //       label: "Blog",
        //       to: "/blog",
        //     },
        //     {
        //       label: "GitHub",
        //       href: "https://github.com/facebook/docusaurus",
        //     },
        //   ],
        // },

        {
          items: [
            {
              html: `
            <div style="text-align: center; font-size: 14px; line-height: 1.6;">
              <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">浙ICP备2022027766号-4</a>
            </div>
          `,
            },
            //    {
            //     html: `
            //   <div style="text-align: center; font-size: 14px; line-height: 1.6;">
            //     <a href="https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030502000000" target="_blank" rel="noopener">
            //       <img src="/img/beian-icon.png" style="width: 16px; vertical-align: -2px;" />
            //       粤公网安备 44030502000000号
            //     </a>
            //   </div>
            // `,
            //   },
          ],
        },
      ],
      copyright: `Copyright © 2025 vincent98019. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["java", "bash"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
