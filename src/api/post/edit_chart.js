import axios from "@/request";

export function edit_chart(id, chart) {
    return axios.post("chart/edit", { chart_id: id, ...chart });
}
