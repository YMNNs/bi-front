import Mock from "mockjs";
import { mock_data } from "@/api/mock/mock_data";

Mock.mock(
    process.env.VUE_APP_API_BASE_URL + "user/validate_reset_password_token",
    "post",
    (request) => {
        const { reset_password_token } = JSON.parse(request.body);
        if (reset_password_token === mock_data.reset_password_token) {
            return {
                status: {
                    code: 0,
                    message: "重置密码令牌可用",
                },
                data: null,
            };
        } else {
            return {
                status: {
                    code: 1,
                    message: "重置密码令牌无效",
                },
                data: null,
            };
        }
    }
);
