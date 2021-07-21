<template>
    <div>
        <a-alert message="您的图表限额已经用尽，无法创建新的图表。" banner v-if="available === 0" />
        <a-page-header title="图表" sub-title="此页面列出了您所有的图表">
            <template v-slot:extra>
                <a-button key="1" type="primary" @click.prevent="$router.push('/new_chart')" :disabled="available === 0"
                    >新建图表</a-button
                >
            </template>
            <a-row type="flex" :gutter="32">
                <a-col>
                    <a-statistic title="图表限额" :value="quota" />
                </a-col>
                <a-col>
                    <a-statistic title="已创建" :value="used" />
                </a-col>
                <a-col>
                    <a-statistic title="可用" :value="available" />
                </a-col>
            </a-row>
        </a-page-header>
        <!--搜索框-->
        <a-divider />
        <a-row type="flex" align="middle" :gutter="16">
            <a-col :span="12">
                <div style="display: table; vertical-align: middle">
                    <p style="display: table-cell">
                        <a-typography-text strong
                            >当前显示
                            {{ chartsDisplay.length }}
                            个条目（共
                            {{ charts.length }} 个） </a-typography-text
                        >&nbsp;
                        <a-tag
                            color="default"
                            closable
                            @close="clear_filter"
                            v-if="chartsDisplay.length !== charts.length"
                            >已过滤
                        </a-tag>
                    </p>
                </div>
            </a-col>
            <a-col :span="6">
                <a-input-search
                    :id="dom_map.chart_management.search"
                    v-model:value="searchQuery"
                    placeholder="搜索"
                    size="large"
                    @search="onSearch"
                />
            </a-col>
            <a-col :span="6">
                <a-select
                    :id="dom_map.chart_management.sort"
                    v-model:value="filter"
                    style="width: 100%"
                    ref="select"
                    size="large"
                    @change="handleSelectChange"
                    placeholder="排序方式"
                >
                    <a-select-opt-group label="排序">
                        <a-select-option value="name">名称</a-select-option>
                        <a-select-option value="last_update">最近更新 </a-select-option>
                    </a-select-opt-group>
                </a-select>
            </a-col>
        </a-row>
        <a-divider />
        <a-row>
            <a-col :span="24">
                <a-list
                    :grid="{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 3,
                        xl: 4,
                        xxl: 4,
                    }"
                    :data-source="chartsDisplay"
                >
                    <template #renderItem="{ item }">
                        <a-list-item>
                            <a-card hoverable>
                                <template class="ant-card-actions" #actions>
                                    <edit-outlined key="edit" @click="handleEdit(item.id)" />
                                    <a-popconfirm
                                        :title="`此图表与 ${item.relatedDashboardItem} 个仪表盘条目关联。删除此图表后，关联的仪表盘条目将被一并删除且不可恢复。`"
                                        @confirm="handleDelete(item.id)"
                                        v-if="item.relatedDashboardItem > 0"
                                    >
                                        <DeleteOutlined key="delete" />
                                    </a-popconfirm>
                                    <a-popconfirm
                                        title="图表删除后将不可恢复，您确定要删除吗？"
                                        @confirm="handleDelete(item.id)"
                                        v-else
                                    >
                                        <DeleteOutlined key="delete" />
                                    </a-popconfirm>
                                </template>
                                <template #cover>
                                    <div class="cover-icon">
                                        <icon-font :type="item.icon_type" />
                                    </div>
                                </template>
                                <a-card-meta :title="item.chart_name" @click="handleEdit(item.id)">
                                    <template #description>{{ item.type_name }} </template>
                                </a-card-meta>
                            </a-card>
                        </a-list-item>
                    </template>
                </a-list>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { all_charts } from '@/api/post/all_charts'
import { createFromIconfontCN } from '@ant-design/icons-vue'
import { icon_url } from '@/util/iconfont'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { delete_chart } from '@/api/post/delete_chart'
import { notification } from 'ant-design-vue'
import { chart_types } from '@/constant/chart_types'
import { useRouter } from 'vue-router'
import { cloneDeep } from 'lodash-es'
import log from '@/util/logger'
import dom_map from '@/constant/dom_map'
import { view_dashboard } from '@/api/post/view_dashboard'

