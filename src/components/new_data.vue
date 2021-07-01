<template>
    <a-row style="margin-top: 32px">
        <a-col :span="22" :offset="1">
            <a-row :gutter="32">
                <a-col :span="8">
                    <a-typography-title :level="3">新建数据</a-typography-title>
                    <p>
                        数据会经过测量、收集、报告和分析，因此它可以使用图表、图像或者其他分析工具进行可视化。数据作为一种关于一些已存在的信息或知识的一般概念，会使用一些可以更好地利用或处理的形式进行呈现或编码。
                    </p>
                </a-col>
                <a-col :span="16">
                    <a-card
                        style="width: 100%"
                        :tab-list="tabList"
                        :active-tab-key="tabKey"
                        @tabChange="(key) => onTabChange(key)"
                    >
                        <div v-if="tabKey === 'upload'">
                            <a-form layout="vertical" :hideRequiredMark="true">
                                <a-form-item
                                    v-bind="validateInfos_upload.fileList"
                                >
                                    <template #label
                                        ><strong>上传文件</strong></template
                                    >
                                    <a-upload-dragger
                                        v-model:fileList="
                                            modelRef_upload.fileList
                                        "
                                        name="file"
                                        :multiple="false"
                                        :accept="'.csv'"
                                        :customRequest="handleUpload"
                                        :beforeUpload="beforeUpload"
                                        @change="handleUploadChange"
                                    >
                                        <p class="ant-upload-drag-icon">
                                            <inbox-outlined />
                                        </p>
                                        <p class="ant-upload-text">
                                            按这里或拖动文件来上传
                                        </p>
                                        <p class="ant-upload-hint">
                                            大小限制：{{
                                                limit.size / (1024 * 1024)
                                            }}
                                            MB，支持格式：*.{{ limit.postfix }}
                                        </p>
                                    </a-upload-dragger>
                                </a-form-item>
                                <a-form-item
                                    v-bind="validateInfos_upload.data_name"
                                >
                                    <template #label
                                        ><strong>数据名称</strong></template
                                    >
                                    <a-input
                                        @blur="
                                            validate_upload('data_name').catch()
                                        "
                                        placeholder="我的新数据"
                                        v-model:value="
                                            modelRef_upload.data_name
                                        "
                                    />
                                </a-form-item>
                                <a-form-item
                                    v-bind="validateInfos_upload.keys_text"
                                >
                                    <template #label
                                        ><strong>维度</strong></template
                                    >
                                    <a-select
                                        mode="multiple"
                                        v-model:value="
                                            modelRef_upload.keys_text
                                        "
                                        style="width: 100%"
                                        placeholder="选择维度列"
                                        @change="setOptions"
                                        :options="keys_text_options"
                                    />
                                </a-form-item>
                                <a-form-item
                                    v-bind="validateInfos_upload.keys_number"
                                >
                                    <template #label
                                        ><strong>指标</strong></template
                                    >
                                    <a-select
                                        mode="multiple"
                                        v-model:value="
                                            modelRef_upload.keys_number
                                        "
                                        style="width: 100%"
                                        placeholder="选择指标列"
                                        @change="setOptions"
                                        :options="keys_number_options"
                                    />
                                </a-form-item>
                            </a-form>
                        </div>
                    </a-card>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
</template>

<script>
import { defineComponent, reactive, ref, toRefs } from "vue";
import { useForm } from "@ant-design-vue/use";
import { InboxOutlined } from "@ant-design/icons-vue";
import Papa from "papaparse";
import jschardet from "jschardet";

