<template>
    <div>
        <a-page-header title="图表" sub-title="此页面列出了您所有的图表">
            <template v-slot:extra>
                <a-button
                    key="1"
                    type="primary"
                    @click.prevent="$router.push('/new_chart')"
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
        <a-row type="flex" justify="end" align="middle" :gutter="16">
            <a-col :span="12">
                <div style="display: table; vertical-align: middle">
                    <p style="display: table-cell">
                        <a-typography-text strong
                            >当前显示
                            {{ chartsDisplay.length }}
                            个条目 </a-typography-text
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
                    v-model:value="searchQuery"
                    placeholder="搜索"
                    size="large"
                    :loading="searchLoading"
                    @search="onSearch"
                />
            </a-col>
            <a-col :span="6">
                <a-select
                    v-model:value="filter"
                    style="width: 100%"
                    ref="select"
                    size="large"
                    @change="handleSelectChange"
                    placeholder="排序方式"
                >
                    <a-select-opt-group label="排序">
                        <a-select-option value="name">名称</a-select-option>
                        <a-select-option value="last_update"
                            >最近更新
                        </a-select-option>
                    </a-select-opt-group>
                </a-select>
            </a-col>
        </a-row>
        <a-divider />
        <a-row>
            <a-col :span="24">
                <a-list
                    :loading="listLoading"
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
                            <a-card hoverable :loading="item.loading">
                                <template class="ant-card-actions" #actions>
                                    <edit-outlined
                                        key="edit"
                                        @click="handleEdit(item.id)"
                                    />
                                    <a-popconfirm
                                        title="图表删除后将不可恢复，您确定要删除吗？"
                                        @confirm="handleDelete(item.id)"
                                    >
                                        <DeleteOutlined key="delete" />
                                    </a-popconfirm>
                                </template>
                                <template #cover>
                                    <div class="cover-icon">
                                        <icon-font :type="item.icon_type" />
                                    </div>
                                </template>
                                <a-card-meta
                                    :title="item.name"
                                    @click="handleEdit"
                                >
                                    <template #description
                                        >{{ item.type_name }}
                                    </template>
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
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { all_charts } from "@/api/post/all_charts";
import { createFromIconfontCN } from "@ant-design/icons-vue";
import { icon_url } from "@/util/iconfont";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { delete_chart } from "@/api/post/delete_chart";
import { notification } from "ant-design-vue";

const IconFont = createFromIconfontCN({
    scriptUrl: icon_url,
});

export default defineComponent({
    components: {
        IconFont,
        EditOutlined,
        DeleteOutlined,
    },
    setup() {
        const state = reactive({
            quota: 0,
            used: 0,
            available: 0,
            charts: [],
            chartsDisplay: [],
            searchQuery: "",
            filter: "last_update",
            searchLoading: false,
            listLoading: false,
        });

        const handleClickCard = () => {
            console.log("click");
        };

        const handleEdit = (id) => {
            console.log("edit" + id);
        };

        const handleDelete = (id) => {
            delete_chart(id).then((response) => {
                if (response.data.status.code === 0) {
                    //删除成功
                    update();
                    notification["success"]({
                        message: "成功",
                        description: "已删除 1 个图表。",
                    });
                }
            });
        };

        const loadingTimeout = 500;

        const update = () => {
            state.listLoading = true;
            all_charts().then((response) => {
                if (response.data.status.code === 0) {
                    // 请求成功
                    state.quota = response.data.data.all_charts.quota;
                    state.used = response.data.data.all_charts.charts.length;
                    state.available = state.quota - state.used;
                    state.charts = response.data.data.all_charts.charts;
                    state.charts.forEach((chart) => {
                        chart.loading = true;
                        switch (chart.type_id) {
                            // 根据图表类型id设置图标
                            case 1: {
                                // 折线图
                                chart.icon_type = "icon-jibenzhexiantu";
                                break;
                            }
                            case 2: {
                                // 柱状图
                                chart.icon_type = "icon-duoxilieezhuzhuangtu";
                                break;
                            }
                            case 3: {
                                // 条形图
                                chart.icon_type = "icon-duidietiaoxingtu";
                                break;
                            }
                            case 4: {
                                // 面积图
                                chart.icon_type = "icon-duidiemianjitu";
                                break;
                            }
                            case 5: {
                                // 饼图
                                chart.icon_type = "icon-bingtu";
                                break;
                            }
                            case 6: {
                                // 散点图
                                chart.icon_type = "icon-sandiantu";
                                break;
                            }
                            case 7: {
                                // 雷达图
                                chart.icon_type = "icon-leidatu";
                                break;
                            }
                            default: {
                                chart.icon_type = "icon-zidingyi";
                            }
                        }
                    });
                    state.chartsDisplay = state.charts;
                    sortByTime();
                    state.listLoading = false;
                    setTimeout(() => {
                        state.chartsDisplay.forEach((i) => (i.loading = false));
                    }, loadingTimeout);
                }
            });
        };

        /**
         * 按照日期排序
         */
        const sortByTime = () => {
            state.chartsDisplay = state.chartsDisplay.sort((a, b) => {
                return a.last_modified_time - b.last_modified_time;
            });
        };

        /**
         * 按照名称排序
         */
        const sortByName = () => {
            state.chartsDisplay = state.chartsDisplay.sort((a, b) => {
                if (a.name > b.name) {
                    return 0;
                } else {
                    return -1;
                }
            });
        };

        const clear_filter = () => {
            state.searchQuery = "";
            onSearch();
        };

        const handleSelectChange = () => {
            console.log(state.filter);
            switch (state.filter) {
                case "last_update": {
                    sortByTime();
                    break;
                }
                case "name": {
                    sortByName();
                    break;
                }
            }
        };

        const onSearch = () => {
            state.listLoading = true;
            if (state.searchQuery.length === 0) {
                // 没有搜索内容时恢复原状
                state.chartsDisplay = state.charts;
                handleSelectChange();
            }
            state.searchLoading = true;
            let from;
            // 丢弃先前的搜索结果
            if (state.charts.length !== state.chartsDisplay.length) {
                from = state.charts;
            } else {
                from = state.chartsDisplay;
            }
            from.forEach((i) => (i.loading = true));
            // 按照名称搜索
            state.chartsDisplay = from.filter(
                (i) => i.name.indexOf(state.searchQuery) !== -1
            );
            state.listLoading = false;
            setTimeout(() => {
                state.searchLoading = false;
                state.chartsDisplay.forEach((i) => (i.loading = false));
            }, loadingTimeout);
        };

        onMounted(() => {
            update();
        });

        return {
            ...toRefs(state),
            handleSelectChange,
            onSearch,
            clear_filter,
            handleClickCard,
            handleEdit,
            handleDelete,
        };
    },
});
</script>

<style scoped>
.cover-icon {
    font-size: 96px;
    text-align: center;
    padding-top: 32px;
    padding-bottom: 32px;
}
</style>
