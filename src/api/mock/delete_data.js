import Mock from 'mockjs'
import log from '@/util/logger'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'data/delete', 'post', (request) => {
    log.mock(request.url, JSON.parse(request.body))
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
