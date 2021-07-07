<template>
    <!--添加和编辑仪表的抽屉-->
    <a-drawer :width="720" :visible="visible" :body-style="{ paddingBottom: '80px' }" @close="onClose">
        <a-typography-title :level="3" v-if="purpose === 'create'">添加仪表</a-typography-title>
        <a-typography-title :level="3" v-if="purpose === 'edit'">编辑仪表</a-typography-title>
        <p v-if="purpose === 'create'">您可以将图表附加在仪表盘中以便随时查看，并为仪表指定专属的数据子集。</p>
        <p v-if="purpose === 'edit'">正在编辑仪表“{{ modelRef.editing_instrument.chart.chart_name }}”</p>
        <a-form layout="vertical">
            <a-form-item v-bind="validateInfos.chart_id">
                <template #label>
                    <strong>图表</strong>
                </template>
                <template #help>
                    <p>
                        您可以在图表管理中&nbsp;<a @click="$router.push('/chart_management')">查看</a>&nbsp;您的图表。
                    </p>
                </template>
                <a-select
                    v-model:value="modelRef.chart_id"
                    :disabled="purpose === 'edit'"
                    :options="chart_options"
                    placeholder="选择一个图表"
                    @change="load_preview"
                />
            </a-form-item>
            <template v-if="purpose === 'edit'">
                <a-form-item v-bind="validateInfos.selected_keys_text">
                    <template #label>
                        <a-checkbox v-model:checked="modelRef.selected" @change="onCheck" />&nbsp;
                        <strong>筛选维度：</strong>{{ modelRef.col_name }}
                    </template>
                    <a-select
                        mode="multiple"
                        v-model:value="modelRef.selected_keys_text"
                        style="width: 100%"
                        placeholder="选择维度"
                        :disabled="!modelRef.selected"
                        :options="modelRef.all_keys_text"
                        @change="onSelectChange"
                    />
                </a-form-item>
            </template>
            <a-form-item>
                <Graph_api
                    v-if="modelRef.chart_id && preview_chart.ready === 'true'"
                    :key="new Date().getTime()"
                    :type_id="preview_chart.type_id"
                    :series-field="preview_chart.seriesField"
                    :x-field="preview_chart.xField"
                    :y-field="preview_chart.yField"
                    :text_keys="preview_chart.text_keys"
                    :number_keys="preview_chart.number_keys"
                    :data="preview_chart.data_display"
                    :columns="preview_chart.columns"
                />
                <template #help>
                    <p v-if="modelRef.chart_id && preview_chart.ready === 'true'">
                        <br />预览将要<template v-if="purpose === 'create'">添加</template
                        ><template v-if="purpose === 'edit'">编辑</template>的仪表。
                    </p>
                    <p v-else-if="modelRef.chart_id && preview_chart.ready === 'false'">正在载入预览...</p>
                    <p v-else-if="modelRef.chart_id && preview_chart.ready === 'error'">
                        此图表不能用于仪表盘。因为其信息不完整。请在<a
                            @click="$router.push('/edit_chart/' + modelRef.chart_id)"
                        >
                            此处 </a
                        >编辑该图表以解决问题。
                    </p>
                    <p v-else>选择图表后将显示预览。</p>
                </template>
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
            <a-button
                type="primary"
                v-if="purpose === 'create'"
                @click="onSubmit_create"
                :disabled="preview_chart.ready !== 'true'"
                >完成</a-button
            >
            <a-button
                type="primary"
                v-if="purpose === 'edit'"
                @click="onSubmit_edit"
                :disabled="preview_chart.ready !== 'true'"
                >完成</a-button
            >
        </div>
    </a-drawer>
    <a-page-header title="仪表盘">
        <template v-slot:extra>
            <a-button key="1" type="primary" v-if="!edit" @click="edit = true">编辑</a-button>
            <a-button key="2" type="dashed" @click="showDrawer(null)" v-if="edit">
                <template #icon>
                    <PlusOutlined />
                </template>
                添加
            </a-button>
            <a-button key="3" type="default" v-if="edit" :disabled="!edited" @click="handleReset">重置</a-button>
            <a-button key="4" type="primary" v-if="edit && edited" @click="onFinish">完成</a-button>
            <a-button key="5" type="default" v-if="edit && !edited" @click="edit = false">取消</a-button>
        </template>
    </a-page-header>
    <template v-if="incomplete > 0 && !edit">
        <a-alert banner type="warning">
            <template #message> 此页面有 {{ incomplete }} 个图表存在问题。 </template>
            <template #description>
                <p>
                    这些图表缺少必要的信息，请前往
                    <a @click="$router.push('/chart_management')">图表管理</a>
                    中修复相关错误。
                </p>
            </template>
        </a-alert>
        <br />
    </template>
    <a-divider />
    <a-row type="flex" align="middle" :gutter="16">
        <a-col :span="18">
            <div style="display: table; vertical-align: middle">
                <p style="display: table-cell">
                    <a-typography-text strong
                        >当前显示
                        {{ instruments_display.length }}
                        个条目 </a-typography-text
                    >&nbsp;
                </p>
            </div>
        </a-col>
        <a-col :span="6">
            <a-select
                v-model:value="list_size"
                style="width: 100%"
                ref="select"
                size="large"
                placeholder="大小"
                :options="size_options"
                @change="onSizeChange"
            />
        </a-col>
    </a-row>
    <a-divider />

    <a-spin :spinning="!ready" :indicator="indicator">
        <a-list :grid="{ gutter: 16, column: list_size }" :data-source="instruments_display">
            <template #renderItem="{ item }">
                <a-list-item>
                    <a-card size="small">
                        <template #title
                            ><a-tooltip title="此图表不完整。" color="red" v-if="item.chart.incomplete">
                                <WarningTwoTone twoToneColor="#ff4d4f" style="margin-right: 4px" /> </a-tooltip
                            ><strong>{{ item.chart.chart_name }}</strong></template
                        >

                        <Graph_api
                            v-if="ready"
                            :data="dataSources.find((i) => i.id === item.data_id).dataSource"
                            :columns="
                                dataSources
                                    .find((i) => i.id === item.data_id)
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
                            <EditOutlined key="edit" v-if="!item.chart.incomplete" @click="showDrawer(item.id)" />
                            <a-popconfirm @confirm="handleDelete(item.index)"
                                ><template #title>
                                    您可以通过页面上方的
                                    <strong>重置</strong> 按钮撤销此操作。
                                </template>
                                <DeleteOutlined key="delete" />
                            </a-popconfirm>
                            <RightOutlined
                                key="right"
                                v-if="instruments_display.indexOf(item) !== instruments_display.length - 1"
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
import { defineComponent, h, onMounted, reactive, ref, toRaw, toRefs } from 'vue'
import { create_instrument } from '@/api/post/create_instrument'
import { view_dashboard } from '@/api/post/view_dashboard'
import { view_chart } from '@/api/post/view_chart'
import { Form, notification } from 'ant-design-vue'
import { get_dashboard_size } from '@/api/post/get_dashboard_size'
import { get_data_keys } from '@/api/post/get_data_keys'
import { change_dashboard_size } from '@/api/post/change_dashboard_size'
import { table_content } from '@/api/post/table_content'
import {
    LoadingOutlined,
    DeleteOutlined,
    LeftOutlined,
    RightOutlined,
    PlusOutlined,
    WarningTwoTone,
    EditOutlined,
} from '@ant-design/icons-vue'
import Graph_api from '@/components/graph/graph_api'
import { edit_dashboard } from '@/api/post/edit_dashboard'
import { all_charts } from '@/api/post/all_charts'
import { cloneDeep } from 'lodash-es'

