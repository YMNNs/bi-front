import { createStore } from 'vuex'
import { parseOrNull } from '@/util'
import { user_info } from '@/api/post/user_info'
import { notification } from 'ant-design-vue'
import log from '@/util/logger'

export default createStore({
    state: {
        token: localStorage.getItem('bi_token') ? localStorage.getItem('bi_token') : '',
        username: parseOrNull(localStorage.getItem('bi_user'), 'username')
            ? parseOrNull(localStorage.getItem('bi_user'), 'username')
            : '',
        nickname: parseOrNull(localStorage.getItem('bi_user'), 'nickname')
            ? parseOrNull(localStorage.getItem('bi_user'), 'nickname')
            : '',
        role: parseOrNull(localStorage.getItem('bi_user'), 'role')
            ? parseOrNull(localStorage.getItem('bi_user'), 'role')
            : '',
        logout: false,
        network: true,
    },
    mutations: {
        SET_LOGOUT: (state, payload) => {
            state.logout = payload
        },
        SET_NETWORK_STATUS: (state, payload) => {
            state.network = payload
        },
        SET_TOKEN: (state, payload) => {
            state.token = payload.token
            localStorage.setItem('bi_token', state.token)
        },
        CLEAR_TOKEN: (state) => {
            state.token = null
            localStorage.removeItem('bi_token')
        },
        SET_USER_INFO: (state, payload) => {
            state.role = payload.role
            state.username = payload.username
            state.nickname = payload.nickname
            localStorage.setItem(
                'bi_user',
                JSON.stringify({
                    role: payload.role,
                    username: payload.username,
                    nickname: payload.nickname,
                })
            )
        },
        CLEAR_USER_INFO: (state) => {
            state.role = null
            state.username = null
            state.nickname = null
            localStorage.removeItem('bi_user')
        },
    },
    actions: {
        UPDATE_USER_INFO: (context) => {
            return new Promise((resolve, reject) => {
                user_info()
                    .then((response) => {
                        if (response.data.status.code === 0) {
                            // 有用户信息
                            log.debug('user_info: 有用户信息')
                            context.commit('SET_USER_INFO', response.data.data.user)
                            resolve(response)
                        } else {
                            log.debug('user_info: 无用户信息')
                            context.commit('CLEAR_TOKEN')
                            context.commit('CLEAR_USER_INFO')
                            notification['error']({
                                message: '错误',
                                description: response.data.status.message,
                            })
                            reject(response)
                        }
                    })
                    .catch()
            })
        },
    },
    modules: {},
})
