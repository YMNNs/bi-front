import Mock from 'mockjs'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'dashboard/change_size', 'post', () => {
    return {
        status: {
            code: 0,
            message: '仪表盘大小修改成功',
        },
        data: null,
    }
})
