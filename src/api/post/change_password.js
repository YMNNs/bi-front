import axios from "@/request";

export function change_password(old_password, new_password) {
    return axios.post("user/change_password", {
        old_password: old_password,
        new_password: new_password,
    });
}
