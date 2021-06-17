import Mock from "mockjs";

Mock.mock(
    process.env.VUE_APP_API_BASE_URL + "user/resend_activation_email",
    "post",
    () => {
        return {
            status: {
                code: 0,
                message: "发送邮件成功",
            },
            data: null,
        };
    }
);
