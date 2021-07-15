import axios from '@/request'

export function table_content(table_id, max_length, offset) {
    return axios.post('data/table_content', {
        table_id: table_id,
        max_length: max_length,
        offset: offset,
    })
}
