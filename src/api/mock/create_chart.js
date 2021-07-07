import Mock from 'mockjs'
import { mock_data } from '@/api/mock/mock_data'
import { chart_types } from '@/constant/chart_types'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'chart/create', 'post', (request) => {
    const { data_id, type_id, chart_name } = JSON.parse(request.body)
    if (!mock_data.tables.find((i) => i.id === data_id)) {
        //	数据表id无效
        return {
            status: {
                code: 1,
                message: '数据表id无效',
            },
            data: null,
        }
    } else if (!chart_name || chart_name.length > 128) {
        return {
            status: {
                code: 2,
                message: '图表名称为空或格式错误',
            },
            data: null,
        }
    } else if (!chart_types.find((i) => i.type_id === type_id)) {
        return {
            status: {
                code: 3,
                message: '图表类型无效',
            },
            data: null,
        }
    } else
        return {
            status: {
                code: 0,
                message: '生成成功',
            },
            data: {
                chart_id: 1,
            },
        }
})
