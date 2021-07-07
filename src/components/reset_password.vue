<template>
    <div class="page-wrapper">
        <a-card :bordered="true" style="width: 700px; margin: 0 auto">
            <!--            请求重置密码-->
            <template v-if="step === 'request'">
                <a-page-header title="重置密码" :sub-title="subtitle" @back="$router.go(-1)" />
                <br />
                <a-form :label-col="labelCol" :wrapper-col="wrapperCol" :hideRequiredMark="true">
                    <a-form-item v-bind="validateInfos_request.email" label="电子邮件地址">
                        <a-input
                            v-model:value="modelRef_request.email"
                            size="large"
                            style="width: 100%"
                            @blur="validate_request('email').catch()"
                        />
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 14, offset: 6 }">
                        <a-button type="primary" @click.prevent="onSubmit_request" :loading="onSubmit_request_loading"
                            >发送重置密码邮件
                        </a-button>
                        <template #help>
                            <p>
                                <br />
                                选择<strong>发送重置密码邮件</strong>来验证您对账号的所有权，在您完成重置前密码不会被修改。
                            </p>
                        </template>
                    </a-form-item>
                </a-form>
            </template>
            <!--设置新密码-->
            <template v-if="step === 'reset'">
                <a-page-header title="设置新密码" :sub-title="subtitle" @back="$router.go(-1)" />
                <br />
                <a-form :label-col="labelCol" :wrapper-col="wrapperCol" :hideRequiredMark="true">
                    <a-form-item v-bind="validateInfos_reset.password" label="新密码">
                        <a-input-password
                            v-model:value="modelRef_reset.password"
                            size="large"
                            style="width: 100%"
                            @blur="validate_reset('password').catch()"
                        />
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 14, offset: 6 }">
                        <a-button type="primary" @click.prevent="onSubmit_reset">重置密码 </a-button>
                        <template #help>
                            <p>
                                <br />
                                选择<strong>重置密码</strong>来保存新密码，在您完成重置前密码不会被修改。
                            </p>
                        </template>
                    </a-form-item>
                </a-form>
            </template>
            <!--无效token-->
            <template v-if="step === 'error'">
                <a-result status="error" title="错误" sub-title="您的重置密码请求不能继续执行。" />
                <div class="desc">
                    <p style="font-size: 16px">
                        <strong>您需要修复以下问题：</strong>
                    </p>
                    <p>
                        <close-circle-outlined :style="{ color: 'red' }" />
                        {{ message.filter((i) => i.code === code)[0].problem }}
                        <a :href="message.filter((i) => i.code === code)[0].link">
                            {{ message.filter((i) => i.code === code)[0].solution }}&gt;</a
                        >
                    </p>
                </div>
            </template>
            <!--等待邮件-->
            <template v-if="step === 'waiting'">
                <a-result
                    title="已发送电子邮件"
                    :sub-title="
                        '系统已接受您的重置密码请求，请访问您的电子邮箱（' +
                        modelRef_request.email.toLowerCase() +
                        '），根据邮件内容提示步骤，重置密码。'
                    "
                >
                    <template #extra>
                        <a-button @click="$router.go(-1)" type="primary">返回</a-button>
                    </template>
                </a-result>
            </template>
            <!--成功修改密码-->
            <template v-if="step === 'done'">
                <a-result status="success" title="您的密码已重置" sub-title="下次登录时请使用您刚刚设置的密码。">
                    <template #extra>
                        <a-button type="primary" @click.prevent="$router.push('/login')">去登录</a-button>
                    </template>
                </a-result>
            </template>
        </a-card>
    </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, toRaw, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { validate_reset_password_token } from '@/api/post/validate_reset_password_token'
import { CloseCircleOutlined } from '@ant-design/icons-vue'
import { request_reset_password } from '@/api/post/request_reset_password'
import { reset_password } from '@/api/post/reset_password'
import { Form } from 'ant-design-vue'

