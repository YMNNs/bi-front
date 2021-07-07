import axios from '@/request'

export function activate_email(activation_token) {
    return axios.post('user/activate_email', {
        activation_token: activation_token,
    })
}
