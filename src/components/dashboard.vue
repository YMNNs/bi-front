<template>
    <!--    添加仪表的抽屉-->
    <a-drawer
        :width="720"
        :visible="visible"
        :body-style="{ paddingBottom: '80px' }"
        @close="onClose"
    >
        <a-typography-title :level="3">添加仪表</a-typography-title>
        <p>
            您可以将图表附加在仪表盘中以便随时查看，仪表的内容将随图表同步更新。
        </p>
        <a-form layout="vertical">
            <a-form-item v-bind="validateInfos.chart_id">
                <template #label>
                    <strong>图表</strong>
                </template>
                <template #help>
                    <p>
                        您可以在图表管理中&nbsp;<a
                            @click="$router.push('/chart_management')"
                            >查看</a
                        >&nbsp;您的图表。
                    </p>
                </template>
                <a-select
                    v-model:value="modelRef.chart_id"
                    :options="chart_options"
                    placeholder="选择一个图表"
                    @change="load_preview"
                >
                </a-select>
            </a-form-item>
            <a-form-item>
                <template #help>
                    <p v-if="modelRef.chart_id && preview_chart.ready">
                        <br />预览将要添加的仪表。
                    </p>
                    <p v-else-if="modelRef.chart_id && !preview_chart.ready">
                        正在载入预览...
                    </p>
                    <p v-else>选择图表后将显示预览。</p>
                </template>
                <Graph_api
                    v-if="modelRef.chart_id && preview_chart.ready"
                    :key="new Date().getTime()"
                    :type_id="preview_chart.type_id"
                    :series-field="preview_chart.seriesField"
                    :x-field="preview_chart.xField"
                    :y-field="preview_chart.yField"
                    :text_keys="preview_chart.text_keys"
                    :number_keys="preview_chart.number_keys"
                    :data="preview_chart.data"
                    :columns="preview_chart.columns"
                ></Graph_api>
            </a-form-item>
        </a-form>
        <div
            :style="{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                padding: '10px 16px',
                background: '#fff',
                textAlign: 'right',
                zIndex: 1,
            }"
        >
            <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
            <a-button type="primary" @click="onSubmit">完成</a-button>
        </div>
    </a-drawer>
    <a-page-header title="仪表盘">
        <template v-slot:extra>
            <a-button key="1" type="primary" v-if="!edit" @click="edit = true"
                >编辑</a-button
            >
            <a-button key="2" type="dashed" @click="showDrawer" v-if="edit">
                <template #icon>
                    <PlusOutlined />
                </template>
            </a-button>
            <a-button
                key="3"
                type="default"
                v-if="edit"
                :disabled="!edited"
                @click="handleReset"
                >重置</a-button
            >
            <a-button
                key="4"
                type="primary"
                v-if="edit && edited"
                @click="onFinish"
                >完成</a-button
            >
            <a-button
                key="5"
                type="default"
                v-if="edit && !edited"
                @click="edit = false"
                >取消</a-button
            >
        </template>
    </a-page-header>
    <a-spin :spinning="!ready" :indicator="indicator">
        <a-list :grid="list_size" :data-source="instruments_display">
            <template #renderItem="{ item }">
                <a-list-item>
                    <a-card size="small">
                        <template #title
                            ><strong>{{
                                item.chart.chart_name
                            }}</strong></template
                        >

                        <Graph_api
                            v-if="ready"
                            :data="
                                dataSources.find(
                                    (i) => i.id === item.chart.data_id
                                ).dataSource
                            "
                            :columns="
                                dataSources
                                    .find((i) => i.id === item.chart.data_id)
                                    .columns.filter((j) => j.type === 'number')
                            "
                            :number_keys="item.chart.keys_number"
                            :text_keys="item.chart.keys_text"
                            :type_id="item.chart.type_id"
                            :key="new Date().getTime()"
                            :x-field="item.chart.xField"
                            :y-field="item.chart.yField"
                            :series-field="item.chart.seriesField"
                        />

                        <template class="ant-card-actions" #actions v-if="edit">
                            <LeftOutlined
                                key="left"
                                v-if="instruments_display.indexOf(item) !== 0"
                                @click="moveLeft(item.index)"
                            />
                            <a-popconfirm @confirm="handleDelete(item.index)"
                                ><template #title>
                                    您可以通过页面上方的
                                    <strong>重置</strong> 按钮撤销此操作。
                                </template>
                                <DeleteOutlined key="delete" />
                            </a-popconfirm>
                            <RightOutlined
                                key="right"
                                v-if="
                                    instruments_display.indexOf(item) !==
                                    instruments_display.length - 1
                                "
                                @click="moveRight(item.index)"
                            />
                        </template>
                    </a-card>
                </a-list-item>
            </template>
        </a-list>
    </a-spin>
