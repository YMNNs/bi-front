import Mock from 'mockjs'
import { mock_data } from '@/api/mock/mock_data'
import log from '@/util/logger'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'user/request_reset_password', 'post', (request) => {
    log.mock(request.url, JSON.parse(request.body))
    const { email } = JSON.parse(request.body)
    if (email === mock_data.email) {
        // 电子邮件地址正确
        return {
            status: {
                code: 0,
                message: '已发送邮件',
            },
            data: null,
        }
    } else if (email.match('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$')) {
        // 电子邮件地址未注册
        return {
            status: {
                code: 2,
                message: '电子邮件地址未注册',
            },
            data: null,
        }
    } else {
        // 电子邮件地址格式错误
        return {
            status: {
                code: 5,
                message: '电子邮件地址格式错误',
            },
            data: null,
        }
    }
})
