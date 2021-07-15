/**
 * 测试中用到，不支持ES6
 * @type {{charts: [{chart_name: string, last_modified_time: number, type_id: number, id: number}, {chart_name: string, last_modified_time: number, type_id: number, id: number}], email_verified: string, duplicated_username: string, reset_password_token: string, duplicated_email: string, token: string, activation_token: string, password: string, tables: [{editable: boolean, name: string, description: string, id: number}, {editable: boolean, name: string, description: string, id: number}], user_id: number, nickname: string, dashboard_size: number, email: string, username: string}}
 */
module.exports = {
    username: 'bilyn',
    duplicated_username: 'bbilyn',
    password: '12345678',
    email: 'i@stager.top',
    duplicated_email: 'ii@stager.top',
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
