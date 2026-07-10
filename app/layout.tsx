import type {Metadata} from 'next'
import {Footer, Layout, Navbar} from 'nextra-theme-docs'
import {Banner, Head} from 'nextra/components'
import {getPageMap} from 'nextra/page-map'
import {Search} from 'nextra/components'
import 'nextra-theme-docs/style.css'

export const metadata: Metadata = {
    title: 'Vincent\'s DevLog',
    // description: 'My Docs'
}

// const banner = (
//   <Banner storageKey="some-key">
//     Nextra 4.0 is released 🎉
//   </Banner>
// )

const navbar = (
    <Navbar
        logo={<b>Vincent&apos;s DevLog</b>}
        // ... 你的 navbar 配置
    />
)


const search = (
    <Search placeholder='搜索文档' emptyResult='未找到文本' errorText='服务器繁忙' loading='正在加载...'/>
)

const footer = (
    <Footer>
        MIT {new Date().getFullYear()} © Nextra.
    </Footer>
)

export default async function RootLayout({
                                             children
                                         }: {
    children: React.ReactNode
}) {
    return (
        <html
            lang="zh_CN"
            dir="ltr"
            suppressHydrationWarning
        >
        <Head backgroundColor={{
            light: '#FFFFFF'
        }}>
            {/* 自定义 meta / link / script */}
        </Head>
        <body>
        <Layout
            editLink=''
            feedback={{
                content: '有问题？提交反馈'
            }}
            copyPageButton={false}
            navigation={false}
            sidebar={{
                autoCollapse: true,
                defaultMenuCollapseLevel: 1,
                defaultOpen: true,
                toggleButton: true
            }}
            themeSwitch={{
                system: '跟随系统',
                light: '亮色',
                dark: '暗色'
            }}
            toc={{
                backToTop: '返回顶部',
                title: '目录'
            }}

            // banner={banner}
            search={search}
            navbar={navbar}
            pageMap={await getPageMap()}
            docsRepositoryBase="https://github.com/vincent98019/devlog"
            footer={footer}
        >
            {children}
        </Layout>
        </body>
        </html>
    )
}
