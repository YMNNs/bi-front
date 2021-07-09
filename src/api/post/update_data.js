import axios from '@/request'

export function update_data(id, name, description, data) {
    return axios.post('data/update', {
        id: id,
        name: name,
        description: description,
        dataSource: data,
    })
}
