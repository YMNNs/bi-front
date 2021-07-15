import Mock from 'mockjs'
import log from '@/util/logger'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'chart/view', 'post', (request) => {
    log.mock('chart/view', JSON.parse(request.body))
    const { id } = JSON.parse(request.body)
    switch (id) {
        case 1: {
            return {
                status: {
                    code: 0,
                    message: '请求图表成功',
                },
                data: {
                    chart: {
                        type_id: 1,
                        data_id: 1,
                        chart_name: '豆瓣',
                        last_modified_time: 1623916319,
                        keys_number: ['comment'],
                        keys_text: ['type'],
                        xField: null,
                        yField: null,
                        seriesField: null,
                    },
                },
            }
        }
        case 2: {
            return {
                status: {
                    code: 0,
                    message: '请求图表成功',
                },
                data: {
                    chart: {
                        type_id: 2,
                        data_id: 2,
                        chart_name: '58',
                        last_modified_time: 1623916319,
                        keys_number: ['total_price'],
                        keys_text: ['direction'],
                        xField: null,
                        yField: null,
                        seriesField: null,
                    },
                },
            }
        }
        default: {
            return {
                status: {
                    code: 1,
                    message: '图表id无效',
                },
                data: null,
            }
        }
    }
})
