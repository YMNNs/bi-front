import axios from "@/request";

// 拆壳
export function edit_user_profile(user) {
    const data = {};
    Object.keys(user).forEach((key) => {
        data[key] = user[key];
    });
    return axios.post("user/modify", data);
}
