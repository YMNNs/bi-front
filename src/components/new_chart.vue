<template>
    <a-row style="margin-top: 32px">
        <a-col :span="22" :offset="1">
            <a-row :gutter="32">
                <a-col :span="8"
                    ><a-typography-title :level="3"
                        >新建图表</a-typography-title
                    >
                    <p>图表可以反映数据中不同属性的相关程度和变化趋势。</p>
                    <p>
                        <a-typography-text strong>提示：</a-typography-text
                        >从现有图表复制时将使用与原图表相同的数据集，您可以在稍后修改。
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
                                    >
                                    </a-input>
                                </a-form-item>
                                <a-form-item
                                    v-bind="validateInfos_blank.data_id"
                                >
                                    <template #label>
                                        <strong>数据集</strong>
                                    </template>
                                    <template #help>
                                        <p>
                                            您可以在数据管理中<a
                                                @click="
                                                    $router.push(
                                                        '/data_management'
                                                    )
                                                "
                                                >查看</a
                                            >您的数据集。
                                        </p>
                                    </template>
                                    <a-select
                                        v-model:value="modelRef_blank.data_id"
                                        :options="data_options"
                                    >
                                    </a-select>
                                </a-form-item>
                            </a-form></div></a-card
                ></a-col>
            </a-row>
        </a-col>
    </a-row>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { useForm } from "@ant-design-vue/use";

export default defineComponent({
    setup() {
        const state = reactive({
            tabKey: "blank",
            data_options: [
                {
                    label: "1bc",
                    value: "123",
                },
            ],
        });

        onMounted(() => {});

        const tabList = [
            {
                key: "blank",
                tab: "空白图表",
            },
        ];

        const modelRef_blank = reactive({
            chart_name: "",
            data_id: null,
            type_id: 0,
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
        };
    },
});
</script>

<style scoped></style>
