import Mock from 'mockjs'
import md5 from 'js-md5'
import { mock_data } from '@/api/mock/mock_data'
import log from '@/util/logger'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'user/login', 'post', (request) => {
    log.mock(request.url, JSON.parse(request.body))
    const { login, password, salt } = JSON.parse(request.body)
    if (login === mock_data.username && password === md5(md5(mock_data.password) + salt)) {
        //登录成功
        return {
            status: {
                code: 0,
                message: '登录成功',
            },
            data: {
                token: mock_data.token,
            },
        }
    } else {
        // 登录失败
        return {
            status: {
                code: 2,
                message: '密码无效',
            },
            data: null,
        }
    }
})
