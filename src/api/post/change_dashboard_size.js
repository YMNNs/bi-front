import axios from "@/request";

export function change_dashboard_size(size) {
    return axios.post("dashboard/change_size", {
        size: size,
    });
}
