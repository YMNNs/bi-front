<template>
    <a-page-header @back="$router.go(-1)">
        <template #title>编辑图表</template>
    </a-page-header>
    <a-row :gutter="[16, 16]">
        <a-col :span="4">
            <a-typography-title
                :level="4"
                v-model:content="chart_name"
                :editable="true"
            />
        </a-col>
    </a-row>
    <a-row :gutter="[16, 16]">
        <a-col :span="4">
            <a-row :gutter="[16, 16]">
                <a-col :span="24">
                    <a-input-search
                        placeholder="搜索字段"
                        @search="onSearch_field"
                        v-model:value="search.field"
                    />
                </a-col>
            </a-row>
            <a-row :gutter="[16, 16]">
                <a-col :span="24" style="margin-top: 16px">
                    <a-card size="small">
                        <template #title>
                            维度（&nbsp;<template
                                v-if="limit.text.min !== limit.text.max"
                                >{{ limit.text.min }}-{{
                                    limit.text.max
                                }}</template
                            >
                            <template v-else>{{ limit.number.min }}</template>
                            个）&nbsp;&nbsp;<a-tag
                                color="default"
                                closable
                                @close="clear_filter_field"
                                v-if="
                                    columns.text.length !==
                                    columns.text_display.length
                                "
                                >已过滤
                            </a-tag></template
                        >
                        <a-tree
                            checkable
                            v-model:checkedKeys="checkedKeys_text"
                            :tree-data="columns.text_display"
                            show-icon
                            style="margin-left: -16px"
                        >
                            <template #icon><FieldStringOutlined /></template>
                        </a-tree>
                    </a-card>
                </a-col>
            </a-row>
            <a-row :gutter="[16, 16]">
                <a-col :span="24" style="margin-top: 16px">
                    <a-card size="small">
                        <template #title>
                            指标（&nbsp;<template
                                v-if="limit.number.min !== limit.number.max"
                                >{{ limit.number.min }}-{{
                                    limit.number.max
                                }}</template
                            >
                            <template v-else>{{ limit.number.min }}</template>
                            个）&nbsp;&nbsp;<a-tag
                                color="default"
                                closable
                                @close="clear_filter_field"
                                v-if="
                                    columns.number.length !==
                                    columns.number_display.length
                                "
                                >已过滤
                            </a-tag></template
                        >
                        <a-tree
                            checkable
                            v-model:checkedKeys="checkedKeys_number"
                            :tree-data="columns.number_display"
                            show-icon
                            style="margin-left: -16px"
                        >
                            <template #icon><FieldNumberOutlined /></template>
                        </a-tree>
                    </a-card>
                </a-col>
            </a-row>
        </a-col>
        <a-col :span="6">
            <a-row :gutter="[16, 16]">
                <a-col :span="24">
                    <a-input-search
                        @search="onSearch_chart_type"
                        v-model:value="search.chart_type"
                        placeholder="搜索图表类型"
                    />
                </a-col>
            </a-row>
            <a-row :gutter="[16, 16]">
                <a-col :span="24" style="margin-top: 16px">
                    <a-radio-group
                        v-model:value="type_id"
                        @change="onTypeChange"
                        ><a-card size="small">
                            <template #title>
                                图表类型&nbsp;&nbsp;<a-tag
                                    color="default"
                                    closable
                                    @close="clear_filter_chart_type"
                                    v-if="
                                        chart_types.length !==
                                        chart_types_display.length
                                    "
                                    >已过滤
                                </a-tag></template
                            >

                            <a-card-grid
                                style="
                                    width: calc(1 / 3 * 100%);
                                    text-align: center;
                                "
                                v-for="item in chart_types_display"
                                v-bind:key="item"
                                ><div class="cover-icon">
                                    <icon-font :type="item.icon_type" />
                                </div>
                                <div style="margin-top: 4px">
                                    <a-typography-text strong>{{
                                        item.type_name
                                    }}</a-typography-text>
                                </div>
                                <div style="margin-top: 8px">
                                    <a-radio
                                        :value="item.type_id"
                                        style="margin-left: 8px"
                                    />
                                </div>
                            </a-card-grid>
                        </a-card> </a-radio-group
                ></a-col>
            </a-row>
        </a-col>
        <a-col :span="14">
            <a-row :gutter="[16, 16]">
                <a-col :span="24">
                    <div v-if="error" style="margin-bottom: 16px">
                        <a-alert
                            type="warning"
                            message="图表无法预览"
                            show-icon
                        >
                            <template #description>
                                <a-typography-paragraph>
                                    在预览图表之前，请先修复下列问题：
                                    <ul>
                                        <li
                                            v-for="item in problems.text"
                                            v-bind:key="item"
                                        >
                                            {{ item }}
                                        </li>
                                        <li
                                            v-for="item in problems.number"
                                            v-bind:key="item"
                                        >
                                            {{ item }}
                                        </li>
                                    </ul>
                                    维度和指标的数量限制取决于图表类型。
                                </a-typography-paragraph>
                            </template>
                        </a-alert>
                    </div>
                    <a-card size="small">
                        <template #title> 预览 </template>
                        <graph_1
                            :data="graph_data"
                            :xField="graph_options.xField"
                            :y-field="graph_options.yField"
                            :seriesField="graph_options.seriesField"
                            :key="timeStamp"
                        />
                    </a-card>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
</template>