</template>

<script>
import {
    defineComponent,
    h,
    onMounted,
    reactive,
    ref,
    toRaw,
    toRefs,
} from "vue";
import { create_instrument } from "@/api/post/create_instrument";
import { view_dashboard } from "@/api/post/view_dashboard";
import { view_chart } from "@/api/post/view_chart";
import { notification } from "ant-design-vue";
import { useForm } from "@ant-design-vue/use";
import { table_content } from "@/api/post/table_content";
import {
    LoadingOutlined,
    DeleteOutlined,
    LeftOutlined,
    RightOutlined,
    PlusOutlined,
} from "@ant-design/icons-vue";
import Graph_api from "@/components/graph/graph_api";
import { edit_dashboard } from "@/api/post/edit_dashboard";
import { all_charts } from "@/api/post/all_charts";

export default defineComponent({
    components: {
        Graph_api,
        DeleteOutlined,
        LeftOutlined,
        RightOutlined,
        PlusOutlined,
    },
    setup() {
        const state = reactive({
            instruments: [],
            instruments_display: [],
            charts: [],
            dataSources: [],
            chart_options: [],
            ready: false,
            edit: false,
            edited: false,
            visible: false,
            list_size_1: {
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 1,
                lg: 1,
                xl: 1,
                xxl: 1,
            },
            list_size_2: {
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 2,
                xl: 2,
                xxl: 2,
            },
            list_size_3: {
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 2,
                xl: 2,
                xxl: 3,
            },
        });

        const preview_chart = reactive({
            data: {},
            columns: [],
            number_keys: [],
            text_keys: [],
            xField: "",
            yField: "",
            seriesField: "",
            type_id: NaN,
            ready: false,
        });

        const modelRef = reactive({
            chart_id: null,
        });

        const rulesRef = reactive({
            chart_id: [
                {
                    required: true,
                    message: "请选择图表",
                    type: "number",
                },
            ],
        });

        const load_charts = () => {
            state.chart_options.length = 0;
            all_charts().then((response) => {
                if (response.data.status.code === 0) {
                    response.data.data.all_charts.charts.forEach((i) => {
                        state.chart_options.push({
                            value: i.id,
                            label: i.chart_name,
                        });
                    });
                }
            });
        };

        const { resetFields, validate, validateInfos } = useForm(
            modelRef,
            rulesRef
        );

        const list_size = ref();

        const indicator = h(LoadingOutlined, {
            style: {
                fontSize: "24px",
            },
            spin: true,
        });

        const update = () => {
            state.ready = false;
            state.edit = false;
            state.edited = false;
            state.charts.length = 0;
            state.dataSources.length = 0;
            view_dashboard().then(async (response) => {
                if (response.data.status.code === 0) {
                    // 请求成功并按照index排序
                    const instruments = response.data.data.instruments.sort(
                        (a, b) => {
                            return a.index - b.index;
                        }
                    );
                    // 汇总图表id
                    const chart_ids = new Set();
                    instruments.forEach((i) => {
                        chart_ids.add(i.chart_id);
                    });
                    // 请求图表信息
                    for (const i of chart_ids) {
                        await view_chart(i).then((response) => {
                            if (response.data.status.code === 0) {
                                // 请求图表信息成功并加入图表列表
                                // 添加图表id属性
                                response.data.data.chart.id = i;
                                state.charts.push(response.data.data.chart);
                            } else {
                                notification["error"]({
                                    message: "错误",
                                    description: response.data.status.message,
                                });
                            }
                        });
                    }
                    // 汇总数据id
                    const data_ids = new Set();
                    state.charts.forEach((_chart) => {
                        data_ids.add(_chart.data_id);
                    });
                    // 请求数据
                    for (const i of data_ids) {
                        await table_content(i, -1, 0).then((response) => {
                            if (response.data.status.code === 0) {
                                // 请求数据成功并加入数据列表
                                // 添加数据id属性
                                response.data.data.table.id = i;
                                state.dataSources.push(
                                    response.data.data.table
                                );
                            } else {
                                notification["error"]({
                                    message: "错误",
                                    description: response.data.status.message,
                                });
                            }
                        });
                    }
                    // 组装仪表
                    instruments.forEach((instrument) => {
                        // 加入图表信息
                        instrument.chart = state.charts.find(
                            (_chart) => _chart.id === instrument.chart_id
                        );
                    });
                    // 设置index
                    rearrangeIndex(instruments);
                    state.instruments = instruments;
                    // 复制为展示图表
                    handleReset();
                    // 设置尺寸
                    state.ready = true;
                } else {
                    notification["error"]({
                        message: "错误",
                        description: response.data.status.message,
                    });
                }
            });
        };

        onMounted(() => {
            update();
        });

        const handleDelete = (index) => {
            const i = state.instruments_display.find(
                (_i) => _i.index === index
            );
            const _index = state.instruments_display.indexOf(i);
            state.instruments_display.splice(_index, 1);
            rearrangeIndex(state.instruments_display);
            reSize();
        };

        const load_preview = () => {
            preview_chart.ready = false;
            preview_chart.columns = [];
            preview_chart.data = null;
            preview_chart.type_id = NaN;
            preview_chart.yField = "";
            preview_chart.xField = "";
            preview_chart.seriesField = "";
            preview_chart.text_keys = [];
            preview_chart.number_keys = [];
            // 请求图表
            view_chart(modelRef.chart_id).then((response) => {
                if (response.data.status.code === 0) {
                    preview_chart.number_keys =
                        response.data.data.chart.keys_number;
                    preview_chart.text_keys =
                        response.data.data.chart.keys_text;
                    preview_chart.type_id = response.data.data.chart.type_id;
                    preview_chart.xField = response.data.data.chart.xField;
                    preview_chart.yField = response.data.data.chart.yField;
                    preview_chart.seriesField =
                        response.data.data.chart.seriesField;
                    table_content(response.data.data.chart.data_id, -1, 0).then(
                        (_response) => {
                            if (_response.data.status.code === 0) {
                                preview_chart.data =
                                    _response.data.data.table.dataSource;
                                preview_chart.columns =
                                    _response.data.data.table.columns;
                                preview_chart.ready = true;
                            } else {
                                notification["error"]({
                                    message: "错误",
                                    description: _response.data.status.message,
                                });
                            }
                        }
                    );
                } else {
                    notification["error"]({
                        message: "错误",
                        description: response.data.status.message,
                    });
                }
            });
        };

        const reSize = () => {
            if (state.instruments_display.length === 2) {
                list_size.value = state.list_size_2;
            } else if (state.instruments_display.length > 2) {
                list_size.value = state.list_size_3;
            } else {
                list_size.value = state.list_size_1;
            }
        };

        const moveLeft = (index) => {
            const i = state.instruments_display.find(
                (_i) => _i.index === index
            );
            const _index = state.instruments_display.indexOf(i);
            state.instruments_display.splice(_index, 1);
            state.instruments_display.splice(_index - 1, 0, i);
            rearrangeIndex(state.instruments_display);
        };

        const moveRight = (index) => {
            const i = state.instruments_display.find(
                (_i) => _i.index === index
            );
            const _index = state.instruments_display.indexOf(i);
            state.instruments_display.splice(_index, 1);
            state.instruments_display.splice(_index + 1, 0, i);
            rearrangeIndex(state.instruments_display);
        };

        const handleReset = () => {
            state.instruments_display = JSON.parse(
                JSON.stringify(state.instruments)
            );
            reSize();
            assessEdit();
        };

        const rearrangeIndex = (array) => {
            console.log(array);
            array.forEach((i, index) => {
                i.index = index + 1;
            });
            array.sort((a, b) => {
                return a.index - b.index;
            });
            assessEdit();
        };

        // 评估是否有已经修改的项目
        const assessEdit = () => {
            state.edited =
                JSON.stringify(state.instruments_display) !==
                JSON.stringify(state.instruments);
        };

        const onFinish = () => {
            edit_dashboard(state.instruments_display).then((response) => {
                if (response.data.status.code === 0) {
                    if (response.data.status.code === 0) {
                        notification["success"]({
                            message: "成功",
                            description: response.data.status.message,
                        });
                        update();
                    } else {
                        notification["error"]({
                            message: "错误",
                            description: response.data.status.message,
                        });
                    }
                }
            });
            state.edit = false;
        };

        const onSubmit = () => {
            validate().then(() => {
                const form = toRaw(modelRef);
                create_instrument(form.chart_id).then((response) => {
                    if (response.data.status.code === 0) {
                        update();
                        onClose();
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
            });
        };

        const showDrawer = () => {
            load_charts();
            state.visible = true;
        };

        const onClose = () => {
            resetFields();
            state.visible = false;
        };

        return {
            ...toRefs(state),
            indicator,
            moveLeft,
            moveRight,
            handleDelete,
            handleReset,
            onFinish,
            list_size,
            showDrawer,
            onClose,
            validateInfos,
            resetFields,
            modelRef,
            onSubmit,
            preview_chart,
            load_preview,
        };
    },
});
</script>

<style scoped></style>
