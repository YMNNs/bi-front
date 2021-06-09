import Mock from "mockjs";
import md5 from "js-md5";

Mock.mock(
    process.env.VUE_APP_API_BASE_URL + "user/login",
    "post",
    (request) => {
        const { login, password, salt } = JSON.parse(request.body);
        if (login === "a" && password === md5(md5("1") + salt)) {
            //登录成功
            return {
                status: {
                    code: 0,
                    message: "登录成功",
                },
                data: {
                    token: "123321",
                    expire_time: "1623033546",
                },
            };
        } else {
            // 登录失败
            return {
                status: {
                    code: 2,
                    message: "密码无效",
                },
                data: {},
            };
        }
    }
);
