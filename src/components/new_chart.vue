<template>
    <a-row style="margin-top: 32px">
        <a-col :span="22" :offset="1">
            <a-row :gutter="32">
                <a-col :span="8"
                    ><a-typography-title :level="3"
                        >新建图表</a-typography-title
                    >
                    <p>
                        图表是从数据到几何标记对象的图形属性的一个映射，此外图形中还可能包含数据的统计变换，最后绘制在某个特定的坐标系中。
                    </p>
                    <p>
                        <a-typography-text strong>提示：</a-typography-text
                        >图表名称和图表内容可以在稍后修改。
                    </p>
                </a-col>
                <a-col :span="16"
                    ><a-card
                        style="width: 100%"
                        :tab-list="tabList"
                        :active-tab-key="tabKey"
                        @tabChange="(key) => onTabChange(key)"
                    >
                        <div v-if="tabKey === 'blank'">
                            <a-form layout="vertical" :hideRequiredMark="true">
                                <a-form-item
                                    v-bind="validateInfos_blank.chart_name"
                                >
                                    <template #label>
                                        <strong>图表名称</strong>
                                    </template>
                                    <a-input
                                        @blur="
                                            validate_blank('chart_name').catch()
                                        "
                                        placeholder="我的新图表"
                                        v-model:value="
                                            modelRef_blank.chart_name
                                        "
                                    />
                                </a-form-item>
                                <a-form-item
                                    v-bind="validateInfos_blank.data_id"
                                >
                                    <template #label>
                                        <strong>数据集</strong>
                                    </template>
                                    <template #help>
                                        <p>
                                            您可以在数据管理中&nbsp;<a
                                                @click="
                                                    $router.push(
                                                        '/data_management'
                                                    )
                                                "
                                                >查看</a
                                            >&nbsp;您的数据集。
                                        </p>
                                    </template>
                                    <a-select
                                        v-model:value="modelRef_blank.data_id"
                                        :options="data_options"
                                        placeholder="选择一个数据集"
                                    />
                                </a-form-item>
                                <a-form-item
                                    v-bind="validateInfos_blank.type_id"
                                >
                                    <template #label>
                                        <strong>图表类型</strong>
                                    </template>
                                    <a-select
                                        v-model:value="modelRef_blank.type_id"
                                        placeholder="选择一种图表"
                                        option-label-prop="label"
                                    >
                                        <a-select-option
                                            v-for="item in chart_type_options"
                                            :key="item"
                                            :value="item.value"
                                            :label="item.label"
                                            ><div>
                                                <a-row
                                                    type="flex"
                                                    align="middle"
                                                >
                                                    <a-col
                                                        flex="48px"
                                                        style="
                                                            font-size: 32px;
                                                            padding-top: 2px;
                                                            padding-bottom: 2px;
                                                        "
                                                    >
                                                        <icon-font
                                                            :type="
                                                                item.icon_type
                                                            "
                                                        />
                                                    </a-col>
                                                    <a-col flex="auto">
                                                        <a-typography-text
                                                            strong
                                                            >{{
                                                                item.label
                                                            }}</a-typography-text
                                                        >
                                                        <br />
                                                        <a-typography-text
                                                            type="secondary"
                                                            >{{
                                                                item.description
                                                            }}</a-typography-text
                                                        >
                                                    </a-col>
                                                </a-row>
                                            </div>
                                        </a-select-option>
                                    </a-select>
                                    <template #help>
                                        <p v-if="modelRef_blank.type_id">
                                            {{
                                                chart_type_options.find(
                                                    (i) =>
                                                        i.value ===
                                                        modelRef_blank.type_id
                                                ).description + "。"
                                            }}
                                        </p>
                                        <p v-else>
                                            合适的图表类型可以让您事半功倍，我们提供&nbsp;{{
                                                chart_type_options.length
                                            }}&nbsp;种图表，总有一种适合你。
                                        </p>
                                    </template>
                                </a-form-item>
                                <a-form-item>
                                    <a-button
                                        type="primary"
                                        @click.prevent="onSubmit_blank"
                                    />完成
                                    <a-button
                                        style="margin-left: 10px"
                                        @click="$router.go(-1)"
                                    />取消
                                    <template #help
                                        ><p>
                                            <br />
                                            选择<strong>完成</strong>开始编辑图表，选择<strong>取消</strong>返回上一页面。
                                        </p></template
                                    >
                                </a-form-item>
                            </a-form>
                        </div></a-card
                    ></a-col
                >
            </a-row>
        </a-col>
    </a-row>
