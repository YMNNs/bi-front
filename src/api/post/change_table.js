import axios from '@/request'

export function change_table(id, name) {
    return axios.post('data/change_table', {
        table_id: id,
        table_name: name,
    })
}
