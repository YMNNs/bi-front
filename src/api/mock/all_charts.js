import Mock from 'mockjs'
import { mock_data } from '@/api/mock/mock_data'
import log from '@/util/logger'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'chart/all', 'post', (request) => {
    log.mock(request.url, JSON.parse(request.body))
    return {
        status: {
            code: 0,
            message: '获取全部图表',
        },
        data: {
            all_charts: {
                quota: 10,
                charts: mock_data.charts,
            },
        },
    }
})
