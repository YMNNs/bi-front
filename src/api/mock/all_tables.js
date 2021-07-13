import Mock from 'mockjs'
import log from '@/util/logger'
import { mock_data } from '@/api/mock/mock_data'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'data/all_tables', 'post', (request) => {
    log.mock(request.url, JSON.parse(request.body))
    return {
        status: {
            code: 0,
            message: '数据库表信息获取成功',
        },
        data: {
            tables: mock_data.tables,
        },
    }
})
