import Mock from "mockjs";

Mock.mock(
    process.env.VUE_APP_API_BASE_URL + "user/validate_email",
    "post",
    (request) => {
        console.log(request.body);
        const { email } = JSON.parse(request.body);
        if (email === "a@b.com") {
            return {
                status: {
                    code: 1,
                    message: "电子邮件地址已被占用",
                },
                data: {},
            };
        } else if (
            email.match("^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$")
        ) {
            return {
                status: {
                    code: 0,
                    message: "电子邮件地址可用",
                },
                data: {},
            };
        } else
            return {
                status: {
                    code: 2,
                    message: "电子邮件地址无效",
                },
                data: {},
            };
    }
);
