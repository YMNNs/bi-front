import Mock from "mockjs";

Mock.mock(process.env.VUE_APP_API_BASE_URL + "user/logout", "post", () => {
    return {
        status: {
            code: 0,
            message: "退出成功",
        },
        data: {},
    };
});