<script>
//TODO 修改图表信息并保存、更多图表类型、抽出数据处理工具类
import { defineComponent, onMounted, reactive, toRefs, watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { chart_types } from "@/constant/chart_types";
import { view_chart } from "@/api/post/view_chart";
import {
    FieldStringOutlined,
    FieldNumberOutlined,
    createFromIconfontCN,
} from "@ant-design/icons-vue";
import { icon_url } from "@/util/iconfont";
import graph_1 from "@/components/graph/graph_1";
import { table_content } from "@/api/post/table_content";
import { notification } from "ant-design-vue";

const IconFont = createFromIconfontCN({
    scriptUrl: icon_url,
});

export default defineComponent({
    components: {
        IconFont,
        FieldStringOutlined,
        FieldNumberOutlined,
        graph_1,
    },
    setup() {
        const checkedKeys_number = ref([]);
        const checkedKeys_text = ref([]);

        const state = reactive({
            timeStamp: NaN,
            error: true,
            problems: {
                number: ["指标选择过少"],
                text: ["维度选择过少"],
            },
            search: {
                field: "",
                chart_type: "",
            },
            limit: {
                number: {
                    max: 0,
                    min: 0,
                },
                text: {
                    max: 0,
                    min: 0,
                },
            },
            raw_data: [],
            chart_id: NaN,
            type_id: NaN,
            data_id: NaN,
            chart_name: "",
            chart_types: [],
            chart_types_display: [],
            graph_data: [],
            columns: {
                number: [],
                number_display: [],
                text: [],
                text_display: [],
            },
            graph_options: {
                xField: "",
                yField: "",
                seriesField: "",
            },
        });
        // 注入路由
        const route = useRoute();
        const router = useRouter();

        const onSearch_field = () => {
            state.columns.number_display = state.columns.number.filter(
                (i) => i.title.indexOf(state.search.field) !== -1
            );
            state.columns.text_display = state.columns.text.filter(
                (i) => i.title.indexOf(state.search.field) !== -1
            );
        };

        const onSearch_chart_type = () => {
            state.chart_types_display = state.chart_types.filter(
                (i) => i.type_name.indexOf(state.search.chart_type) !== -1
            );
        };

        const update = () => {
            view_chart(state.chart_id).then((response) => {
                if (response.data.status.code === 0) {
                    state.type_id = response.data.data.chart.type_id;
                    state.data_id = response.data.data.data_id;
                    state.chart_name = response.data.data.chart.chart_name;
                    onTypeChange();
                } else {
                    // 没有取到图表
                    router.push("/chart_management");
                }
            });

            table_content(state.data_id, -1, 0).then((response) => {
                if (response.data.status.code === 0) {
                    console.log(response.data.data);
                    state.columns.number = [];
                    state.columns.number_display = [];
                    state.columns.text = [];
                    state.columns.text_display = [];
                    state.raw_data = response.data.data.table.dataSource;
                    response.data.data.table.columns.forEach((i) => {
                        i.slots = {
                            icon: "icon",
                        };
                        if (i.type === "number") {
                            state.columns.number.push(i);
                            state.columns.number_display.push(i);
                            console.log(i.title);
                        }
                        if (i.type === "string") {
                            state.columns.text.push(i);
                            state.columns.text_display.push(i);
                            console.log(i.title);
                        }
                    });
                } else {
                    notification["error"]({
                        message: "错误",
                        description: response.data.status.message,
                    });
                }
            });
        };

        watch([checkedKeys_text, checkedKeys_number], () => {
            state.problems.text = [];
            state.problems.number = [];
            let count = 0;
            if (checkedKeys_text.value.length < state.limit.text.min) {
                state.problems.text.push("维度选择过少");
                count++;
            }
            if (checkedKeys_text.value.length > state.limit.text.max) {
                state.problems.text.push("维度选择过多");
                count++;
            }
            if (checkedKeys_number.value.length < state.limit.number.min) {
                state.problems.number.push("指标选择过少");
                count++;
            }
            if (checkedKeys_number.value.length > state.limit.number.max) {
                state.problems.number.push("指标选择过多");
                count++;
            }
            state.error = count > 0;
            if (!state.error) {
                draw(
                    state.type_id,
                    prepareData(
                        checkedKeys_number.value,
                        checkedKeys_text.value,
                        state.raw_data,
                        state.columns.number
                    )
                );
            }
        });

        const clear_filter_chart_type = () => {
            state.search.chart_type = "";
            onSearch_chart_type();
        };

        const clear_filter_field = () => {
            state.search.field = "";
            onSearch_field();
        };

        const onTypeChange = () => {
            state.limit = state.chart_types.find(
                (i) => i.type_id === state.type_id
            ).limit;
        };

        const prepareData = (number_keys, text_keys, data, columns_number) => {
            const result = [];
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
        };

        const draw = (type_id, data) => {
            console.log(type_id, data);
            state.graph_options.xField = checkedKeys_text.value[0];
            state.graph_options.yField = "value";
            state.graph_options.seriesField = "category";
            state.graph_data = data;
            state.timeStamp = new Date().getTime();
        };

        onMounted(() => {
            // 取参数
            state.chart_id = parseInt(route.params.id[0]);
            // 参数格式不正确
            if (isNaN(state.chart_id)) {
                router.push("/chart_management");
            }
            state.chart_types = chart_types;
            state.chart_types_display = state.chart_types;
            update();
        });

        return {
            ...toRefs(state),
            onSearch_field,
            clear_filter_field,
            onSearch_chart_type,
            clear_filter_chart_type,
            checkedKeys_number,
            checkedKeys_text,
            onTypeChange,
        };
    },
});
</script>

<style scoped>
.cover-icon {
    font-size: 40px;
    text-align: center;
    margin-top: -16px;
}
</style>
