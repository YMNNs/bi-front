import axios from "@/request";

export function modify_user_profile(info) {
    return axios.post("user/modify", {
        info: info,
    });
}
