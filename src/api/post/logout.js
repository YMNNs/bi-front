import axios from '@/request'

export function logout() {
    return axios.post('user/logout', {})
}
