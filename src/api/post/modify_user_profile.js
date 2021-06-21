import axios from "@/request";

export function modify_user_profile(user) {
    return axios.post("user/modify", {
        user: user,
    });
}
