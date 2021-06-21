export const chart_types = [
    {
        type_id: 1,
        type_name: "折线图",
        description: "使用一条折线的线段显示数据在一个具有顺序性的维度上的变化",
        icon_type: "icon-jibenzhexiantu",
        component: () => import("@/components/graph/plot"),
        yField: "value",
        seriesField: "category",
        prepare_data: (data, columns, number_keys, text_keys) => {
            const result = [];
            const columns_number = columns.filter((i) => i.type === "number");
            data.forEach((i) => {
                number_keys.forEach((number) => {
                    const item = {};
                    item["value"] = i[number];
                    item["category"] = columns_number.find(
                        (_i) => _i.key === number
                    ).title;
                    text_keys.forEach((text) => {
                        item[text] = i[text];
                    });
                    result.push(item);
                });
            });
            return result;
        },
        limit: {
            number: {
                max: 5,
                min: 1,
            },
            text: {
                max: 1,
                min: 1,
            },
        },
    },
    {
        type_id: 2,
        type_name: "柱状图",
        description:
            "使用柱形显示维度的数值。横轴显示分类维度，纵轴显示相应的值",
        icon_type: "icon-duoxilieezhuzhuangtu",
        component: undefined,
        limit: {
            number: {
                max: 5,
                min: 1,
            },
            text: {
                max: 1,
                min: 1,
            },
        },
    },
    {
        type_id: 3,
        type_name: "条形图",
        description:
            "使用柱形显示维度的数值。纵轴显示分类维度，横轴显示相应的值",
        icon_type: "icon-duidietiaoxingtu",
        component: undefined,
        limit: {
            number: {
                max: 5,
                min: 1,
            },
            text: {
                max: 1,
                min: 1,
            },
        },
    },
    {
        type_id: 4,
        type_name: "面积图",
        description:
            "使用带填充区域的线段显示数据在一个具有顺序性的维度上的变化",
        icon_type: "icon-duidiemianjitu",
        component: undefined,
        limit: {
            number: {
                max: 5,
                min: 1,
            },
            text: {
                max: 1,
                min: 1,
            },
        },
    },
    {
        type_id: 5,
        type_name: "饼图",
        description:
            "通过扇形区块的颜色和弧长（角度、面积）来展现数据的分类和占比情况",
        icon_type: "icon-bingtu",
        component: undefined,
        limit: {
            number: {
                max: 1,
                min: 1,
            },
            text: {
                max: 1,
                min: 1,
            },
        },
    },
    {
        type_id: 6,
        type_name: "散点图",
        description: "将所有的数据以不同颜色的点的形式展现在平面直角坐标系上",
        icon_type: "icon-sandiantu",
        component: undefined,
        limit: {
            number: {
                max: 2,
                min: 2,
            },
            text: {
                max: 1,
                min: 1,
            },
        },
    },
    {
        type_id: 7,
        type_name: "雷达图",
        description: "将不同系列的多个维度的数据量映射到坐标轴上",
        icon_type: "icon-leidatu",
        component: undefined,
        limit: {
            number: {
                max: 5,
                min: 1,
            },
            text: {
                max: 1,
                min: 1,
            },
        },
    },
];
