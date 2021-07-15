<template>
    <div class="tip" v-if="logout">
        <a-alert
            message="成功"
            description="您已退出登录，使用下面的表单可以再次登录。"
            type="success"
            show-icon
            banner
        />
    </div>
    <div class="tip" v-else-if="local_test === 'true'">
        <a-alert
            message="本地测试环境"
            description="所有后端数据均由 Mock.js 提供，请使用 api/mock/mock_data.js 中提供的用户名和密码登录。"
            type="info"
            show-icon
            banner
        />
    </div>
    <div style="padding: 15vh">
        <a-card :bordered="true" style="width: 350px; margin: 0 auto">
            <img src="../assets/logo.svg" alt="BILYN" style="margin: 30px" />
            <div style="text-align: center">
                <p>
                    您必须输入用户名和密码以登录<br /><strong>{{ text.appTitle }}</strong>
                </p>
            </div>
            <!--登录表单-->
            <a-form>
                <a-form-item v-bind="validateInfos.login" :wrapper-col="{ span: 24, offset: 0 }">
                    <a-input
                        :id="dom_map.login.username"
                        v-model:value="modelRef.login"
                        placeholder="用户名"
                        size="large"
                        style="width: 100%"
                    >
                        <template #prefix>
                            <user-outlined type="user" />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item v-bind="validateInfos.password" :wrapper-col="{ span: 24, offset: 0 }">
                    <a-input-password
                        autocomplete
                        :id="dom_map.login.password"
                        v-model:value="modelRef.password"
                        placeholder="密码"
                        size="large"
                        @keyup.enter.prevent="onSubmit"
                        style="width: 100%"
                    >
                        <template #prefix>
                            <lock-outlined />
                        </template>
                    </a-input-password>
                </a-form-item>
                <a-form-item v-bind="validateInfos.rememberMe">
                    <a-checkbox v-model:checked="modelRef.rememberMe" :id="dom_map.login.rememberMe"
                        >记住我<template v-if="modelRef.rememberMe">（请勿在公共电脑上选中此选项）</template>
                    </a-checkbox>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
                    <a-button :id="dom_map.login.login" block size="large" type="primary" @click.prevent="onSubmit"
                        >登录</a-button
                    >
                </a-form-item>
            </a-form>
            <div style="text-align: center">
                <a @click="$router.push('/register')" target="_blank">注册</a>&nbsp;&nbsp;
                <a @click="$router.push('/reset_password')" target="_blank">忘记密码？</a>
            </div>
        </a-card>
    </div>
</template>

<script>
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'
import { defineComponent, onMounted, onUnmounted, reactive, toRaw, toRefs } from 'vue'
import { login } from '@/api/post/login'
import { user_info } from '@/api/post/user_info'
import { useStore } from 'vuex'
import { Form, notification } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import dom_map from '@/constant/dom_map'
import logger from '@/util/logger'

export default defineComponent({
    components: {
        // 图标
        UserOutlined,
        LockOutlined,
    },

    setup() {
        const store = useStore()
        const $router = useRouter()
        const $route = useRoute()

        // prettier-ignore
        const state = reactive({
            logout: false,                          // 退出登录状态
            local_test: process.env.VUE_APP_MOCK,   // 本地测试状态
        })

        onMounted(() => {
            state.logout = store.state.logout
        })

        onUnmounted(() => {
            state.logout = false
            store.commit('SET_LOGOUT', false)
        })

        // 表单模型
        const modelRef = reactive({
            login: '',
            password: '',
            rememberMe: false,
        })

        const text = reactive({
            appTitle: process.env.VUE_APP_TITLE,
        })

        // 表单验证规则
        const rulesRef = reactive({
            login: [
                {
                    required: true,
                    message: '请输入用户名',
                },
            ],
            password: [
                {
                    required: true,
                    message: '请输入密码',
                },
            ],
        })

        const { resetFields, validate, validateInfos } = Form.useForm(modelRef, rulesRef)

        const onSubmit = () => {
            validate()
                .then(() => {
                    //取消退出登录状态
                    store.commit('SET_LOGOUT', false)
                    state.logout = false
                    const form = toRaw(modelRef)
                    login(form.login, form.password, form.rememberMe).then((response) => {
                        store.commit('CLEAR_USER_INFO')
                        store.commit('CLEAR_TOKEN')
                        if (response.data.status.code === 0) {
                            //成功后继续请求用户信息
                            store.commit('SET_TOKEN', response.data.data)
                            user_info()
                                .then((response) => {
                                    if (response.data.status.code === 0) {
                                        // 成功后设置用户信息
                                        store.commit('SET_USER_INFO', response.data.data.user)
                                        if ($route.redirectedFrom) {
                                            $router.push({
                                                path: decodeURIComponent($route.redirectedFrom.fullPath),
                                            })
                                        } else {
                                            $router.push('/')
                                        }
                                    } else {
                                        notification['error']({
                                            message: '错误',
                                            description: response.data.status.message,
                                        })
                                    }
                                })
                                .catch()
                        } else if (response.data.status.code === 1 || response.data.status.code === 2) {
                            notification['warning']({
                                message: '登录失败',
                                description: '您提供的用户名或密码无效',
                            })
                        } else {
                            notification['error']({
                                message: '错误',
                                description: response.data.status.message,
                            })
                        }
                    })
                })
                .catch((_error) => {
                    logger.warn(_error)
                })
        }

        return {
            ...toRefs(state),
            validateInfos,
            resetFields,
            modelRef,
            text,
            onSubmit,
            dom_map,
        }
    },
})
</script>

<style scoped></style>
