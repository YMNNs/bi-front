<template>
    <a-layout style="min-height: 100vh">
        <a-layout-sider v-model:collapsed="collapsed" collapsible>
            <div class="logo">
                <img src="../assets/bi_logo_white.svg" alt="BILYN" style="max-height: 32px" />
            </div>
            <a-menu
                :openKeys="openKeys"
                :selectedKeys="[$route.path]"
                mode="inline"
                theme="dark"
                @click="handleClick"
                @openChange="onOpenChange"
            >
                <template v-for="item in menuList" :key="item.path">
                    <template v-if="!item.children">
                        <a-menu-item :key="item.path">
                            <template #icon>
                                <icon-font :type="item.meta.icon" />
                            </template>
                            {{ item.meta.title }}
                        </a-menu-item>
                    </template>
                    <template v-else>
                        <sub-menu :menu-info="item" :key="item.path" />
                    </template>
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
                        <a-row type="flex" justify="end" style="margin-right: 16px">
                            <a-col :span="24">
                                <div id="drop_down">
                                    <a-dropdown>
                                        <a class="ant-dropdown-link" @click.prevent>
                                            {{ $store.state.nickname ? $store.state.nickname : '未设置昵称' }}
                                            <DownOutlined />
                                        </a>
                                        <template #overlay>
                                            <a-menu style="min-width: 150px" @click="onMenuClick">
                                                <a-menu-item key="name">
                                                    登录为
                                                    <strong>{{ $store.state.username }}</strong>
                                                </a-menu-item>
                                                <a-menu-divider />
                                                <a-menu-item key="settings">
                                                    <strong>设置</strong>
                                                </a-menu-item>
                                                <a-menu-divider />
                                                <a-menu-item key="logout">
                                                    <strong>退出登录</strong>
                                                </a-menu-item>
                                            </a-menu>
                                        </template>
                                    </a-dropdown>
                                </div>
                            </a-col>
                        </a-row>
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
                ©{{ new Date().getFullYear() }} {{ systemTitle }} 编译时间：{{ buildTime }}
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>
<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { createFromIconfontCN, DownOutlined } from '@ant-design/icons-vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { logout as logout_request } from '@/api/post/logout'
import { icon_url } from '@/util/iconfont'

const IconFont = createFromIconfontCN({
    scriptUrl: icon_url, //图标,随时更新
})

/**
 * 从路由表递归生成目录
 * @type {{template: string, components: {IconFont: FunctionalComponent<IconFontProps>}, name: string, props: {menuInfo: {default: (function(): {}), type: ObjectConstructor}}}}
 */
const SubMenu = {
    name: 'SubMenu',
    props: {
        menuInfo: {
            type: Object,
            default: () => ({}),
        },
    },
    template: `
        <template>
            <template
                v-if="
                menuInfo.children.filter((i) => !i.meta.hidden && i.meta.role.indexOf($store.state.role) >= 0).length >
                0
            "
            >
                <a-sub-menu :key="menuInfo.path">
                    <template #icon>
                        <icon-font :type="menuInfo.meta.icon" />
                    </template>
                    <template #title>{{ menuInfo.meta.title }}</template>
                    <template
                        v-for="item in menuInfo.children.filter(
                        (i) => !i.meta.hidden && i.meta.role.indexOf($store.state.role) >= 0
                    )"
                        :key="item.path"
                    >
                        <template v-if="!item.children">
                            <a-menu-item :key="item.path">
                                <template #icon>
                                    <icon-font :type="item.meta.icon" />
                                </template>
                                {{ item.meta.title }}
                            </a-menu-item>
                        </template>
                        <template v-else>
                            <sub-menu :menu-info="item" :key="item.path" />
                        </template>
                    </template>
                </a-sub-menu>
            </template>
            <template v-else>
                <a-menu-item :key="menuInfo.path">
                    <template #icon>
                        <icon-font :type="menuInfo.meta.icon" />
                    </template>
                    {{ menuInfo.meta.title }}
                </a-menu-item>
            </template>
        </template>
    `,
    components: {
        IconFont,
    },
}

export default defineComponent({
    components: {
        DownOutlined,
        IconFont,
        'sub-menu': SubMenu,
    },
    setup() {
        const store = useStore()
        const router = useRouter()

        onMounted(() => {
            updateUserInfo()
            state.menuList = router.options.routes
                .find((i) => i.name === 'layout')
                .children.filter((i) => !i.meta.hidden && i.meta.role.indexOf(store.state.role) >= 0)
            state.rootSubmenuKeys = state.menuList.map((i) => {
                return i.path
            })
        })

        const updateUserInfo = () => {
            store.dispatch('UPDATE_USER_INFO')
        }

        const onMenuClick = ({ key }) => {
            switch (key) {
                case 'settings': {
                    router.push('/edit_user_profile')
                    break
                }
                case 'logout': {
                    logout()
                }
            }
        }

        const logout = () => {
            logout_request()
                .then((response) => {
                    if (response.data) {
                        //退出成功
                        store.commit('SET_LOGOUT', true)
                        store.commit('CLEAR_USER_INFO')
                        store.commit('CLEAR_TOKEN')
                        router.push('/login')
                    }
                })
                .catch()
        }

        const systemTitle = process.env.VUE_APP_TITLE
        const buildTime = process.env.BUILD_TIME

        const state = reactive({
            collapsed: false,
            rootSubmenuKeys: [],
            openKeys: [],
            selectedKeys: [],
            menuList: [],
        })

        const onOpenChange = (openKeys) => {
            const latestOpenKey = openKeys.find((key) => state.openKeys.indexOf(key) === -1)

            if (state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
                state.openKeys = openKeys
            } else {
                state.openKeys = latestOpenKey ? [latestOpenKey] : []
            }
        }

        const handleClick = ({ key }) => {
            router.push(key)
        }

        return {
            ...toRefs(state),
            systemTitle,
            logout,
            updateUserInfo,
            onMenuClick,
            buildTime,
            onOpenChange,
            handleClick,
        }
    },
})
</script>
<style>
#components-layout-demo-side .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.3);
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
</style>
