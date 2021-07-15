import Mock from 'mockjs'
import log from '@/util/logger'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'dashboard/change_size', 'post', (request) => {
    log.mock(request.url, JSON.parse(request.body))
    return {
        status: {
            code: 0,
            message: '仪表盘大小修改成功',
        },
        data: null,
    }
})