const IconFont = createFromIconfontCN({
    scriptUrl: icon_url,
})

export default defineComponent({
    components: {
        IconFont,
        EditOutlined,
        DeleteOutlined,
    },
    setup() {
        const router = useRouter()

        // prettier-ignore
        const state = reactive({
            quota: NaN,                     // 图表限额
            used: NaN,                      // 已用限额
            available: NaN,                 // 可用数量
            charts: [],                     // 原始图表
            chartsDisplay: [],              // 展示图表
            searchQuery: '',                // 搜索词
            filter: 'last_update',          // 过滤器
            dashboardData: []               // 仪表盘条目
        })

        const handleClickCard = () => {
            log.debug('click')
        }

        const handleEdit = (id) => {
            router.push('/edit_chart/' + id)
        }

        const handleDelete = (id) => {
            delete_chart(id).then((response) => {
                if (response.data.status.code === 0) {
                    //删除成功
                    update()
                    notification['success']({
                        message: '成功',
                        description: '已删除 1 个图表。',
                    })
                }
            })
        }

        const update = () => {
            all_charts().then(async (response) => {
                if (response.data.status.code === 0) {
                    // 请求成功
                    state.quota = response.data.data.all_charts.quota
                    state.used = response.data.data.all_charts.charts.length
                    state.available = state.quota - state.used
                    state.charts = response.data.data.all_charts.charts
                    await view_dashboard().then((response) => {
                        if (response.data.status.code === 0 && response.data.data) {
                            state.dashboardData = response.data.data.instruments
                        }
                    })
                    state.charts.forEach((chart) => {
                        const chart_ref = chart_types.find((i) => i.type_id === chart.type_id)
                        chart.icon_type = chart_ref.icon_type
                        chart.type_name = chart_ref.type_name
                        if (state.dashboardData.length > 0) {
                            chart.relatedDashboardItem = state.dashboardData.filter(
                                (i) => i.chart_id === chart.id
                            ).length
                        } else {
                            chart.relatedDashboardItem = 0
                        }
                    })
                    state.chartsDisplay = cloneDeep(state.charts)
                    sortByTime()
                }
            })
        }

        /**
         * 按照日期排序
         */
        const sortByTime = () => {
            state.chartsDisplay = state.chartsDisplay.sort((a, b) => {
                return a.last_modified_time - b.last_modified_time
            })
        }

        /**
         * 按照名称排序
         */
        const sortByName = () => {
            state.chartsDisplay = state.chartsDisplay.sort((a, b) => {
                if (a.chart_name > b.chart_name) {
                    return 0
                } else {
                    return -1
                }
            })
        }

        const clear_filter = () => {
            state.searchQuery = ''
            onSearch()
        }

        const handleSelectChange = () => {
            switch (state.filter) {
                case 'last_update': {
                    sortByTime()
                    break
                }
                case 'name': {
                    sortByName()
                    break
                }
            }
        }

        const onSearch = () => {
            if (state.searchQuery.length === 0) {
                // 没有搜索内容时恢复原状
                state.chartsDisplay = state.charts
                handleSelectChange()
            }
            let from
            // 丢弃先前的搜索结果
            if (state.charts.length !== state.chartsDisplay.length) {
                from = state.charts
            } else {
                from = state.chartsDisplay
            }
            // 按照名称搜索
            state.chartsDisplay = from.filter((i) => i.chart_name.indexOf(state.searchQuery) !== -1)
        }

        onMounted(() => {
            update()
        })

        return {
            ...toRefs(state),
            handleSelectChange,
            onSearch,
            clear_filter,
            handleClickCard,
            handleEdit,
            handleDelete,
            dom_map,
        }
    },
})
</script>

<style scoped>
.cover-icon {
    font-size: 96px;
    text-align: center;
    padding-top: 32px;
    padding-bottom: 32px;
}
</style>
