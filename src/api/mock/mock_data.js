export const mock_data = {
    username: 'bilyn',
    duplicated_username: 'bbilyn',
    password: '12345678',
    email: 'i@stager.top',
    duplicated_email: 'i@stager.top',
    nickname: '本地用户',
    user_id: 23445,
    token: '234234234',
    reset_password_token: '567567567',
    email_verified: '0',
    activation_token: '987y4928y49',
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
    charts: [
        {
            id: 1,
            chart_name: '豆瓣',
            type_id: 1,
            last_modified_time: 1623748361,
        },
        {
            id: 2,
            chart_name: '58',
            type_id: 2,
            last_modified_time: 1623748364,
        },
    ],
    dashboard_size: 2,
}
