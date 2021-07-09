import Mock from 'mockjs'
import log from '@/util/logger'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'chart/delete', 'post', (request) => {
    log.mock(request.url, JSON.parse(request.body))
    const { id } = JSON.parse(request.body)
    if (id > 7) {
        return {
            status: {
                code: 1,
                message: '图表编号不存在',
            },
            data: null,
        }
    } else
        return {
            status: {
                code: 0,
                message: '删除成功',
            },
            data: null,
        }
})
