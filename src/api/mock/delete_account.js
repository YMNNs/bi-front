import Mock from 'mockjs'
import md5 from 'js-md5'
import { mock_data } from '@/api/mock/mock_data'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'user/delete', 'post', (request) => {
    const { username, password, salt } = JSON.parse(request.body)
    if (username === mock_data.username && password === md5(md5(mock_data.password) + salt)) {
        //验证成功
        return {
            status: {
                code: 0,
                message: '用户已注销',
            },
            data: null,
        }
    } else {
        return {
            status: {
                code: 1,
                message: '用户名或密码无效',
            },
            data: null,
        }
    }
})
