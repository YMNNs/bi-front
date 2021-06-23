<template>
    <a-page-header @back="$router.go(-1)">
        <template #title>编辑图表</template>
        <template #extra>
            <a-button
                key="2"
                @click="onReset"
                :disabled="change_list.length === 0"
                >重置</a-button
            >
            <a-button
                key="1"
                type="primary"
                @click="onSubmit"
                :disabled="save_disabled"
                >保存图表</a-button
            >
        </template>
    </a-page-header>
    <a-row :gutter="[16, 16]">
        <a-col :span="4">
            <a-typography-title
                :level="4"
                v-model:content="graph_options.chart_name"
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
                            <template v-else>{{ limit.text.min }}</template>
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
                        v-model:value="graph_options.type_id"
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
                    <div v-if="error">
                        <a-alert
                            type="warning"
                            message="图表无法预览"
                            show-icon
                            banner
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
                    <a-card size="small" v-if="!error">
                        <a-spin
                            :spinning="!ready"
                            :delay="500"
                            :indicator="indicator"
                        >
                            <Graph_api
                                :data="raw_data"
                                :columns="columns.number"
                                :number_keys="checkedKeys_number"
                                :text_keys="checkedKeys_text"
                                :type_id="graph_options.type_id"
                                :key="timeStamp"
                                :x-field="graph_options.xField"
                                :y-field="graph_options.yField"
                                :series-field="graph_options.seriesField"
                            />
                        </a-spin>
                    </a-card>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
</template>

