import Mock from "mockjs";

Mock.mock(process.env.VUE_APP_API_BASE_URL + "chart/edit", "post", () => {
    return {
        status: {
            code: 0,
            message: "图表已保存",
        },
        data: null,
    };
});
