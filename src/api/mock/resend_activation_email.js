import Mock from 'mockjs'
import log from '@/util/logger'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'user/resend_activation_email', 'post', (request) => {
    log.mock(request.url, JSON.parse(request.body))
    return {
        status: {
            code: 0,
            message: '发送邮件成功',
        },
        data: null,
    }
})
