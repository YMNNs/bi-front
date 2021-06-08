<template>
    <div id="tip" v-if="logout">
        <a-alert
            message="成功"
            description="您已退出登录，使用下面的表单可以再次登录。"
            type="success"
            show-icon
        />
    </div>
    <div style="padding: 15vh">
        <a-card :bordered="true" style="width: 350px; margin: 0 auto">
            <img src="../assets/logo.svg" alt="BILYN" style="margin: 30px" />
            <div style="text-align: center">
                <p>
                    您必须输入用户名和密码以登录<br /><strong>{{
                        text.appTitle
                    }}</strong>
                </p>
            </div>
            <!--登录表单-->
            <a-form>
                <a-form-item
                    v-bind="validateInfos.login"
                    :wrapper-col="{ span: 24, offset: 0 }"
                >
                    <a-input
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
                <a-form-item
                    v-bind="validateInfos.password"
                    :wrapper-col="{ span: 24, offset: 0 }"
                >
                    <a-input-password
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
                    <a-checkbox v-model:checked="modelRef.rememberMe"
                        >{{ text.rememberMePrompt }}
                    </a-checkbox>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
                    <a-button
                        block
                        size="large"
                        type="primary"
                        @click.prevent="onSubmit"
                        >登录
                    </a-button>
                </a-form-item>
            </a-form>
            <div style="text-align: center">
                <a @click="$router.push('/register')" target="_blank">注册</a
                >&nbsp;&nbsp;
                <a href="/" target="_blank" disabled="true">忘记密码？</a>
            </div>
        </a-card>
    </div>
</template>

<script>
import { LockOutlined, UserOutlined } from "@ant-design/icons-vue";
import {
    defineComponent,
    onMounted,
    reactive,
    toRaw,
    toRefs,
    watch,
} from "vue";
import { useForm } from "@ant-design-vue/use";
import { login } from "@/api/login";
import { user_info } from "@/api/user_info";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
    components: {
        // 图标
        UserOutlined,
        LockOutlined,
    },
    // // 设置页面背景
    // mounted() {
    //    document
    //         .querySelector("body")
    //         .setAttribute("style", "background-color:#ececec");
    // },
    // // 取消页面背景
    // beforeUnmount() {
    //     document.querySelector("body").removeAttribute("style");
    // },

    setup() {
        const store = useStore();
        const $router = useRouter();
        const $route = useRoute();
        const state = reactive({
            logout: false,
        });

        onMounted(() => {
            state.logout = store.state.logout;
            if (state.logout) {
                store.commit("CLEAR_USER_INFO");
                store.commit("CLEAR_TOKEN");
            }
        });

        // 表单模型
        const modelRef = reactive({
            login: "",
            password: "",
            rememberMe: false,
        });

        /**
         * 玩得一手好watch
         */
        watch(
            () => modelRef.rememberMe,
            () => {
                if (modelRef.rememberMe) {
                    text.rememberMePrompt = "记住我（请勿在公共电脑上勾选）";
                } else {
                    text.rememberMePrompt = "记住我";
                }
            }
        );

        const text = reactive({
            appTitle: process.env.VUE_APP_TITLE,
            rememberMePrompt: "记住我",
        });

        // 表单验证规则
        const rulesRef = reactive({
            login: [
                {
                    required: true,
                    message: "请输入用户名",
                },
            ],
            password: [
                {
                    required: true,
                    message: "请输入密码",
                },
            ],
        });

        const { resetFields, validate, validateInfos } = useForm(
            modelRef,
            rulesRef
        );

        const onSubmit = () => {
            validate()
                .then(() => {
                    //取消退出登录状态
                    store.commit("SET_LOGOUT", false);
                    state.logout = false;
                    const form = toRaw(modelRef);
                    login(form.login, form.password, form.rememberMe).then(
                        (response) => {
                            store.commit("CLEAR_USER_INFO");
                            store.commit("CLEAR_TOKEN");
                            if (response.data.status.code === 0) {
                                //成功后继续请求用户信息
                                store.commit("SET_TOKEN", response.data.data);
                                user_info()
                                    .then((response) => {
                                        console.log(response);
                                        if (response.data.status.code === 0) {
                                            // 成功后设置用户信息
                                            store.commit(
                                                "SET_USER_INFO",
                                                response.data.data.user
                                            );
                                            if ($route.redirectedFrom) {
                                                $router.push({
                                                    path: decodeURIComponent(
                                                        $route.redirectedFrom
                                                            .fullPath
                                                    ),
                                                });
                                            } else {
                                                $router.push("/");
                                            }
                                        } else {
                                            message.error(
                                                response.data.status.message
                                            );
                                        }
                                    })
                                    .catch((err) => {
                                        console.log("error", err);
                                    });
                            } else {
                                message.error(response.data.status.message);
                            }
                        }
                    );
                })
                .catch((err) => {
                    console.log("error", err);
                });
        };

        return {
            ...toRefs(state),
            validateInfos,
            resetFields,
            modelRef,
            text,
            onSubmit,
        };
    },
});
</script>

<style scoped>
#tip {
    width: 800px;
    position: absolute;
    left: 50%;
    top: 10px;
    transform: translate(-50%);
}
</style>
