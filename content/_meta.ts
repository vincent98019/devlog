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
            'Java基础': {
                title: 'Java基础',
                href: '/Java/Java基础/基础/Java概述'
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
