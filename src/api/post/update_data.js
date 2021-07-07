import axios from '@/request'

export function update_data(id, data) {
    return axios.post('data/update', {
        id: id,
        dataSource: data,
    })
}
