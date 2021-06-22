import axios from "@/request";

// 拆壳
export function edit_chart(chart) {
    const data = {};
    Object.keys(chart).forEach((key) => {
        data[key] = chart[key];
    });
    return axios.post("chart/edit", data);
}
