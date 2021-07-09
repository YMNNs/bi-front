import Mock from 'mockjs'
import { mock_data } from '@/api/mock/mock_data'
import log from '@/util/logger'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'user/info', 'post', (request) => {
    log.mock(request.url, JSON.parse(request.body))
    // 返回用户信息
    return {
        status: {
            code: 0,
            message: '用户信息获取成功',
        },
        data: {
            user: {
                id: mock_data.user_id,
                username: mock_data.username,
                nickname: mock_data.nickname,
                email: mock_data.email,
                emailVerified: mock_data.email_verified,
                status: 'enabled',
                role: 'user',
                last_login: '1623033546',
            },
        },
    }
})
