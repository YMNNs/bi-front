import Mock from 'mockjs'
import log from '@/util/logger'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'data/update', 'post', (request) => {
    log.mock(request.url, JSON.parse(request.body))
    const { id } = JSON.parse(request.body)
    if (id === 1) {
        return {
            status: {
                code: 0,
                message: '上传成功',
            },
            data: {
                id: 1,
            },
        }
    } else {
        return {
            status: {
                code: 1,
                message: '数据id不存在',
            },
            data: null,
        }
    }
})
