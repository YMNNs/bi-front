import axios from '@/request'

export function all_charts() {
    return axios.post('chart/all', {}) //data没有也不能不写
}
