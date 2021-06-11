import axios from "@/request";
export function resend_activation_email() {
    return axios.post("user/resend_activation_email", {}); //data没有也不能不写
}
