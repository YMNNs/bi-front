import Mock from "mockjs";

Mock.mock(
    process.env.VUE_APP_API_BASE_URL + "user/validate_username",
    "post",
    (request) => {
        console.log(request.body);
        const { username } = JSON.parse(request.body);
        if (username === "a") {
            return {
                status: {
                    code: 1,
                    message: "用户名已被占用",
                },
                data: {},
            };
        } else {
            return {
                status: {
                    code: 0,
                    message: "用户名可用",
                },
                data: {},
            };
        }
    }
);
