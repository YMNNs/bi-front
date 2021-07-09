import Mock from 'mockjs'
import log from '@/util/logger'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'dashboard/view', 'post', (request) => {
    log.mock(request.url, JSON.parse(request.body))
    return {
        status: {
            code: 0,
            message: '仪表盘请求成功',
        },
        data: {
            instruments: [
                {
                    id: 453,
                    index: 0,
                    chart_id: 2,
                    data_id: 2,
                    // eslint-disable-next-line
                    selected_keys: "[\"南\"]",
                },
                {
                    id: 455,
                    index: 1,
                    chart_id: 1,
                    data_id: 1,
                    selected_keys: '[]',
                },
                {
                    id: 456,
                    index: 2,
                    chart_id: 2,
                    data_id: 2,
                    selected_keys: '[]',
                },
            ],
        },
    }
})
