import Mock from "mockjs";
import { mock_data } from "@/api/mock/mock_data";

Mock.mock(
    process.env.VUE_APP_API_BASE_URL + "user/resend_activation_email",
    "post",
    (request) => {
        const { token } = JSON.parse(request.body);
        if (!token) {
            return {
                status: {
                    code: -1,
                    message: "未携带token",
                },
            };
        } else if (token === mock_data.token) {
            //token正确
            return {
                status: {
                    code: 0,
                    message: "邮件发送成功",
                },
            };
        } else
            return {
                status: {
                    code: -2,
                    message: "token过期或无效",
                },
            };
    }
);
