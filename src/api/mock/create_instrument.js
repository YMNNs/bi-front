import Mock from 'mockjs'
import { mock_data } from '@/api/mock/mock_data'
import log from '@/util/logger'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'dashboard/add', 'post', (request) => {
    log.mock(request.url, JSON.parse(request.body))
    const { chart_id } = JSON.parse(request.body)
    if (!mock_data.charts.find((i) => i.id === chart_id)) {
        return {
            status: {
                code: 1,
                message: '图表id不存在',
            },
            data: null,
        }
    } else {
        return {
            status: {
                code: 0,
                message: '仪表添加成功',
            },
            data: {
                id: 123,
            },
        }
    }
})
