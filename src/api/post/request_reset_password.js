import axios from "@/request";

export function request_reset_password(email) {
    return axios.post("user/request_reset_password", { email: email });
}
