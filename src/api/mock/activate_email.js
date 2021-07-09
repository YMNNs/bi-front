import Mock from 'mockjs'
import { mock_data } from '@/api/mock/mock_data'
import log from '@/util/logger'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'user/activate_email', 'post', (request) => {
    log.mock(request.url, JSON.parse(request.body))
    const { activation_token } = JSON.parse(request.body)
    if (activation_token === mock_data.activation_token) {
        console.log('激活成功')
        return {
            status: {
                code: 0,
                message: '电子邮件地址已激活',
            },
            data: null,
        }
    } else {
        console.log('激活失败')
        return {
            status: {
                code: 1,
                message: '激活电子邮件地址令牌过期或无效',
            },
            data: null,
        }
    }
})
