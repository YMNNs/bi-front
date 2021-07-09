import Mock from 'mockjs'
import { mock_data } from '@/api/mock/mock_data'
import log from '@/util/logger'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'user/change_password', 'post', (request) => {
    log.mock(request.url, JSON.parse(request.body))
    const { old_password, new_password } = JSON.parse(request.body)

    if (old_password !== mock_data.password) {
        //密码不匹配
        return {
            status: {
                code: 1,
                message: '旧密码不匹配',
            },
            data: null,
        }
    } else if (new_password.length < 8 || new_password.length > 16) {
        return {
            status: {
                code: 3,
                message: '新密码格式错误',
            },
            data: null,
        }
    } else
        return {
            status: {
                code: 0,
                message: '密码修改成功',
            },
            data: null,
        }
})
