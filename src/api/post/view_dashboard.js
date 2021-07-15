import axios from '@/request'

export function view_dashboard() {
    return axios.post('dashboard/view', {})
}
