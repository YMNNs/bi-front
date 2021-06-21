import Mock from "mockjs";
import { mock_data } from "@/api/mock/mock_data";

Mock.mock(
    process.env.VUE_APP_API_BASE_URL + "user/modify",
    "post",
    (request) => {
        const { user } = JSON.parse(request.body);
        const errors = [];
        if (user.nickname) {
            if (user.nickname.length < 3 || user.nickname.length > 16) {
                errors.push({
                    key: "nickname",
                    value: "昵称格式不正确",
                });
            }
        }
        if (user.username) {
            if (user.username === mock_data.username) {
                errors.push({
                    key: "username",
                    value: "用户名已被占用",
                });
            } else if (user.username.length < 5 || user.username.length > 16) {
                errors.push({
                    key: "username",
                    value: "用户名格式不正确",
                });
            }
        }
        if (user.email) {
            if (user.email === mock_data.email) {
                errors.push({
                    key: "email",
                    value: "电子邮件地址已被占用",
                });
            } else if (
                !user.email.match(
                    "^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$"
                )
            ) {
                errors.push({
                    key: "email",
                    value: "电子邮件地址格式不正确",
                });
            }
        }
        const code = errors.length;
        return {
            status: {
                code: code,
                message: "有" + code + "个字段修改失败",
            },
            data: {
                errors: errors,
            },
        };
    }
);
