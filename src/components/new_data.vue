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
                                <a-form-item v-if="fileErrorVisible"
                                    ><a-alert
                                        banner
                                        message="您上传的文件存在问题，将鼠标悬停在红色的文件标题上来了解错误信息。"
                                /></a-form-item>
                                <a-form-item v-bind="validateInfos_upload.fileList">
                                    <template #label><strong>上传文件</strong></template>
                                    <a-upload-dragger
                                        :id="dom_map.new_data.select_file"
                                        v-model:fileList="modelRef_upload.fileList"
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
                                        <p class="ant-upload-text">按这里或拖动文件来上传</p>
                                        <p class="ant-upload-hint">
                                            大小限制：{{ limit.size / (1024 * 1024) }} MB，支持格式：*.{{
                                                limit.postfix
                                            }}
                                        </p>
                                    </a-upload-dragger>
                                </a-form-item>
                                <a-form-item v-bind="validateInfos_upload.data_name">
                                    <template #label><strong>数据名称</strong></template>
                                    <template #help>
                                        <p>默认为上传的文件名，您也可以在此处修改。</p>
                                    </template>
                                    <a-input
                                        :id="dom_map.new_data.name"
                                        @blur="validate_upload('data_name').catch()"
                                        placeholder="我的新数据"
                                        v-model:value="modelRef_upload.data_name"
                                    />
                                </a-form-item>
                                <a-form-item v-bind="validateInfos_upload.description">
                                    <template #label><strong>描述</strong></template>
                                    <template #help>
                                        <p>
                                            描述将会显示在<a @click="$router.push('/data_management')"> 数据管理 </a
                                            >页面的列表中
                                        </p>
                                    </template>
                                    <a-textarea
                                        :id="dom_map.new_data.description"
                                        @blur="validate_upload('description').catch()"
                                        placeholder="此数据为..."
                                        v-model:value="modelRef_upload.description"
                                        auto-size
                                    />
                                </a-form-item>
                                <a-form-item v-bind="validateInfos_upload.keys_text">
                                    <template #label><strong>维度</strong></template>
                                    <template #help>
                                        <p>维度一般指自变量。</p>
                                    </template>
                                    <a-select
                                        :id="dom_map.new_data.keys_text"
                                        mode="multiple"
                                        v-model:value="modelRef_upload.keys_text"
                                        style="width: 100%"
                                        placeholder="选择维度列"
                                        @change="setOptions"
                                        :options="keys_text_options"
                                    />
                                </a-form-item>
                                <a-form-item v-bind="validateInfos_upload.keys_number">
                                    <template #label><strong>指标</strong></template>
                                    <template #help>
                                        <p>指标一般指因变量。</p>
                                    </template>
                                    <a-select
                                        :id="dom_map.new_data.keys_number"
                                        mode="multiple"
                                        v-model:value="modelRef_upload.keys_number"
                                        style="width: 100%"
                                        placeholder="选择指标列"
                                        @change="setOptions"
                                        :options="keys_number_options"
                                    />
                                </a-form-item>
                                <a-form-item>
                                    <a-button
                                        type="primary"
                                        @click.prevent="onSubmit_upload"
                                        :loading="submitLoading"
                                        :id="dom_map.new_data.submit"
                                        >完成</a-button
                                    >
                                    <a-button style="margin-left: 10px" @click="$router.go(-1)">取消</a-button>
                                    <template #help
                                        ><p>
                                            <br />
                                            选择<strong>完成</strong>开始编辑图表，选择<strong>取消</strong>返回上一页面。
                                        </p></template
                                    >
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
import { defineComponent, reactive, ref, toRaw, toRefs } from 'vue'
import { InboxOutlined } from '@ant-design/icons-vue'
import Papa from 'papaparse'
import jschardet from 'jschardet'
import { pick, uniq, trim } from 'lodash-es'
import { create_data } from '@/api/post/create_data'
import { Form, notification } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { update_data } from '@/api/post/update_data'
import log from '@/util/logger'
import dom_map from '@/constant/dom_map'
import logger from '@/util/logger'

