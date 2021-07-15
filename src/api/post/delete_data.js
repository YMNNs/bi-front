import axios from '@/request'

export function delete_data(id) {
    return axios.post('data/delete', {
        id: id,
    })
}
