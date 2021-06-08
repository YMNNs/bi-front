import axios from "@/request/index";

export function validate_username(username) {
    return axios.post("user/validate_username", { username: username });
}
