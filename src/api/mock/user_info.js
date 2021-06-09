import Mock from "mockjs";

Mock.mock(process.env.VUE_APP_API_BASE_URL + "user/info", "post", (request) => {
    console.log(request.body);
    const { token } = JSON.parse(request.body);
    if (token) {
        // 返回用户信息
        return {
            status: {
                code: 0,
                message: "用户信息获取成功",
            },
            data: {
                user: {
                    id: 123,
                    username: "zhangsan",
                    nickname: "张三",
                    email: "zhangsan@bi.com",
                    email_verified: true,
                    status: "enabled",
                    role: "user",
                    last_login: "1623033546",
                },
            },
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
});
