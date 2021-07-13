import Mock from 'mockjs'
import { mock_data } from '@/api/mock/mock_data'
import log from '@/util/logger'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'user/validate_email', 'post', (request) => {
    log.mock(request.url, JSON.parse(request.body))
    const { email } = JSON.parse(request.body)
    if (email === mock_data.email) {
        return {
            status: {
                code: 1,
                message: '电子邮件地址已被占用',
            },
            data: null,
        }
    } else {
        return {
            status: {
                code: 0,
                message: '电子邮件地址可用',
            },
            data: null,
        }
    }
})
