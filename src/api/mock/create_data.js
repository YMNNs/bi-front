import Mock from 'mockjs'
import log from '@/util/logger'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'data/create', 'post', (request) => {
    log.mock(request.url, JSON.parse(request.body))
    console.log(JSON.parse(request.body))
    return {
        status: {
            code: 0,
            message: '上传成功',
        },
        data: {
            id: 1,
        },
    }
})
