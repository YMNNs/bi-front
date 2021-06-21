import axios from "@/request";

export function edit_chart(info) {
    return axios.post("chart/edit", {
        info: info,
    });
}
