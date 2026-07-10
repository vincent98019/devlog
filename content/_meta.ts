import type {MetaRecord} from 'nextra'

const meta: MetaRecord = {
    '*': {
        theme: {
            pagination: false
        }
    },
    'index': {
        title: 'Home',
        type: 'page',
        display: 'hidden',
        theme: {
            toc: false,
            layout: 'full'
        }
    },
    'Java': {
        title: 'Java',
        type: 'menu',
        items: {
            'Java基础': {
                title: 'Java基础',
                href: '/Java/基础/Java概述'
            },
            'JavaWeb': {
                title: 'JavaWeb',
                href: '/Java/JavaWeb/HTTP'
            },
            'Java常用组件': {
                title: 'Java常用组件',
                href: '/Java/常用组件/JDBC'
            },
            'Java新特性': {
                title: 'Java新特性',
                href: '/Java/Java8新特性/Java8Stream流'
            },
            'JVM': {
                title: 'JVM',
                href: '/Java/JVM/JVM类文件结构'
            },
            '并发编程': {
                title: '并发编程',
                href: '/Java/并发编程/Java进程与线程'
            }
        }
    },
    'Database': {
        title: '数据库',
        type: 'menu',
        items: {
            'MySQL': {
                title: 'MySQL',
                href: '/Database/MySQL/基础/关系型与非关系型数据库'
            },
            'Oracle': {
                title: 'Oracle',
                href: '/Database/Oracle/Oracle体系结构'
            }
        }
    },
    'Spring': {
        title: 'Spring',
        type: 'page',
    },


    'Frontend': {
        title: '前端',
        type: 'page',
    }
}

export default meta
