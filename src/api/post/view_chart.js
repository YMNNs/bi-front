import axios from '@/request'

export function view_chart(id) {
    return axios.post('chart/view', { id: id })
}
