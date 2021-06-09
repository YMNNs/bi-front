import axios from "@/request";

export function validate_reset_password_token(reset_password_token) {
    return axios.post("user/validate_reset_password_token", {
        reset_password_token: reset_password_token,
    });
}
