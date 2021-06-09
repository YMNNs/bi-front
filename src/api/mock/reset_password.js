import Mock from "mockjs";

Mock.mock(
    process.env.VUE_APP_API_BASE_URL + "user/reset_password",
    "post",
    (request) => {
        const { reset_password_token, password } = JSON.parse(request.body);
        if (reset_password_token === "123123") {
            // token 正确
            if (password.length >= 8 && password.length <= 16) {
                // 密码格式正确
                return {
                    status: {
                        code: 0,
                        message: "密码已重置",
                    },
                    data: {},
                };
            } else {
                // 密码格式错误
                return {
                    status: {
                        code: 7,
                        message: "密码格式错误",
                    },
                    data: {},
                };
            }
        } else {
            // token错误
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
