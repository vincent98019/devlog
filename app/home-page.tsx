import Link from 'next/link'
import styles from './home-page.module.css'

const categories = [
    {
        mark: 'J',
        title: 'Java',
        text: '从基础语法、面向对象到集合与常用类，沉淀一条能反复复习的主线。',
        href: '/Java/基础/Java概述'
    },
    {
        mark: 'D',
        title: '数据库',
        text: '整理 MySQL、Oracle 的查询、事务、索引和体系结构，方便查漏补缺。',
        href: '/Database/MySQL/基础/关系型与非关系型数据库'
    },
    {
        mark: 'S',
        title: 'Spring',
        text: '记录 Spring Cloud Gateway 等后端框架知识，把配置、原理和实践串起来。',
        href: '/Spring/Cloud/Gateway/Gateway概述'
    },
    {
        mark: 'F',
        title: '前端',
        text: 'HTML、CSS 和页面基础能力，作为全栈学习路线中的前端底座。',
        href: '/Frontend/HTML/HTML语法'
    }
]

const timeline = [
    {
        label: '当前重点',
        title: 'Java 集合体系',
        text: '围绕 Collection、List、Set、Map、Collections 等内容建立结构化理解。'
    },
    {
        label: '长期积累',
        title: '数据库与后端框架',
        text: '把查询、事务、索引、网关、限流、日志这些知识整理成可回看的专题。'
    },
    {
        label: '复习方式',
        title: '按问题回到笔记',
        text: '遇到概念模糊、代码忘记、配置不熟时，用搜索和目录快速定位。'
    }
]

export default function HomePage() {
    return (
        <main className={styles.home}>
            <section className={styles.hero}>
                <div>
                    <p className={styles.eyebrow}>Programming Notes</p>
                    <h1 className={styles.title}>Vincent&apos;s DevLog</h1>
                    <p className={styles.description}>
                        这里记录我学习编程时整理的笔记。它不是一本一次写完的教程，
                        更像一个持续生长的知识库：学到哪里，整理到哪里，之后再回来复盘、补全和重构。
                    </p>
                    <div className={styles.actions}>
                        <Link className={styles.primaryAction} href="/Java/基础/Java概述">
                            开始阅读
                        </Link>
                        <Link className={styles.secondaryAction} href="/Java/集合/JavaCollection">
                            最近在学
                        </Link>
                    </div>
                </div>

                <div className={styles.summary} aria-label="站点概览">
                    <div className={styles.summaryItem}>
                        <span className={styles.summaryNumber}>4</span>
                        <span className={styles.summaryLabel}>学习方向</span>
                    </div>
                    <div className={styles.summaryItem}>
                        <span className={styles.summaryNumber}>Java</span>
                        <span className={styles.summaryLabel}>当前主线</span>
                    </div>
                    <div className={styles.summaryItem}>
                        <span className={styles.summaryNumber}>持续更新</span>
                        <span className={styles.summaryLabel}>边学边整理</span>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>内容入口</h2>
                    <p className={styles.sectionNote}>从一个主题开始，慢慢把知识串起来。</p>
                </div>
                <div className={styles.grid}>
                    {categories.map((category) => (
                        <Link className={styles.card} href={category.href} key={category.title}>
                            <span className={styles.cardMark}>{category.mark}</span>
                            <h3 className={styles.cardTitle}>{category.title}</h3>
                            <p className={styles.cardText}>{category.text}</p>
                        </Link>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>学习节奏</h2>
                    <p className={styles.sectionNote}>笔记服务于复习，也服务于下一次继续深入。</p>
                </div>
                <div className={styles.timeline}>
                    {timeline.map((item) => (
                        <div className={styles.timelineItem} key={item.label}>
                            <span className={styles.timelineLabel}>{item.label}</span>
                            <div>
                                <h3 className={styles.timelineTitle}>{item.title}</h3>
                                <p className={styles.timelineText}>{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}
