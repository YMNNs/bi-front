import Mock from 'mockjs'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'data/delete', 'post', (request) => {
    const { id } = JSON.parse(request.body)
    if (id > 1) {
        return {
            status: {
                code: 0,
                message: '删除成功',
            },
            data: null,
        }
    } else
        return {
            status: {
                code: 1,
                message: '该数据不允许删除',
            },
            data: null,
        }
})
