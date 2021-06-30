<template>
    <div>
        <!--标题展示该组数据名称,可修改-->
        <a-row type="flex">
            <a-col :span="24">
                <a-typography-title
                    v-model:content="editableStr"
                    :level="4"
                    :editable="{
                        onEnd: () => updateTableName(),
                        onCancel: () => updateTableName(),
                        maxlength: 32,
                    }"
                    ><template #editableTooltip
                        >名称长度上限为 32 字符</template
                    ></a-typography-title
                >
            </a-col>
        </a-row>
        <a-divider />
        <!--条目数量显示-->
        <a-row type="flex" align="middle" :gutter="16">
            <a-col :span="12">
                <div style="display: table; vertical-align: middle">
                    <p style="display: table-cell">
                        <a-typography-text strong
                            >当前显示
                            {{ dataSource.length }}
                            个条目（共
                            {{ pagination.total }} 个） </a-typography-text
                        >&nbsp;
                    </p>
                </div>
            </a-col>
        </a-row>
        <a-divider />
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
                    <!--单元格编辑功能设置，暂未使用-->
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
                    <!--删除功能设置，暂未使用-->
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
import { defineComponent, reactive, toRefs, computed, onMounted } from "vue";
import { CheckOutlined, EditOutlined } from "@ant-design/icons-vue";
import { cloneDeep } from "lodash-es";
import { table_content } from "@/api/post/table_content";
import { notification } from "ant-design-vue";
import { useRoute } from "vue-router";
import router from "@/router";
import { change_table } from "@/api/post/change_table";

export default defineComponent({
    components: {
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
            editTableNameAvailable: true,
            pagination: {
                //分页设置
                simple: true,
                defaultCurrent: 1,
                defaultPageSize: 10,
                total: 0,
                onChange: (current) => {
                    //点击翻页后开始加载
                    state.loading = true;
                    state.pagination.defaultCurrent = current;
                    table_content(state.table_id, 10, current).then(
                        (response) => {
                            if (response.data.status.code === 0) {
                                response.data.data.table.dataSource.forEach(
                                    (i) => {
                                        i.key = i.ranking;
                                    }
                                );
                                state.dataSource =
                                    response.data.data.table.dataSource;
                            } else {
                                notification["error"]({
                                    message: "错误",
                                    description: response.data.status.message,
                                });
                            }
                            //翻页操作完成后关闭加载
                            state.loading = false;
                        }
                    );
                },
            },
            //修改数据表名所用
            editableStr: "",
        });
        //模拟调用假接口传入表格数据
        const route = useRoute();
        onMounted(() => {
            //接收路由传入参数（table_id）
            state.table_id = parseInt(route.params.id);
            // console.log(state.table_id);

            //参数格式不正确
            if (isNaN(state.table_id)) {
                router.push("/data_management");
            }
            update();
        });

        const update = () => {
            table_content(state.table_id, 10, 1).then((response) => {
                if (response.data.status.code === 0) {
                    response.data.data.table.dataSource.forEach((i) => {
                        i.key = i.ranking;
                    });
                    state.table_name = response.data.data.table.table_name;
                    state.pagination.total = response.data.data.table.total;
                    state.dataSource = response.data.data.table.dataSource;
                    state.columns = response.data.data.table.columns;
                    state.editableStr = response.data.data.table.table_name;
                }
            });
        };

        const updateTableName = () => {
            console.log("更改表名");
            change_table(state.table_id, state.editableStr).then((response) => {
                if (response.data.status.code === 0) {
                    state.table_name = JSON.parse(
                        JSON.stringify(state.editableStr)
                    );
                    notification["success"]({
                        message: "成功",
                        description:
                            "数据表的名称已变更为 " + state.editableStr,
                    });
                } else {
                    state.editableStr = JSON.parse(
                        JSON.stringify(state.table_name)
                    );
                    notification["error"]({
                        message: "错误",
                        description: response.data.status.message,
                    });
                }
            });
        };

        //单元格编辑功能
        //计算数据表存储元素个数
        const count = computed(() => state.dataSource + 1);
        //存储可编辑数据列
        const editableData = reactive({});
        //处理编辑操作
        const edit = (key) => {
            editableData[key] = cloneDeep(
                state.dataSource.filter((item) => key === item.key)[0]
            );
        };

        //保存编辑内容
        const save = (key) => {
            Object.assign(
                state.dataSource.filter((item) => key === item.key)[0],
                editableData[key]
            );
            delete editableData[key];
        };

        //处理删除操作
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
            searchText: "",
            searchedColumn: "",
            updateTableName,
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
