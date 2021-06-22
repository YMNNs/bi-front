import axios from "@/request";

export function edit_chart(chart) {
    return axios.post("chart/edit", {
        chart: chart,
    });
}
