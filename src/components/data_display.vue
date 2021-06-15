<template>
    <div>
        <!--标题展示该组数据名称-->
        <a-row type="flex">
            <a-col :span="4">
                <h1>数据展示test</h1>
            </a-col>
        </a-row>
        <!--数据表部分-->
        <a-row type="flex" justify="space-around" align="middle">
            <a-col :span="24">
                <a-table :dataSource="dataSource" :columns="columns" bordered>
                    <!--关键字检索功能-->
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
import { defineComponent, reactive, toRefs, computed, ref } from "vue";
import {
    CheckOutlined,
    EditOutlined,
    SearchOutlined,
} from "@ant-design/icons-vue";
import { cloneDeep } from "lodash-es";

export default defineComponent({
    components: {
        SearchOutlined,
        CheckOutlined,
        EditOutlined,
    },
    setup() {
        const state = reactive({
            dataSource: [
                {
                    key: "1",
                    name: "肖申克的救赎",
                    rate: 9.7,
                    type: "犯罪 剧情",
                    country: "美国",
                    year: "1994-9",
                    comment: 2365224,
                },
                {
                    key: "2",
                    name: "霸王别姬",
                    rate: 9.6,
                    type: "爱情 剧情",
                    country: "中国大陆 中国香港",
                    year: "1993-7",
                    comment: 1761207,
                },
                {
                    key: "3",
                    name: "美丽人生",
                    rate: 9.6,
                    type: "剧情 喜剧",
                    country: "意大利",
                    year: "2020-1",
                    comment: 1095584,
                },
            ],
            columns: [
                {
                    title: "电影名称",
                    dataIndex: "name",
                    key: "name",
                    slots: {
                        customRender: "customRender",
                        filterDropdown: "filterDropdown",
                        filterIcon: "filterIcon",
                    },
                    onFilter: (value, record) =>
                        record.name
                            .toString()
                            .toLowerCase()
                            .includes(value.toLowerCase()),
                    onFilterDropdownVisibleChange: (visible) => {
                        if (visible) {
                            setTimeout(() => {
                                console.log(searchInput.value);
                                searchInput.value.focus();
                            }, 0);
                        }
                    },
                },
                {
                    title: "评分",
                    dataIndex: "rate",
                    key: "rate",
                },
                {
                    title: "类型",
                    dataIndex: "type",
                    key: "type",
                },
                {
                    title: "地区",
                    dataIndex: "country",
                    key: "country",
                    slots: {
                        customRender: "customRender",
                        filterDropdown: "filterDropdown",
                        filterIcon: "filterIcon",
                    },
                    onFilter: (value, record) =>
                        record.country
                            .toString()
                            .toLowerCase()
                            .includes(value.toLowerCase()),
                    onFilterDropdownVisibleChange: (visible) => {
                        if (visible) {
                            setTimeout(() => {
                                console.log(searchInput.value);
                                searchInput.value.focus();
                            }, 0);
                        }
                    },
                },
                {
                    title: "上映时间",
                    dataIndex: "year",
                    key: "year",
                },
                {
                    title: "评论数",
                    dataIndex: "comment",
                    key: "comment",
                    slots: {
                        customRender: "name",
                    },
                },
                {
                    title: "操作",
                    dataIndex: "operation",
                    slots: {
                        customRender: "operation",
                    },
                },
            ],
            searchText: "",
            searchedColumn: "",
        });

        const searchInput = ref();

        const handleSearch = (selectedKeys, confirm, dataIndex) => {
            confirm();
            state.searchText = selectedKeys[0];
            state.searchedColumn = dataIndex;
        };

        const handleReset = (clearFilters) => {
            clearFilters();
            state.searchText = "";
        };

        //计算数据表存储元素个数
        const count = computed(() => state.dataSource + 1);
        //存储可编辑数据列
        const editableData = reactive({});

        const edit = (key) => {
            editableData[key] = cloneDeep(
                state.dataSource.filter((item) => key === item.key)[0]
            );
        };

        const save = (key) => {
            Object.assign(
                state.dataSource.filter((item) => key === item.key)[0],
                editableData[key]
            );
            delete editableData[key];
        };

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
