import Mock from 'mockjs'
import log from '@/util/logger'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'data/change_table', 'post', (request) => {
    log.mock(request.url, JSON.parse(request.body))
    return {
        status: {
            code: 0,
            message: '表名修改成功',
        },
        data: null,
    }
})
