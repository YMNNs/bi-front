import axios from '@/request'

export function get_data_keys(id, keyText) {
    return axios.post('data/keys', {
        id: id,
        keyText: keyText,
    })
}
