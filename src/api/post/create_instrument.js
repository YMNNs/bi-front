import axios from "@/request";

export function create_instrument(chart_id) {
    return axios.post("dashboard/add", {
        chart_id: chart_id,
    });
}
