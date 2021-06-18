<template>
    <div>
        <!--标题展示该组数据名称,可修改-->
        <a-row type="flex">
            <a-col :span="4">
                <a-typography-title
                    v-model:content="editableStr"
                    :level="5"
                    :editable="true"
                ></a-typography-title>
            </a-col>
        </a-row>
        <!--数据表部分-->
        <a-row type="flex" justify="space-around" align="middle">
            <a-col :span="24">
                <a-table
                    :dataSource="dataSource"
                    :columns="columns"
                    :pagination="pagination"
                    :loading="loading"
                    bordered
                >
                    <!--自定义筛选功能-->
                    <template
                        #filterDropdown="{
                            setSelectedKeys,
                            selectedKeys,
                            confirm,
                            clearFilters,
                            column,
                        }"
                    >
                        <div style="padding: 8px">
                            <a-input
                                ref="searchInput"
                                :placeholder="`搜索 ${column.title}`"
                                :value="selectedKeys[0]"
                                style="
                                    width: 188px;
                                    margin-bottom: 8px;
                                    display: block;
                                "
                                @change="
                                    (e) =>
                                        setSelectedKeys(
                                            e.target.value
                                                ? [e.target.value]
                                                : []
                                        )
                                "
                                @pressEnter="
                                    handleSearch(
                                        selectedKeys,
                                        confirm,
                                        column.dataIndex
                                    )
                                "
                            />
                            <a-button
                                type="primary"
                                size="small"
                                style="width: 90px; margin-right: 8px"
                                @click="
                                    handleSearch(
                                        selectedKeys,
                                        confirm,
                                        column.dataIndex
                                    )
                                "
                            >
                                <template #icon>
                                    <SearchOutlined />
                                </template>
                                搜索
                            </a-button>
                            <a-button
                                size="small"
                                style="width: 90px"
                                @click="handleReset(clearFilters)"
                            >
                                重置
                            </a-button>
                        </div>
                    </template>
                    <template #filterIcon="filtered">
                        <search-outlined
                            :style="{ color: filtered ? '#108ee9' : undefined }"
                        />
                    </template>
                    <template #customRender="{ text, column }">
                        <span
                            v-if="
                                searchText &&
                                searchedColumn === column.dataIndex
                            "
                        >
                            <template
                                v-for="(fragment, i) in text
                                    .toString()
                                    .split(
                                        new RegExp(
                                            `(?<=${searchText})|(?=${searchText})`,
                                            'i'
                                        )
                                    )"
                            >
                                <mark
                                    v-if="
                                        fragment.toLowerCase() ===
                                        searchText.toLowerCase()
                                    "
                                    class="highlight"
                                    :key="i"
                                >
                                    {{ fragment }}
                                </mark>
                                <template v-else>{{ fragment }}</template>
                            </template>
                        </span>
                        <template v-else>
                            {{ text }}
                        </template>
                    </template>
                    <!--单元格编辑功能设置-->
                    <template #name="{ text, record }">
                        <div class="editable-cell">
                            <div
                                v-if="editableData[record.key]"
                                class="editable-cell-input-wrapper"
                            >
                                <!--编辑单元格时默认显示原内容-->
                                <a-input
                                    v-model:value="
                                        editableData[record.key].comment
                                    "
                                    @pressEnter="save(record.key)"
                                />
                                <check-outlined
                                    class="editable-cell-icon-check"
                                    @click="save(record.key)"
                                />
                            </div>
                            <div v-else class="editable-cell-text-wrapper">
                                {{ text || " " }}
                                <edit-outlined
                                    class="editable-cell-icon"
                                    @click="edit(record.key)"
                                />
                            </div>
                        </div>
                    </template>
                    <!--删除功能设置-->
                    <template #operation="{ record }">
                        <a-popconfirm
                            v-if="dataSource.length"
                            title="确定要删除吗？"
                            @confirm="onDelete(record.key)"
                        >
                            <a>删除</a>
                        </a-popconfirm>
                    </template>
                </a-table>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import {
    defineComponent,
    reactive,
    toRefs,
    computed,
    ref,
    watch,
    onMounted,
} from "vue";
import {
    CheckOutlined,
    EditOutlined,
    SearchOutlined,
} from "@ant-design/icons-vue";
import { cloneDeep } from "lodash-es";
import { table_content } from "@/api/post/table_content";
import { message } from "ant-design-vue";
import { useRoute } from "vue-router";
import router from "@/router";
import { change_table } from "@/api/post/change_table";

