import Mock from 'mockjs'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'data/change_table', 'post', () => {
    return {
        status: {
            code: 0,
            message: '表名修改成功',
        },
        data: null,
    }
})
