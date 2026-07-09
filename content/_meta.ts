import type {MetaRecord} from 'nextra'

const meta: MetaRecord = {
    // '*': {
    //   theme: {
    //     copyPage: false
    //   }
    // },
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
            '基础': {
                title: 'Java基础',
                href: '/Java/基础/Java概述'
            },
            '面向对象': {
                title: 'Java面向对象',
                href: '/Java/面向对象/Java类与对象'
            },
            '常用类': {
                title: 'Java常用类',
                href: '/Java/常用类/Java方法main'
            },
            '集合': {
                title: 'Java集合',
                href: '/Java/集合/JavaCollection'
            },
            'IO流': {
                title: 'JavaIO流',
                href: '/Java/IO流/Java类File'
            },
            '网络编程': {
                title: 'Java网络编程',
                href: '/Java/网络编程/Java网络通信'
            },
            'JavaWeb': {
                title: 'JavaWeb',
                href: '/Java/JavaWeb/HTTP'
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