export default defineComponent({
    components: {
        InboxOutlined,
    },
    setup() {
        const state = reactive({
            tabKey: "upload",
            all_keys_options: [],
        });

        const limit = {
            size: 100 * 1024 * 1024,
            type: "application/vnd.ms-excel",
            postfix: "csv",
        };

        const tabList = [
            {
                key: "upload",
                tab: "上传数据",
            },
        ];

        const onTabChange = (value) => {
            state.tabKey = value;
        };

        const modelRef_upload = reactive({
            fileList: [],
            parsed: {},
            data_name: "",
            keys_text: [],
            keys_number: [],
        });

        const handleUpload = () => {
            console.log("上传文件");
        };

        const keys_number_options = ref([]);
        const keys_text_options = ref([]);

        const handleUploadChange = ({ file, fileList }) => {
            let resFileList = [...fileList];
            resFileList = resFileList.slice(-1);
            modelRef_upload.fileList = resFileList;
            if (file.error) {
                file.status = "error";
            } else {
                file.status = "done";
            }
            if (fileList.length === 0) {
                // 重置表单
                reset_form();
            }
        };

        const parseConfig = {
            header: true,
            skipEmptyLines: true,
        };

        const reset_form = () => {
            resetFields_upload();
            // 清空备选项
            keys_number_options.value.length = 0;
            keys_text_options.value.length = 0;
        };

        const beforeUpload = (file) => {
            return new Promise((resolve) => {
                // 判断文件大小
                if (file.size > limit.size) {
                    file.error = true;
                    file.response = "文件大小超过限制";
                    resolve();
                    return;
                }
                if (file.type.toLowerCase() !== limit.type) {
                    // 判断文件类型
                    // 不是csv
                    file.error = true;
                    file.response = "不是有效的CSV文件";
                    resolve();
                    return;
                }
                const reader = new FileReader();
                reader.readAsBinaryString(file);
                reader.onload = () => {
                    // 判断文件编码
                    const encoding = jschardet.detect(reader.result);
                    reader.readAsText(file, encoding.encoding);
                    reader.onload = () => {
                        const parsed = Papa.parse(reader.result, parseConfig);
                        console.log(parsed);
                        if (parsed.errors.length > 0) {
                            // 存在错误
                            file.error = true;
                            file.response = "该文件内容存在问题";
                            resolve();
                            return;
                        }
                        // 读取列
                        if (!parsed.meta.fields.every((i) => i.length > 0)) {
                            file.response = "该文件存在空列名";
                            file.error = true;
                            resolve();
                            return;
                        }
                        if (parsed.meta.fields.hasDuplicates()) {
                            file.response = "该文件存在重复列名";
                            file.error = true;
                            resolve();
                            return;
                        }
                        state.all_keys_options.length = 0;
                        parsed.meta.fields.forEach((i) => {
                            state.all_keys_options.push({ value: i });
                        });
                        // 填入备选列名
                        setOptions();
                        // 自动填入文件名
                        modelRef_upload.data_name = file.name.substr(
                            0,
                            file.name.length - 4
                        );
                        modelRef_upload.parsed = parsed;
                        // TODO 按照接口准备上传数据
                        file.error = false;
                        resolve();
                    };
                };
            });
        };

        const setOptions = () => {
            keys_number_options.value = state.all_keys_options.filter(
                (i) => modelRef_upload.keys_text.indexOf(i.value) < 0
            );
            keys_text_options.value = state.all_keys_options.filter(
                (i) => modelRef_upload.keys_number.indexOf(i.value) < 0
            );
        };

        const rulesRef_upload = reactive({
            fileList: [
                {
                    required: true,
                    message: "请选择文件",
                    type: "array",
                },
            ],
            data_name: [
                {
                    trigger: "blur",
                    required: true,
                    message: "请输入数据名称",
                    type: "string",
                },
                {
                    max: 128,
                    message: "图表名称长度上限为128字符",
                },
            ],
            keys_text: [
                {
                    trigger: "change",
                    required: true,
                    message: "请选择维度",
                    type: "array",
                },
            ],
            keys_number: [
                {
                    trigger: "change",
                    required: true,
                    message: "请选择指标",
                    type: "array",
                },
            ],
        });

        const {
            resetFields: resetFields_upload,
            // eslint-disable-next-line no-unused-vars
            validate: validate_upload,
            validateInfos: validateInfos_upload,
        } = useForm(modelRef_upload, rulesRef_upload);

        return {
            ...toRefs(state),
            tabList,
            onTabChange,
            resetFields_upload,
            validateInfos_upload,
            validate_upload,
            modelRef_upload,
            handleUpload,
            beforeUpload,
            handleUploadChange,
            limit,
            keys_number_options,
            keys_text_options,
            setOptions,
        };
    },
});
</script>

<style scoped></style>
