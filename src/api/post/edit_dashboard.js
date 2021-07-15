import axios from '@/request'

export function edit_dashboard(instruments) {
    return axios.post('dashboard/edit', { instruments: instruments })
}
