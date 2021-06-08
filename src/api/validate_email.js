import axios from "@/request/index";

export function validate_email(email) {
    return axios.post("user/validate_email", { email: email });
}
