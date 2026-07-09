import nextra from 'nextra'
import type { NextConfig } from 'next'

// Nextra 配置
const withNextra = nextra({
  defaultShowCopyCode: true
  // contentDirBasePath: '/docs'
  // ... 在这里加 Nextra 的配置
})

// Next.js 配置
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  turbopack: {
    resolveAlias: {
      'next-mdx-import-source-file': './mdx-components.tsx'
    }
  }
  // ... 在这里加常规 Next.js 配置
}

export default withNextra(nextConfig)