export default defineComponent({
    components: {
        Graph_api,
        DeleteOutlined,
        LeftOutlined,
        RightOutlined,
        PlusOutlined,
        WarningTwoTone,
        EditOutlined,
    },
    setup() {
        /* eslint-disable*/
        const state = reactive({
            incomplete: 0,                  // 不完整的仪表数量
            instruments: [],                // 原始仪表
            instruments_display: [],        // 显示的仪表
            charts: [],                     // 图表
            dataSources: [],                // 数据
            chart_options: [],              // 图表选项
            ready: false,                   // 仪表可展示状态
            edit: false,                    // 编辑状态
            edited: false,                  // 已编辑标识
            visible: false,                 // 抽屉可见性
            size_options: [],               // 仪表盘尺寸选项
            purpose: "create",              // 当前意图
        });

        const preview_chart = reactive({
            data: {},                       // 原始数据
            data_display: {},               // 展示的数据
            columns: [],                    // 列信息
            number_keys: [],                // 指标列名
            text_keys: [],                  // 维度列名
            xField: "",                     // 自变量名
            yField: "",                     // 因变量名
            seriesField: "",                // 分类名
            type_id: NaN,                   // 类型id
            ready: "false",                 // 图表状态
        });

        const modelRef = reactive({
            chart_id: null,                 // 图表id
            data_id: null,                  // 数据id
            col_name: "",                   // 列名
            editing_instrument: {},         // 正在编辑的仪表
            selected_keys_text: [],         // 选择的维度值
            all_keys_text: [],              // 全部可用维度值
            selected: true,                 // 复选框状态
        });

        /* eslint-enable*/

        const list_size = ref(0)

        const rulesRef = reactive({
            chart_id: [
                {
                    required: true,
                    message: '请选择图表',
                    type: 'number',
                },
            ],
        })

        const load_charts = () => {
            state.chart_options.length = 0
            all_charts().then((response) => {
                if (response.data.status.code === 0) {
                    response.data.data.all_charts.charts.forEach((i) => {
                        state.chart_options.push({
                            value: i.id,
                            label: i.chart_name,
                        })
                    })
                }
            })
        }

        const indicator = h(LoadingOutlined, {
            style: {
                fontSize: '24px',
            },
            spin: true,
        })

        const onSizeChange = (value) => {
            change_dashboard_size(value).then((response) => {
                // eslint-disable-next-line no-empty
                if (response.data.status.code === 0) {
                } else {
                    notification['error']({
                        message: '错误',
                        description: response.data.status.message,
                    })
                }
            })
        }

        const update = () => {
            get_dashboard_size().then((response) => {
                if (response.data.status.code === 0) {
                    list_size.value = response.data.data.size
                } else {
                    notification['error']({
                        message: '错误',
                        description: response.data.status.message,
                    })
                }
            })
            state.incomplete = 0
            state.ready = false
            state.edit = false
            state.edited = false
            state.charts.length = 0
            state.dataSources.length = 0
            view_dashboard().then(async (response) => {
                if (response.data.status.code === 0) {
                    if (!response.data.data) {
                        // 仪表盘为空
                        state.ready = true
                        return
                    }
                    // 请求成功并按照index排序
                    const instruments = response.data.data.instruments.sort((a, b) => {
                        return a.index - b.index
                    })
                    // 汇总图表id
                    // 将选择的keys还原为对象
                    const chart_ids = new Set()
                    instruments.forEach((i) => {
                        chart_ids.add(i.chart_id)
                        i.selected_keys = JSON.parse(i.selected_keys)
                    })
                    // 请求图表信息
                    for (const i of chart_ids) {
                        await view_chart(i).then((response) => {
                            if (response.data.status.code === 0) {
                                // 请求图表信息成功并加入图表列表
                                // 添加图表id属性
                                response.data.data.chart.id = i
                                if (
                                    !response.data.data.chart.keys_number ||
                                    response.data.data.chart.keys_number.length === 0 ||
                                    !response.data.data.chart.keys_text ||
                                    response.data.data.chart.keys_text.length === 0
                                ) {
                                    // 图表不完整
                                    state.incomplete += 1
                                    response.data.data.chart.incomplete = true
                                }
                                // 删除图表中的数据id
                                // delete response.data.data.chart.data_id;
                                state.charts.push(response.data.data.chart)
                            } else {
                                notification['error']({
                                    message: '错误',
                                    description: response.data.status.message,
                                })
                            }
                        })
                    }
                    // 汇总数据id，从仪表中取
                    const data_ids = new Set()
                    instruments.forEach((instrument) => {
                        data_ids.add(instrument.data_id)
                    })
                    // 请求数据
                    for (const i of data_ids) {
                        await table_content(i, -1, 0).then((response) => {
                            if (response.data.status.code === 0) {
                                // 请求数据成功并加入数据列表
                                // 添加数据id属性
                                response.data.data.table.id = i
                                state.dataSources.push(response.data.data.table)
                            } else {
                                notification['error']({
                                    message: '错误',
                                    description: response.data.status.message,
                                })
                            }
                        })
                    }
                    // 组装仪表
                    instruments.forEach((instrument) => {
                        // 加入图表信息
                        instrument.chart = state.charts.find((_chart) => _chart.id === instrument.chart_id)
                        // 加入用于显示的数据
                    })
                    // 设置index
                    rearrangeIndex(instruments)
                    state.instruments = instruments
                    console.log('全部仪表信息')
                    console.log(instruments)
                    // 复制为展示图表
                    handleReset()
                    // 设置尺寸
                    state.ready = true
                } else {
                    notification['error']({
                        message: '错误',
                        description: response.data.status.message,
                    })
                }
            })
        }

        onMounted(() => {
            for (let i = 1; i <= 4; i++) {
                state.size_options.push({
                    label: '每行显示 ' + i + ' 个',
                    value: i,
                })
            }
            update()
        })

        const handleDelete = (index) => {
            const i = state.instruments_display.find((_i) => _i.index === index)
            const _index = state.instruments_display.indexOf(i)
            state.instruments_display.splice(_index, 1)
            rearrangeIndex(state.instruments_display)
        }

        const load_preview = () => {
            preview_chart.ready = 'false'
            preview_chart.columns = []
            preview_chart.data = null
            preview_chart.type_id = NaN
            preview_chart.yField = ''
            preview_chart.xField = ''
            preview_chart.seriesField = ''
            preview_chart.text_keys = []
            preview_chart.number_keys = []
            // 请求图表
            view_chart(modelRef.chart_id).then((response) => {
                if (response.data.status.code === 0) {
                    if (
                        !response.data.data.chart.keys_number ||
                        response.data.data.chart.keys_number.length === 0 ||
                        !response.data.data.chart.keys_text ||
                        response.data.data.chart.keys_text.length === 0
                    ) {
                        //图表不完整
                        preview_chart.ready = 'error'
                        return
                    }
                    preview_chart.number_keys = response.data.data.chart.keys_number
                    preview_chart.text_keys = response.data.data.chart.keys_text
                    preview_chart.type_id = response.data.data.chart.type_id
                    preview_chart.xField = response.data.data.chart.xField
                    preview_chart.yField = response.data.data.chart.yField
                    preview_chart.seriesField = response.data.data.chart.seriesField
                    // // 如果有仪表就用仪表的数据id
                    // if (state.purpose === "edit") {
                    //     response.data.data.chart.data_id =
                    //         modelRef.editing_instrument.data_id;
                    // }
                    table_content(response.data.data.chart.data_id, -1, 0).then((_response) => {
                        if (_response.data.status.code === 0) {
                            preview_chart.data = _response.data.data.table.dataSource
                            preview_chart.data_display = preview_chart.data
                            preview_chart.columns = _response.data.data.table.columns
                            preview_chart.ready = 'true'
                            onSelectChange()
                        } else {
                            notification['error']({
                                message: '错误',
                                description: _response.data.status.message,
                            })
                        }
                    })
                } else {
                    notification['error']({
                        message: '错误',
                        description: response.data.status.message,
                    })
                }
            })
        }

        const moveLeft = (index) => {
            const i = state.instruments_display.find((_i) => _i.index === index)
            const _index = state.instruments_display.indexOf(i)
            state.instruments_display.splice(_index, 1)
            state.instruments_display.splice(_index - 1, 0, i)
            rearrangeIndex(state.instruments_display)
        }

        const moveRight = (index) => {
            const i = state.instruments_display.find((_i) => _i.index === index)
            const _index = state.instruments_display.indexOf(i)
            state.instruments_display.splice(_index, 1)
            state.instruments_display.splice(_index + 1, 0, i)
            rearrangeIndex(state.instruments_display)
        }

        const handleReset = () => {
            state.instruments_display = cloneDeep(state.instruments)
            assessEdit()
        }

        const rearrangeIndex = (array) => {
            array.forEach((i, index) => {
                i.index = index + 1
            })
            array.sort((a, b) => {
                return a.index - b.index
            })
            assessEdit()
        }

        // 评估是否有已经修改的项目
        const assessEdit = () => {
            state.edited = JSON.stringify(state.instruments_display) !== JSON.stringify(state.instruments)
        }

        const onFinish = () => {
            const request_data = cloneDeep(state.instruments_display)
            // 将select_keys格式化为字符串
            request_data.forEach((i) => {
                i.selected_keys = JSON.stringify(i.selected_keys)
            })
            edit_dashboard(request_data).then((response) => {
                if (response.data.status.code === 0) {
                    if (response.data.status.code === 0) {
                        notification['success']({
                            message: '成功',
                            description: response.data.status.message,
                        })
                        update()
                    } else {
                        notification['error']({
                            message: '错误',
                            description: response.data.status.message,
                        })
                    }
                }
            })
            state.edit = false
        }

        const onSubmit_create = () => {
            Form.useForm(modelRef, rulesRef)
                .validate()
                .then(() => {
                    const form = toRaw(modelRef)
                    create_instrument(form.chart_id).then((response) => {
                        if (response.data.status.code === 0) {
                            update()
                            onClose()
                            notification['success']({
                                message: '成功',
                                description: response.data.status.message,
                            })
                        } else {
                            notification['error']({
                                message: '错误',
                                description: response.data.status.message,
                            })
                        }
                    })
                })
        }

        const showDrawer = (target) => {
            // 打开时重置表单
            // 打开时重置表单
            resetFields()
            console.log(target)
            if (target) {
                // 编辑图表
                state.purpose = 'edit'
                // 填入model
                modelRef.editing_instrument = state.instruments_display.find((i) => i.id === target)
                modelRef.chart_id = modelRef.editing_instrument.chart.id
                // 填入数据id
                modelRef.data_id = modelRef.editing_instrument.chart.data_id
                // 填入已选择的维度项目
                modelRef.selected_keys_text = modelRef.editing_instrument.selected_keys
                // 填入复选框
                modelRef.selected = modelRef.selected_keys_text.length > 0
                // 填入列名
                table_content(
                    modelRef.editing_instrument.chart.data_id,
                    state.dataSources.find((i) => i.id === modelRef.editing_instrument.chart.data_id) ? 0 : -1,
                    0
                ).then((response) => {
                    if (response.data.status.code === 0) {
                        modelRef.col_name = response.data.data.table.columns.find(
                            (i) => i.key === modelRef.editing_instrument.chart.keys_text[0]
                        ).title
                        if (response.data.data.table.dataSources) {
                            // 补充到DataSources
                            state.dataSources.push(response.data.data.table)
                        }
                    }
                })
                // 填入可用维度项目
                get_data_keys(
                    modelRef.editing_instrument.chart.data_id,
                    modelRef.editing_instrument.chart.keys_text[0]
                ).then((response) => {
                    if (response.data.status.code === 0) {
                        response.data.data.keys.forEach((i) => {
                            modelRef.all_keys_text.push({ label: i, value: i })
                        })
                    }
                })
                load_preview()
            } else {
                // 添加图表
                state.purpose = 'create'
            }
            console.log(modelRef)
            load_charts()
            state.visible = true
        }

        const onCheck = () => {
            if (!modelRef.selected) {
                // 未选中就清空筛选列
                modelRef.selected_keys_text.length = 0
                // 重置数据
                preview_chart.data_display = preview_chart.data
            } else if (modelRef.selected_keys_text.length === 0) {
                // 选中时加满
                modelRef.all_keys_text.forEach((i) => modelRef.selected_keys_text.push(i.value))
            }
        }

        const onSelectChange = () => {
            if (modelRef.selected_keys_text.length === 0) {
                // 筛选列为空时取消勾选
                modelRef.selected = false
                // 重置数据
                preview_chart.data_display = preview_chart.data
            } else {
                // 过滤数据
                preview_chart.data_display = preview_chart.data.filter(
                    (i) => modelRef.selected_keys_text.indexOf(i[modelRef.editing_instrument.chart.keys_text[0]]) >= 0
                )
            }
        }

        const onClose = () => {
            state.visible = false
        }

        const { resetFields, validate, validateInfos } = Form.useForm(modelRef, rulesRef)

        const onSubmit_edit = () => {
            const state_instrument = state.instruments_display.find((i) => i.id === modelRef.editing_instrument.id)
            console.log(!state_instrument.selected_keys.elementEquals(modelRef.selected_keys_text))
            if (!state_instrument.selected_keys.elementEquals(modelRef.selected_keys_text)) {
                console.log('图表被修改')
                // 被修改
                state_instrument.selected_keys = cloneDeep(modelRef.selected_keys_text)
                // 创建新的数据
                const new_data = cloneDeep(state.dataSources.find((i) => i.id === state_instrument.chart.data_id))
                new_data.id = new Date().getTime() * -1
                new_data.dataSource = new_data.dataSource.filter((i) =>
                    state_instrument.selected_keys.length > 0
                        ? state_instrument.selected_keys.indexOf(i[state_instrument.chart.keys_text[0]]) >= 0
                        : true
                )
                state.dataSources.push(new_data)
                state_instrument.data_id = new_data.id
            }
            console.log(state.instruments_display)
            console.log(state.dataSources)
            assessEdit()
            onClose()
        }

        return {
            ...toRefs(state),
            indicator,
            moveLeft,
            moveRight,
            handleDelete,
            handleReset,
            onFinish,
            showDrawer,
            onClose,
            modelRef,
            onSubmit_create,
            preview_chart,
            load_preview,
            list_size,
            onSizeChange,
            onSubmit_edit,
            resetFields,
            validateInfos,
            validate,
            onCheck,
            onSelectChange,
        }
    },
})
</script>

<style scoped></style>
