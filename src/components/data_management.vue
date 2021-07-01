<template>
    <div>
        <a-page-header title="数据" sub-title="此页面列出了您所有可用的数据集">
        </a-page-header>
        <a-divider />
        <!--条目数量显示-->
        <a-row type="flex" align="middle" :gutter="16">
            <a-col :span="12">
                <div style="display: table; vertical-align: middle">
                    <p style="display: table-cell">
                        <a-typography-text strong
                            >当前显示
                            {{ tables.length }}
                            个条目（共
                            {{ tables.length }} 个） </a-typography-text
                        >&nbsp;
                    </p>
                </div>
            </a-col>
        </a-row>
        <a-divider />
        <a-row>
            <a-col :span="24">
                <!--上方标签-->
                <a-tabs v-model:activeKey="activeKey">
                    <a-tab-pane key="1" tab="所有">
                        <!--展示所有数据集信息的列表-->
                        <a-list
                            item-layout="horizontal"
                            :data-source="tables"
                            :bordered="false"
                        >
                            <template #renderItem="{ item }">
                                <a-list-item>
                                    <!--每个列表项的描述-->
                                    <a-list-item-meta
                                        :description="item.description"
                                    >
                                        <!--列表项标题，点击可跳转至数据表详情界面-->
                                        <template #title>
                                            <a
                                                @click="
                                                    $router.push(
                                                        '/data_display/' +
                                                            item.id
                                                    )
                                                "
                                                ><a-typography-text strong>{{
                                                    item.name
                                                }}</a-typography-text>
                                            </a>
                                        </template>
                                        <!--列表项图标-->
                                        <template #avatar>
                                            <a-avatar
                                                shape="square"
                                                size="large"
                                                style="
                                                    background-color: #ffffff;
                                                "
                                            >
                                                <template #icon>
                                                    <DatabaseTwoTone />
                                                </template>
                                            </a-avatar>
                                        </template>
                                    </a-list-item-meta>
                                    <div v-if="item.editable == true">
                                        <a-tag color="blue">样例数据</a-tag>
                                    </div>
                                    <div v-else>
                                        <a-tag color="red">导入数据</a-tag>
                                    </div>
                                </a-list-item>
                            </template>
                        </a-list>
                    </a-tab-pane>
                </a-tabs>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import { all_tables } from "@/api/post/all_tables";
import { DatabaseTwoTone, CodepenOutlined } from "@ant-design/icons-vue";

export default defineComponent({
    components: {
        DatabaseTwoTone,
    },
    setup() {
        //模拟调用假接口传入所有数据集信息
        onMounted(() => {
            all_tables().then((response) => {
                if (response.data.status.code === 0) {
                    state.tables = response.data.data.tables;
                    state.total = response.data.data.tables.length;
                }
            });
        });
        const state = reactive({
            tables: [],
            total: 0,
            activeKey: ref("1"),
        });

        return {
            ...toRefs(state),
            DatabaseTwoTone,
            CodepenOutlined,
        };
    },
});
</script>

<style scoped></style>