</template>

<script>
import { defineComponent, onMounted, reactive, toRaw, toRefs } from "vue";
import { useForm } from "@ant-design-vue/use";
import { all_tables } from "@/api/post/all_tables";
import { chart_types } from "@/constant/chart_types";
import { icon_url } from "@/util/iconfont";
import { createFromIconfontCN } from "@ant-design/icons-vue";
import { create_chart } from "@/api/post/create_chart";
import { notification } from "ant-design-vue";
import { useRouter } from "vue-router";

const IconFont = createFromIconfontCN({
    scriptUrl: icon_url,
});

export default defineComponent({
    components: {
        IconFont,
    },
    setup() {
        const router = useRouter();

        const state = reactive({
            tabKey: "blank",
            data_options: [],
            chart_type_options: [],
        });

        const loadTables = () => {
            all_tables().then((response) => {
                if (response.data.status.code === 0) {
                    state.data_options = [];
                    response.data.data.tables.forEach((i) => {
                        state.data_options.push({ value: i.id, label: i.name });
                    });
                }
            });
        };

        const load_chart_type_options = () => {
            state.chart_type_options = [];
            chart_types.forEach((i) => {
                state.chart_type_options.push({
                    value: i.type_id,
                    label: i.type_name,
                    description: i.description,
                    icon_type: i.icon_type,
                });
            });
        };

        const onSubmit_blank = () => {
            validate_blank().then(() => {
                const form = toRaw(modelRef_blank);
                create_chart(
                    form.data_id,
                    form.type_id ? form.type_id : 0,
                    form.chart_name
                )
                    .then((response) => {
                        if (response.data.status.code === 0) {
                            notification["success"]({
                                message: "成功",
                                description:
                                    "已创建图表“" + form.chart_name + "”。",
                            });
                            router.push(
                                "/edit_chart/" + response.data.data.chart_id
                            );
                        } else {
                            notification["error"]({
                                message: "错误",
                                description: response.data.status.message,
                            });
                        }
                    })
                    .catch();
            });
        };

        onMounted(() => {
            loadTables();
            load_chart_type_options();
        });

        const tabList = [
            {
                key: "blank",
                tab: "空白图表",
            },
        ];

        const modelRef_blank = reactive({
            chart_name: "",
            data_id: null,
            type_id: null,
        });

        const rulesRef_blank = reactive({
            chart_name: [
                {
                    trigger: "blur",
                    required: true,
                    message: "请输入图表名称",
                    type: "string",
                },
                {
                    trigger: "blur",
                    max: 128,
                    message: "图表名称长度上限为128字符",
                },
            ],
            data_id: [
                {
                    required: true,
                    message: "请选择数据集",
                },
            ],
            type_id: [
                {
                    required: false,
                    message: "请选择图表类型",
                },
            ],
        });

        const {
            resetFields: resetFields_blank,
            validate: validate_blank,
            validateInfos: validateInfos_blank,
        } = useForm(modelRef_blank, rulesRef_blank);

        const onTabChange = (value) => {
            state.tabKey = value;
        };

        return {
            tabList,
            ...toRefs(state),
            onTabChange,
            resetFields_blank,
            validateInfos_blank,
            validate_blank,
            modelRef_blank,
            onSubmit_blank,
        };
    },
});
</script>

<style scoped></style>
