import axios from '@/request'

export function edit_user_profile(user) {
    return axios.post('user/modify', { ...user })
}
