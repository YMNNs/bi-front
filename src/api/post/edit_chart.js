import axios from '@/request'

export function edit_chart(id, chart) {
    // 6.29修改接口
    if (chart.xField) {
        chart.x_Field = chart.xField
    }
    if (chart.yField) {
        chart.y_Field = chart.yField
    }
    return axios.post('chart/edit', { chart_id: id, ...chart })
}
