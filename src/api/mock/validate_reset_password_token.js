import Mock from "mockjs";

Mock.mock(
    process.env.VUE_APP_API_BASE_URL + "user/validate_reset_password_token",
    "post",
    (request) => {
        const { reset_password_token } = JSON.parse(request.body);
        if (reset_password_token === "123123") {
            return {
                status: {
                    code: 0,
                    message: "重置密码令牌可用",
                },
                data: {},
            };
        } else {
            return {
                status: {
                    code: 1,
                    message: "重置密码令牌无效",
                },
                data: {},
            };
        }
    }
);