<script>
import {
    defineComponent,
    onMounted,
    reactive,
    toRefs,
    watch,
    ref,
    computed,
    h,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { chart_types } from "@/constant/chart_types";
import { view_chart } from "@/api/post/view_chart";
import {
    FieldStringOutlined,
    FieldNumberOutlined,
    LoadingOutlined,
    createFromIconfontCN,
} from "@ant-design/icons-vue";
import { icon_url } from "@/util/iconfont";
import { table_content } from "@/api/post/table_content";
import { notification } from "ant-design-vue";
import Graph_api from "@/components/graph/graph_api";
import { edit_chart } from "@/api/post/edit_chart";

const IconFont = createFromIconfontCN({
    scriptUrl: icon_url,
});

export default defineComponent({
    components: {
        Graph_api,
        IconFont,
        FieldStringOutlined,
        FieldNumberOutlined,
    },
    setup() {
        const checkedKeys_number = ref([]);
        const checkedKeys_text = ref([]);

        const indicator = h(LoadingOutlined, {
            style: {
                fontSize: "24px",
            },
            spin: true,
        });

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
            data_id: NaN,
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
                type_id: NaN,
                chart_name: "",
                keys_number: [],
                keys_text: [],
                xField: "",
                yField: "",
                seriesField: "",
            },
            graph_options_original: {
                type_id: NaN,
                chart_name: "",
                keys_number: [],
                keys_text: [],
                xField: "",
                yField: "",
                seriesField: "",
            },
            ready: false,
            change_list: [],
            skip_check: false,
        });
        // 注入路由
        const route = useRoute();
        const router = useRouter();

        const save_disabled = computed(
            () => state.error || state.change_list.length === 0
        );

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
            state.ready = false;
            state.chart_types_display = state.chart_types;
            view_chart(state.chart_id)
                .then((response) => {
                    if (response.data.status.code === 0) {
                        state.data_id = response.data.data.chart.data_id;
                        // console.log("有图表信息");
                        Object.keys(state.graph_options_original).forEach(
                            (key) => {
                                state.graph_options_original[key] =
                                    response.data.data.chart[key];
                            }
                        );
                        state.graph_options = JSON.parse(
                            JSON.stringify(state.graph_options_original)
                        );
                        onTypeInit();
                        // console.log(
                        //     response.data.data.chart.last_modified_time
                        // );
                    } else {
                        // 没有取到图表
                        router.push("/chart_management");
                    }
                })
                .then(() => {
                    table_content(state.data_id, -1, 0).then((response) => {
                        if (response.data.status.code === 0) {
                            // console.log("有数据信息");
                            state.columns.number = [];
                            state.columns.number_display = [];
                            state.columns.text = [];
                            state.columns.text_display = [];
                            state.raw_data =
                                response.data.data.table.dataSource;
                            response.data.data.table.columns.forEach((i) => {
                                i.slots = {
                                    icon: "icon",
                                };
                            });
                            state.columns.number =
                                response.data.data.table.columns.filter(
                                    (i) => i.type === "number"
                                );
                            state.columns.number_display = state.columns.number;
                            state.columns.text =
                                response.data.data.table.columns.filter(
                                    (i) => i.type === "string"
                                );
                            state.columns.text_display = state.columns.text;
                            checkedKeys_text.value = JSON.parse(
                                JSON.stringify(
                                    state.graph_options_original.keys_text
                                )
                            );
                            checkedKeys_number.value = JSON.parse(
                                JSON.stringify(
                                    state.graph_options_original.keys_number
                                )
                            );
                        } else {
                            notification["error"]({
                                message: "错误",
                                description: response.data.status.message,
                            });
                        }
                    });
                });
        };

        watch([checkedKeys_text, checkedKeys_number], () => validate_keys());

        const validate_keys = () => {
            // console.log("验证keys");
            // console.log(state.limit);
            state.problems.text = [];
            state.problems.number = [];
            state.graph_options.keys_number = checkedKeys_number.value;
            state.graph_options.keys_text = checkedKeys_text.value;
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
                draw();
            }
        };

        const clear_filter_chart_type = () => {
            state.search.chart_type = "";
            onSearch_chart_type();
        };

        const clear_filter_field = () => {
            state.search.field = "";
            onSearch_field();
        };

        const onTypeChange = () => {
            onTypeInit();
            validate_keys();
        };

        const onTypeInit = () => {
            state.limit = state.chart_types.find(
                (i) => i.type_id === state.graph_options.type_id
            ).limit;
        };

        const draw = () => {
            // console.log("绘制图表");
            // 通过更新key来绘图
            state.timeStamp = new Date().getTime();
            state.ready = true;
        };

        onMounted(() => {
            // 取参数
            state.chart_id = parseInt(route.params.id);
            console.log("chart_id ", state.chart_id);
            // 参数格式不正确
            if (isNaN(state.chart_id)) {
                router.push("/chart_management");
            }
            state.chart_types = chart_types;
            update();
        });

        watch(
            () => state.graph_options,
            () => {
                if (state.skip_check) {
                    return;
                }
                update_change_list();
                setTimeout(() => {
                    state.skip_check = false;
                    update_change_list();
                }, 3000);
                state.skip_check = true;
            },
            { deep: true }
        );

        const update_change_list = () => {
            state.change_list = [];
            Object.keys(state.graph_options_original).forEach((key) => {
                if (
                    state.graph_options_original[key] !==
                    state.graph_options[key]
                ) {
                    if (state.graph_options[key] instanceof Array) {
                        if (
                            !state.graph_options[key].elementEquals(
                                state.graph_options_original[key]
                            )
                        ) {
                            state.change_list.push({
                                key: key,
                                value: state.graph_options[key],
                            });
                        }
                    } else {
                        state.change_list.push({
                            key: key,
                            value: state.graph_options[key],
                        });
                    }
                }
            });
        };

        const onSubmit = () => {
            if (state.change_list.length > 0) {
                const chart = {};
                state.change_list.forEach((i) => {
                    chart[i.key] = i.value;
                });
                // console.log(chart);
                edit_chart(chart).then((response) => {
                    if (response.data.status.code === 0) {
                        notification["success"]({
                            message: "成功",
                            description: response.data.status.message,
                        });
                    } else {
                        notification["error"]({
                            message: "错误",
                            description: response.data.status.message,
                        });
                    }
                });
            }
        };

        const onReset = () => {
            update();
            clear_filter_chart_type();
            clear_filter_field();
        };

        return {
            ...toRefs(state),
            onSearch_field,
            clear_filter_field,
            onSearch_chart_type,
            clear_filter_chart_type,
            checkedKeys_number,
            checkedKeys_text,
            onTypeChange,
            onSubmit,
            onReset,
            save_disabled,
            indicator,
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
