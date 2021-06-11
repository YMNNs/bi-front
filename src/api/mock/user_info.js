import Mock from "mockjs";
import { mock_data } from "@/api/mock/mock_data";

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
                    id: mock_data.user_id,
                    username: mock_data.username,
                    nickname: mock_data.nickname,
                    email: mock_data.email,
                    email_verified: mock_data.email_verified,
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
