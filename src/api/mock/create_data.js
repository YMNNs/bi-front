import Mock from "mockjs";

Mock.mock(
    process.env.VUE_APP_API_BASE_URL + "data/create",
    "post",
    (request) => {
        console.log(JSON.parse(request.body));
        return {
            status: {
                code: 0,
                message: "上传成功",
            },
            data: {
                id: 1,
            },
        };
    }
);
