import Mock from "mockjs";

Mock.mock(
    process.env.VUE_APP_API_BASE_URL + "user/logout",
    "post",
    (request) => {
        const { token } = JSON.parse(request.body);
        if (token) {
            return {
                status: {
                    code: 0,
                    message: "退出成功",
                },
                data: {},
            };
        } else {
            return {
                status: {
                    code: -1,
                    message: "未携带token",
                },
                data: {},
            };
        }
    }
);
