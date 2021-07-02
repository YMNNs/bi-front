import axios from "@/request";

export function get_dashboard_size() {
    return axios.post("dashboard/size", {});
}