export default defineComponent({
    components: {
        InboxOutlined,
    },
    setup() {
        const router = useRouter()

        // prettier-ignore
        const state = reactive({
            tabKey: 'upload',           // 标签页
            all_keys_options: [],       // 所有列名选项
            parsed: {},                 // 已读取的数据
            submitLoading: false,       // 提交按钮加载状态
            fileErrorVisible: false,    // 文件错误横幅展示状态
        })

        const limit = {
            size: 100 * 1024 * 1024,
            type: ['application/vnd.ms-excel', 'text/csv'],
            postfix: 'csv',
        }

        const tabList = [
            {
                key: 'upload',
                tab: '上传数据',
            },
        ]

        const onTabChange = (value) => {
            state.tabKey = value
        }

        const modelRef_upload = reactive({
            fileList: [],
            data_name: '',
            description: '',
            keys_text: [],
            keys_number: [],
        })

        const handleUpload = () => {
            log.info('文件已读取')
        }

        const keys_number_options = ref([])
        const keys_text_options = ref([])

        const handleUploadChange = ({ file, fileList }) => {
            reset_form()
            let resFileList = [...fileList]
            resFileList = resFileList.slice(-1)
            modelRef_upload.fileList = resFileList
            if (file.error) {
                file.status = 'error'
                state.fileErrorVisible = true
                // 文件错误时清空列名
                state.all_keys_options.length = 0
            } else {
                file.status = 'done'
                state.fileErrorVisible = false
            }

            if (modelRef_upload.fileList.length > 0) {
                // 自动填入文件名
                modelRef_upload.data_name = file.name.substr(0, file.name.length - 4)
                // 填入备选列名
                setOptions()
            }
        }

        const parseConfig = {
            header: true,
            skipEmptyLines: true,
        }

        const reset_form = () => {
            resetFields_upload()
            // 清空备选项
            keys_number_options.value.length = 0
            keys_text_options.value.length = 0
        }

        const beforeUpload = (file) => {
            log.warn(`当前文件类型：${file.type}`)
            return new Promise((resolve) => {
                // 判断文件大小
                if (file.size > limit.size) {
                    file.error = true
                    file.response = '文件大小超过限制'
                    resolve()
                    logger.warn(file.response)
                    return
                }
                if (limit.type.indexOf(file.type) < 0) {
                    // 判断文件类型
                    // 不是csv
                    file.error = true
                    file.response = '不是有效的 CSV 文件'
                    resolve()
                    logger.warn(file.response)
                    return
                }
                const reader = new FileReader()
                reader.readAsBinaryString(file)
                reader.onload = () => {
                    // 判断文件编码
                    const encoding = jschardet.detect(
                        reader.result.slice(0, reader.result.length < 100 ? reader.result.length : 100)
                    )
                    log.info(`文件编码: ${encoding.encoding}\t准确度: ${encoding.confidence}`)
                    reader.readAsText(file, encoding.encoding)
                    reader.onload = () => {
                        const parsed = Papa.parse(reader.result, parseConfig)
                        if (parsed.errors.length > 0) {
                            // 存在错误
                            file.error = true
                            file.response = '该文件内容存在问题'
                            parsed.errors.forEach((i) => {
                                log.fail(`row #${i.row}\t${i.type}\t${i.message}`)
                            })
                            resolve()
                            logger.warn(file.response)
                            return
                        }
                        // 读取列
                        if (!parsed.meta.fields.every((i) => i.length > 0)) {
                            file.response = '该文件存在空列名'
                            file.error = true
                            resolve()
                            logger.warn(file.response)
                            return
                        }
                        if (parsed.meta.fields.length === uniq(parsed.meta.fields.length)) {
                            file.response = '该文件存在重复列名'
                            file.error = true
                            resolve()
                            logger.warn(file.response)
                            return
                        }
                        if (!parsed.meta.fields.every((i) => i.length === trim(i).length)) {
                            file.response = '该文件的一个或多个列名首尾存在空格'
                            file.error = true
                            resolve()
                            logger.warn(file.response)
                            return
                        }
                        if (!parsed.meta.fields.every((i) => i.getBytesLength() <= 64)) {
                            parsed.meta.fields.forEach((i) => {
                                log.debug(`byteLength: ${i.getBytesLength()}\tfield: ${i}`)
                            })
                            file.response = '该文件的一个或多个列名长度超过 64 字节'
                            file.error = true
                            resolve()
                            logger.warn(file.response)
                            return
                        }
                        state.all_keys_options = parsed.meta.fields.map((i) => {
                            return { value: i }
                        })
                        state.parsed = parsed
                        file.error = false
                        resolve()
                    }
                }
            })
        }

        const setOptions = () => {
            keys_number_options.value = state.all_keys_options.filter(
                (i) => modelRef_upload.keys_text.indexOf(i.value) < 0
            )
            keys_text_options.value = state.all_keys_options.filter(
                (i) => modelRef_upload.keys_number.indexOf(i.value) < 0
            )
        }

        const rulesRef_upload = reactive({
            fileList: [
                {
                    required: true,
                    message: '请选择文件',
                    type: 'array',
                },
            ],
            data_name: [
                {
                    trigger: 'blur',
                    required: true,
                    message: '请输入数据名称',
                    type: 'string',
                },
                {
                    max: 128,
                    message: '数据名称长度上限为 128 字符',
                },
            ],
            description: [
                {
                    trigger: 'blur',
                    required: false,
                    type: 'string',
                },
                {
                    max: 256,
                    message: '描述长度上限为 256 字符',
                },
            ],
            keys_text: [
                {
                    trigger: 'change',
                    required: true,
                    message: '请选择维度',
                    type: 'array',
                },
            ],
            keys_number: [
                {
                    trigger: 'change',
                    required: true,
                    message: '请选择指标',
                    type: 'array',
                },
            ],
        })

        const {
            resetFields: resetFields_upload,
            validate: validate_upload,
            validateInfos: validateInfos_upload,
        } = Form.useForm(modelRef_upload, rulesRef_upload)

        const onSubmit_upload = () => {
            validate_upload().then(() => {
                state.submitLoading = { delay: 100 }
                const form = toRaw(modelRef_upload)
                const keys = form.keys_number.concat(form.keys_text)
                // 筛选需要的列
                const data = state.parsed.data.map((i) => {
                    return pick(i, keys)
                })
                // 写入列信息
                const columns = form.keys_number
                    .map((i) => {
                        return {
                            title: i,
                            key: i,
                            dataIndex: i,
                            type: 'number',
                        }
                    })
                    .concat(
                        form.keys_text.map((j) => {
                            return {
                                title: j,
                                key: j,
                                dataIndex: j,
                                type: 'string',
                            }
                        })
                    )
                create_data(columns)
                    .then((response) => {
                        if (response.data.status.code === 0) {
                            update_data(response.data.data.id, form.data_name, form.description, data).then(
                                (_response) => {
                                    state.submitLoading = false
                                    if (_response.data.status.code === 0) {
                                        notification['success']({
                                            message: '成功',
                                            description: `已创建数据集“${form.data_name}”`,
                                        })
                                        router.push('/data_display/' + response.data.data.id)
                                    } else {
                                        notification['error']({
                                            message: '错误',
                                            description: response.data.status.message,
                                        })
                                    }
                                }
                            )
                        } else {
                            notification['error']({
                                message: '错误',
                                description: response.data.status.message,
                            })
                        }
                    })
                    .catch(() => {
                        state.submitLoading = false
                    })
            })
        }

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
            onSubmit_upload,
            dom_map,
        }
    },
})
</script>

<style scoped></style>
