import axios from "@/request";

export function create_chart(data_id, type_id, chart_name) {
    return axios.post("chart/create", {
        data_id: data_id,
        type_id: type_id,
        chart_name: chart_name,
        options: null,
        columns: null,
        data_index: null,
    });
}
