import axios from "@/request";

export function reset_password(reset_password_token, password) {
    return axios.post("user/reset_password", {
        reset_password_token: reset_password_token,
        password: password,
    });
}
