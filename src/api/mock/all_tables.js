import Mock from 'mockjs'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'data/all_tables', 'post', () => {
    return {
        status: {
            code: 0,
            message: '数据库表信息获取成功',
        },
        data: {
            tables: [
                {
                    id: 1,
                    name: '豆瓣电影数据',
                    editable: false,
                    description: '按照豆瓣评分排序展示电影的基本信息',
                },
                {
                    id: 2,
                    name: '58租房数据',
                    editable: true,
                    description: '展示58同城租房网站的户型等基本信息',
                },
            ],
        },
    }
})
