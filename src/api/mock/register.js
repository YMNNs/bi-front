import Mock from "mockjs";
import { mock_data } from "@/api/mock/mock_data";

Mock.mock(
    process.env.VUE_APP_API_BASE_URL + "user/register",
    "post",
    (request) => {
        const { email, username } = JSON.parse(request.body);
        if (email === mock_data.email) {
            return {
                status: {
                    code: 11,
                    message: "电子邮件地址已被占用",
                },
            };
        } else if (username === mock_data.username) {
            return {
                status: {
                    code: 21,
                    message: "用户名已被占用",
                },
            };
        } else {
            return {
                status: {
                    code: 0,
                    message: "注册成功",
                },
                data: {
                    token: mock_data.token,
                },
            };
        }
    }
);