export default defineComponent({
    components: {
        CloseCircleOutlined,
    },

    setup() {
        const $route = useRoute()

        // prettier-ignore
        const state = reactive({
            subtitle: '如果您无法登录，请填写此表单以重置密码。',       // 副标题
            reset_password_token: '',                           // 重置密码令牌
            step: '',                                           // 当前步骤
            message: [                                          // 提示
                {
                    code: 0,
                    problem: '',
                    solution: '',
                    link: '/login',
                },
                {
                    code: 1,
                    problem: '您提供的令牌无效或已过期',
                    solution: '重新发送邮件',
                    link: '/reset_password',
                },
                {
                    code: 2,
                    problem: '未找到此电子邮件地址对应的账户',
                    solution: '检查您的电子邮件地址',
                    link: '/reset_password',
                },
                {
                    code: 3,
                    problem: '此电子邮件地址对应的账户已停用',
                    solution: '提交客服工单',
                    link: '/contact',
                },
                {
                    code: 4,
                    problem: '管理员已禁止此用户重置密码',
                    solution: '提交客服工单',
                    link: '/contact',
                },
                {
                    code: 5,
                    problem: '电子邮件地址格式不正确',
                    solution: '检查您的电子邮件地址',
                    link: '/reset_password',
                },
                {
                    code: 6,
                    problem: '电子邮件地址未验证',
                    solution: '提交客服工单',
                    link: '/contact',
                },
                {
                    code: 7,
                    problem: '密码格式不正确',
                    solution: '重新输入密码',
                    link: '/reset_password?token=' + $route.query.token,
                },
            ],
            code: 0,                                            // 状态码
        })

        const onSubmit_request_loading = ref(false)

        onMounted(() => {
            if ($route.query.token) {
                // 有token，验证
                const token = $route.query.token
                validate_reset_password_token(token)
                    .then((response) => {
                        if (response.data.status.code === 0) {
                            // 令牌有效
                            state.step = 'reset'
                            state.reset_password_token = token
                            state.subtitle = '请输入并提交新的密码，并妥善保管您的新密码。'
                        } else {
                            // 令牌无效
                            state.step = 'error'
                            state.code = response.data.status.code
                        }
                    })
                    .catch()
            } else {
                // 无token，请求
                state.step = 'request'
            }
        })

        const modelRef_request = reactive({
            email: '',
        })

        const modelRef_reset = reactive({
            password: '',
        })

        const rulesRef_reset = reactive({
            password: [
                {
                    required: true,
                    message: '请输入新密码',
                },
                {
                    trigger: 'blur',
                    min: 8,
                    max: 16,
                    message: '密码长度应在 8-16 字符之间',
                },
            ],
        })

        const rulesRef_request = reactive({
            email: [
                {
                    trigger: 'blur',
                    required: true,
                    message: '请输入有效的电子邮件地址',
                    type: 'email',
                },
            ],
        })

        const {
            resetFields: resetFields_request,
            validate: validate_request,
            validateInfos: validateInfos_request,
        } = Form.useForm(modelRef_request, rulesRef_request)

        const {
            resetFields: resetFields_reset,
            validate: validate_reset,
            validateInfos: validateInfos_reset,
        } = Form.useForm(modelRef_reset, rulesRef_reset)

        const onSubmit_request = () => {
            validate_request()
                .then(() => {
                    onSubmit_request_loading.value = {
                        delay: 500,
                    }
                    const form = toRaw(modelRef_request)
                    request_reset_password(form.email).then((response) => {
                        onSubmit_request_loading.value = false
                        if (response.data.status.code === 0) {
                            // 请求成功
                            state.step = 'waiting'
                        } else {
                            // 请求失败
                            state.step = 'error'
                            state.code = response.data.status.code
                        }
                    })
                })
                .catch()
        }

        const onSubmit_reset = () => {
            validate_reset()
                .then(() => {
                    const form = toRaw(modelRef_reset)
                    reset_password(state.reset_password_token, form.password).then((response) => {
                        if (response.data.status.code === 0) {
                            // 请求成功
                            state.step = 'done'
                        } else {
                            // 请求失败
                            state.step = 'error'
                            state.code = response.data.status.code
                        }
                    })
                })
                .catch()
        }

        return {
            ...toRefs(state),
            validateInfos_request,
            resetFields_request,
            modelRef_request,
            validate_request,
            validateInfos_reset,
            resetFields_reset,
            modelRef_reset,
            validate_reset,
            onSubmit_reset,
            onSubmit_request,
            onSubmit_request_loading,
            labelCol: {
                span: 6,
            },
            wrapperCol: {
                span: 14,
            },
        }
    },
})
</script>

<style scoped>
.page-wrapper {
    padding: 10vh;
}

.desc p {
    margin-bottom: 1em;
}
</style>
