import axios from '@/request'

export function delete_chart(id) {
    return axios.post('chart/delete', {
        id: id,
    })
}
