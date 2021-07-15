import Mock from 'mockjs'
import log from '@/util/logger'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'chart/edit', 'post', (request) => {
    log.mock(request.url, JSON.parse(request.body))
    const { chart_id } = JSON.parse(request.body)
    if (chart_id) {
        return {
            status: {
                code: 0,
                message: '图表已保存',
            },
            data: null,
        }
    } else {
        return {
            status: {
                code: 2,
                message: '非空字段为空',
            },
            data: null,
        }
    }
})
