<template>
    <a-layout style="min-height: 100vh">
        <a-layout-sider v-model:collapsed="collapsed" collapsible>
            <div class="logo">
                <AlertOutlined />
            </div>
            <a-menu
                :openKeys="openKeys"
                :selectedKeys="[$route.path]"
                mode="inline"
                theme="dark"
                @click="handleClick"
                @openChange="onOpenChange"
            >
                <template v-for="item in menuItems" v-bind:key="item.path">
                    <a-menu-item v-if="!item.children" :key="item.path">
                        <icon-font :type="item.meta.icon" />
                        <span>{{ item.meta.title }}</span>
                    </a-menu-item>
                    <a-sub-menu v-if="item.children" :key="item.path">
                        <template #title>
                            <span>
                                <icon-font :type="item.meta.icon" />
                                <span>{{ item.meta.title }}</span>
                            </span>
                        </template>
                        <template
                            v-for="child in item.children"
                            v-bind:key="child.path"
                        >
                            <a-menu-item>
                                {{ child.meta.title }}
                            </a-menu-item>
                        </template>
                    </a-sub-menu>
                </template>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0">
                <a-row>
                    <a-col :span="12">
                        <div id="sys_title">{{ systemTitle }}</div>
                    </a-col>
                    <a-col :span="12">
                        <div id="user_info">
                            <a-avatar :size="40">
                                <template #icon>
                                    <UserOutlined />
                                </template>
                            </a-avatar>
                            <div id="drop_down">
                                <a-dropdown>
                                    <a class="ant-dropdown-link" @click.prevent>
                                        {{ nickname }}
                                        <DownOutlined />
                                    </a>
                                    <template #overlay>
                                        <a-menu>
                                            <a-menu-item>
                                                <a @click="logout">退出登录</a>
                                            </a-menu-item>
                                        </a-menu>
                                    </template>
                                </a-dropdown>
                            </div>
                        </div>
                    </a-col>
                </a-row>
            </a-layout-header>
            <a-layout-content style="margin: 0 16px">
                <div
                    :style="{
                        padding: '24px',
                        background: '#fff',
                        minHeight: '360px',
                        margin: '16px 0',
                    }"
                >
                    <router-view />
                </div>
            </a-layout-content>
            <a-layout-footer style="text-align: center">
                ©2021 {{ systemTitle }}
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>
<script>
import { defineComponent, reactive, toRefs } from "vue";
import {
    AlertOutlined,
    createFromIconfontCN,
    DownOutlined,
    UserOutlined,
} from "@ant-design/icons-vue";
import "@/util/index";
import router from "@/router";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const IconFont = createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/font_2592763_y6lwfjbbcao.js", //图标,随时更新
});

export default defineComponent({
    components: {
        AlertOutlined,
        IconFont,
        DownOutlined,
        UserOutlined,
    },
    setup() {
        const store = useStore();
        const $router = useRouter();
        const logout = () => {
            store.commit("SET_LOGOUT", true);
            $router.push("/login");
        };

        const systemTitle = process.env.VUE_APP_TITLE;
        const state = reactive({
            collapsed: false,
            rootSubmenuKeys: [],
            openKeys: [],
            selectedKeys: [],
            nickname: "",
        });
        /**
         * 只展开当前父级菜单
         * @param openKeys
         */
        const onOpenChange = (openKeys) => {
            console.log("onOpenChange: ");
            console.log(openKeys);
            let latestOpenKey = openKeys.find(
                (key) => state.openKeys.indexOf(key) === -1
            );

            if (state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
                state.openKeys = openKeys;
            } else {
                state.openKeys = latestOpenKey ? [latestOpenKey] : [];
            }
        };

        return { ...toRefs(state), onOpenChange, systemTitle, logout };
    },
    created() {
        const store = useStore();
        this.nickname = store.state.nickname;
        for (let menuItem of this.menuItems) {
            this.rootSubmenuKeys.push(menuItem.path);
        }
        console.log("created");
        console.log(this.rootSubmenuKeys);
        console.log(this.menuItems);
        console.log(this.$route.path);
        for (let menuItem of this.menuItems) {
            if (menuItem.children) {
                for (let child of menuItem.children) {
                    if (this.$route.path === child.path) {
                        this.openKeys = [menuItem.path];
                        break;
                    }
                }
            } else if (this.$route.path === menuItem.path) {
                this.openKeys = [menuItem.path];
                break;
            }
        }
        console.log(this.openKeys);
    },
    methods: {
        handleClick({ item, key, selectedKeys }) {
            console.log("handleClick");
            console.log(item);
            console.log(key);
            console.log(selectedKeys);
            console.log(this.$route.path);
            this.$router.push(key);
        },
    },
    computed: {
        menuItems: () => {
            const role = useStore().state.role;
            let qualifiedItems = [];
            for (let route of router.options.routes) {
                //一级路由
                if (route.name === "layout") {
                    for (let child of route.children) {
                        //二级路由
                        if (child.meta.role.isInArray(role)) {
                            //判断权限
                            let node = JSON.parse(JSON.stringify(child));
                            if (node.children) {
                                node.children = []; //清空临时三级路由
                            }
                            if (!child.children) {
                                qualifiedItems.push(node);
                            } else {
                                for (let child1 of child.children) {
                                    //三级路由
                                    if (child1.meta.role.isInArray(role)) {
                                        //判断权限
                                        node.children.push(
                                            JSON.parse(JSON.stringify(child1))
                                        ); //添加临时三级路由
                                    }
                                }
                                qualifiedItems.push(node);
                            }
                        }
                    }
                }
            }
            console.log(qualifiedItems);
            return qualifiedItems;
        },
    },
});
</script>
<style>
#components-layout-demo-side .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.3);
}

#user_info {
    width: fit-content;
    margin-left: auto;
    margin-right: 32px;
}

#sys_title {
    margin-left: 16px;
    color: rgb(0, 21, 41);
    font-size: 16px;
    font-weight: bold;
}

#drop_down {
    float: right;
    margin-left: 16px;
}

.logo {
    height: 32px;
    margin: 16px;
    text-align: center;
    color: white;
    font-size: large;
}

.site-layout .site-layout-background {
    background: #fff;
}

[data-theme="dark"] .site-layout .site-layout-background {
    background: #141414;
}
</style>
