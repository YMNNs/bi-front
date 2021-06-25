import Mock from "mockjs";

Mock.mock(
    process.env.VUE_APP_API_BASE_URL + "dashboard/edit",
    "post",
    (request) => {
        console.log(request.body);
        const { instruments } = JSON.parse(request.body);
        if (instruments.length > 0) {
            return {
                status: {
                    code: 0,
                    message: "修改成功",
                },
                data: null,
            };
        } else {
            return {
                status: {
                    code: 4,
                    message: "未发现修改内容",
                },
                data: null,
            };
        }
    }
);