export default defineComponent({
    components: {
        SearchOutlined,
        CheckOutlined,
        EditOutlined,
    },
    setup() {
        const state = reactive({
            table_id: -1,
            table_name: "",
            dataSource: [],
            columns: [
                // 带查找与编辑功能的列，目前未解决如何与所传数据对应
                // {
                //     title: "电影名称",
                //     dataIndex: "name",
                //     key: "name",
                //     slots: {
                //         customRender: "customRender",
                //         filterDropdown: "filterDropdown",
                //         filterIcon: "filterIcon",
                //     },
                //     onFilter: (value, record) =>
                //         record.name
                //             .toString()
                //             .toLowerCase()
                //             .includes(value.toLowerCase()),
                //     onFilterDropdownVisibleChange: (visible) => {
                //         if (visible) {
                //             setTimeout(() => {
                //                 console.log(searchInput.value);
                //                 searchInput.value.focus();
                //             }, 0);
                //         }
                //     },
                // },
                // {
                //     title: "评分",
                //     dataIndex: "rate",
                //     key: "rate",
                // },
                // {
                //     title: "类型",
                //     dataIndex: "type",
                //     key: "type",
                // },
                // {
                //     title: "地区",
                //     dataIndex: "country",
                //     key: "country",
                //     slots: {
                //         customRender: "customRender",
                //         filterDropdown: "filterDropdown",
                //         filterIcon: "filterIcon",
                //     },
                //     onFilter: (value, record) =>
                //         record.country
                //             .toString()
                //             .toLowerCase()
                //             .includes(value.toLowerCase()),
                //     onFilterDropdownVisibleChange: (visible) => {
                //         if (visible) {
                //             setTimeout(() => {
                //                 console.log(searchInput.value);
                //                 searchInput.value.focus();
                //             }, 0);
                //         }
                //     },
                // },
                // {
                //     title: "上映时间",
                //     dataIndex: "year",
                //     key: "year",
                // },
                // {
                //     title: "评论数",
                //     dataIndex: "comment",
                //     key: "comment",
                //     slots: {
                //         customRender: "name",
                //     },
                // },
                // {
                //     title: "操作",
                //     dataIndex: "operation",
                //     slots: {
                //         customRender: "operation",
                //     },
                // },
            ],
            loading: false,
            pagination: {
                //分页设置
                simple: true,
                defaultCurrent: 1,
                defaultPageSize: 10,
                total: 0,
                onChange: (current) => {
                    state.loading = true;
                    state.pagination.defaultCurrent = current;
                    table_content(state.table_id, current).then((response) => {
                        if (response.data.status.code === 0) {
                            state.dataSource =
                                response.data.data.table.dataSource;
                        } else {
                            message.error(response.data.status.message);
                        }
                        state.loading = false;
                    });
                },
            },
            //单元格搜索所用
            searchText: "",
            searchedColumn: "",
            //修改数据表名所用
            editableStr: "",
        });
        //模拟调用假接口传入表格数据
        const route = useRoute();
        onMounted(() => {
            //接收路由传入参数（table_id）
            state.table_id = parseInt(route.params.id[0]);
            console.log(state.table_id);

            //参数格式不正确
            if (isNaN(state.table_id)) {
                router.push("/data_management");
            }
            table_content(state.table_id).then((response) => {
                if (response.data.status.code === 0) {
                    state.table_id = response.data.data.table.table_id;
                    state.table_name = response.data.data.table.table_name;
                    state.pagination.total = response.data.data.table.total;
                    state.dataSource = response.data.data.table.dataSource;
                    state.columns = response.data.data.table.columns;
                    state.editableStr = response.data.data.table.table_name;
                }
            });
        });

        watch(state.editableStr, () => {
            console.log("editableStr", state.editableStr.value);
            change_table(state.table_id, state.editableStr).then((response) => {
                if (response.data.status.code === 0) {
                    console.log("修改成功");
                } else {
                    console.log("修改失败");
                }
            });
        });

        const searchInput = ref();
        //处理自定义筛选
        const handleSearch = (selectedKeys, confirm, dataIndex) => {
            confirm();
            state.searchText = selectedKeys[0];
            state.searchedColumn = dataIndex;
        };
        //处理自定义筛选后重置
        const handleReset = (clearFilters) => {
            clearFilters();
            state.searchText = "";
        };

        //计算数据表存储元素个数
        const count = computed(() => state.dataSource + 1);
        //存储可编辑数据列
        const editableData = reactive({});

        //处理编辑
        const edit = (key) => {
            editableData[key] = cloneDeep(
                state.dataSource.filter((item) => key === item.key)[0]
            );
        };

        //处理保存
        const save = (key) => {
            Object.assign(
                state.dataSource.filter((item) => key === item.key)[0],
                editableData[key]
            );
            delete editableData[key];
        };

        //处理删除
        const onDelete = (key) => {
            state.dataSource = state.dataSource.filter(
                (item) => item.key !== key
            );
        };

        return {
            ...toRefs(state),
            onDelete,
            editableData,
            count,
            edit,
            save,
            handleSearch,
            handleReset,
            searchText: "",
            searchInput,
            searchedColumn: "",
        };
    },
});
</script>

<style lang="less">
.editable-cell {
    position: relative;

    .editable-cell-input-wrapper,
    .editable-cell-text-wrapper {
        padding-right: 24px;
    }

    .editable-cell-text-wrapper {
        padding: 5px 24px 5px 5px;
    }

    .editable-cell-icon,
    .editable-cell-icon-check {
        position: absolute;
        right: 0;
        width: 20px;
        cursor: pointer;
    }

    .editable-cell-icon {
        margin-top: 4px;
        display: none;
    }

    .editable-cell-icon-check {
        line-height: 28px;
    }

    .editable-cell-icon:hover,
    .editable-cell-icon-check:hover {
        color: #108ee9;
    }

    .editable-add-btn {
        margin-bottom: 8px;
    }
}

.editable-cell:hover .editable-cell-icon {
    display: inline-block;
}
</style>
