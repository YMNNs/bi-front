import axios from '@/request'

export function create_data(columns) {
    return axios.post('data/create', {
        columns: columns,
    })
}
