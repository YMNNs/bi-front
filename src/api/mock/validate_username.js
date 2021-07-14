import Mock from 'mockjs'
import mock_data from '@/api/mock/mock_data'
import log from '@/util/logger'

Mock.mock(process.env.VUE_APP_API_BASE_URL + 'user/validate_username', 'post', (request) => {
    log.mock(request.url, JSON.parse(request.body))
    const { username } = JSON.parse(request.body)
    if ([mock_data.username, mock_data.duplicated_username].indexOf(username) >= 0) {
        return {
            status: {
                code: 1,
                message: '用户名已被占用',
            },
            data: null,
        }
    } else {
        return {
            status: {
                code: 0,
                message: '用户名可用',
            },
            data: null,
        }
    }
})
