<template>
    <a-page-header title="设置" sub-title="您可以在此页面编辑您的设置" @back="$router.go(-1)" />
    <a-row>
        <a-col :span="22" :offset="1">
            <a-divider />
            <a-row :gutter="32">
                <a-col :span="8"
                    ><a-typography-title :level="3">个人信息</a-typography-title>
                    <p>此信息将显示在您的个人资料中。</p>
                </a-col>
                <a-col :span="14"
                    ><a-form layout="vertical" :hideRequiredMark="true">
                        <a-form-item v-bind="validateInfos_profile.username">
                            <template #label>
                                <strong>用户名</strong>
                            </template>
                            <template #help>
                                <p>用户名作为您的登录凭据之一，不会对外公开显示。</p>
                            </template>
                            <a-input
                                @blur="validate_profile('username').catch()"
                                v-model:value="modelRef_profile.username"
                            >
                                <template #addonAfter>
                                    <strong>用户 ID: {{ modelRef_profile.id }}</strong>
                                </template>
                            </a-input>
                        </a-form-item>
                        <br />
                        <a-form-item v-bind="validateInfos_profile.email">
                            <template #label>
                                <strong>电子邮件地址</strong>
                            </template>
                            <template #help v-if="email_verified">
                                <p>电子邮件地址用于登录和重置密码。</p>
                            </template>
                            <template #help v-else>
                                <p>
                                    请先点击验证邮件中的链接以激活您的电子邮件地址，这封邮件已经发送到
                                    <strong>{{ original_profile.email }}</strong
                                    >。 <br /><a-typography-link
                                        :disabled="disable_resend_link"
                                        @click.prevent="send_email"
                                        >重新发送激活邮件</a-typography-link
                                    >
                                </p>
                            </template>
                            <a-input
                                :disabled="disable_resend_link"
                                @blur="validate_profile('email').catch()"
                                v-model:value="modelRef_profile.email"
                            />
                        </a-form-item>
                        <br />
                        <a-form-item v-bind="validateInfos_profile.nickname">
                            <template #label>
                                <strong>昵称</strong>
                            </template>
                            <template #help>
                                <p>输入你的名字，这样你认识的人就能认出你。</p>
                            </template>
                            <a-input
                                @blur="validate_profile('nickname').catch()"
                                v-model:value="modelRef_profile.nickname"
                            />
                        </a-form-item>
                        <br />
                        <a-form-item>
                            <template #help>
                                <p>
                                    <br />
                                    以上的所有字段都是可选的，可以在任何时候删除。通过填写它们，您就同意我们在您的用户信息出现的任何地方共享这些数据。请参阅我们的隐私声明，了解更多关于我们如何使用这些信息。
                                </p>
                            </template>
                            <a-button type="primary" @click.prevent="onSubmit_profile">保存个人信息</a-button>
                        </a-form-item>
                    </a-form></a-col
                >
            </a-row>
        </a-col>
    </a-row>
    <a-row>
        <a-col :span="22" :offset="1">
            <a-divider />
            <a-row :gutter="32">
                <a-col :span="8"
                    ><a-typography-title :level="3">密码</a-typography-title>
                    <p>密码更新成功后，您将被重定向到登录页面，您可以使用新密码登录。</p>
                </a-col>
                <a-col :span="14">
                    <a-form layout="vertical" :hideRequiredMark="true">
                        <a-form-item v-bind="validateInfos_password.old_password">
                            <template #label>
                                <strong>当前密码</strong>
                            </template>
                            <template #help>
                                <p>要更改密码，您必须提供当前密码。</p>
                            </template>
                            <a-input-password
                                autocomplete
                                @blur="validate_password('old_password').catch()"
                                v-model:value="modelRef_password.old_password"
                            />
                        </a-form-item>
                        <br />
                        <a-form-item v-bind="validateInfos_password.new_password">
                            <template #label>
                                <strong>新密码</strong>
                            </template>
                            <template #help>
                                <p>新密码长度必须在8-16字符之间。</p>
                            </template>
                            <a-input-password
                                autocomplete
                                @blur="validate_password('new_password').catch()"
                                v-model:value="modelRef_password.new_password"
                            />
                        </a-form-item>
                        <br />
                        <a-form-item>
                            <a-button type="primary" @click.prevent="onSubmit_password">更新密码</a-button>
                        </a-form-item>
                    </a-form>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
    <a-row>
        <a-col :span="22" :offset="1">
            <a-divider />
            <a-row :gutter="32">
                <a-col :span="8"
                    ><a-typography-title type="danger" :level="3">删除账户</a-typography-title>
                    <p>一旦你删除了你的账户，将无法恢复。</p>
                </a-col>
                <a-col :span="14">
                    <a-form layout="vertical">
                        <a-form-item>
                            <template #help>
                                <p>
                                    <br />
                                    在删除账户之前，我们需要确认您对账户的所有权。
                                </p>
                            </template>
                            <a-button danger @click.prevent="showModal">删除账户</a-button>
                        </a-form-item>
                    </a-form>
                    <a-modal v-model:visible="modal_visible" :confirm-loading="modal_confirmLoading" :footer="null">
                        <template #title>
                            <strong>你确定要这么做吗？</strong>
                        </template>
                        <a-alert
                            message="注意"
                            description="请认真阅读下面的说明，这非常重要。"
                            type="error"
                            show-icon
                            banner
                        >
                            <template #icon><WarningOutlined /></template>
                        </a-alert>
                        <br />
                        <p>我们将<strong>立即删除您所有的数据、图表、仪表盘</strong>，以及个人信息。</p>
                        <p>您的用户名将对{{ app_title }}上的所有人开放。</p>
                        <p>欲了解更多帮助，请阅读我们的文章“删除您的用户帐户”。</p>
                        <a-divider />
                        <a-form layout="vertical" :hideRequiredMark="true">
                            <a-form-item v-bind="validateInfos_delete.username">
                                <template #label>
                                    <strong>您的用户名</strong>
                                </template>
                                <a-input
                                    @blur="validate_delete('username').catch()"
                                    v-model:value="modelRef_delete.username"
                                />
                            </a-form-item>
                            <a-form-item v-bind="validateInfos_delete.confirm_text">
                                <template #label>
                                    <strong>在下方输入“<i>删除我的账户</i>”以确认</strong>
                                </template>
                                <a-input
                                    @change="validate_delete('confirm_text').catch()"
                                    v-model:value="modelRef_delete.confirm_text"
                                />
                            </a-form-item>
                            <a-form-item v-bind="validateInfos_delete.password">
                                <template #label>
                                    <strong>确认您的密码</strong>
                                </template>
                                <a-input-password
                                    @blur="validate_delete('password').catch()"
                                    v-model:value="modelRef_delete.password"
                                />
                            </a-form-item>
                            <a-form-item>
                                <a-button
                                    danger
                                    :disabled="disable_delete_button"
                                    ghost
                                    block
                                    @click.prevent="onSubmit_delete"
                                    >确认并删除我的账户</a-button
                                >
                            </a-form-item>
                        </a-form>
                    </a-modal>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
</template>

<script>
import { defineComponent, onMounted, reactive, toRaw, toRefs } from 'vue'
import { validate_username } from '@/api/post/validate_username'
import { validate_email } from '@/api/post/validate_email'
import { edit_user_profile } from '@/api/post/edit_user_profile'
import { Form, notification } from 'ant-design-vue'
import { change_password } from '@/api/post/change_password'
import { logout } from '@/api/post/logout'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { user_info } from '@/api/post/user_info'
import { WarningOutlined } from '@ant-design/icons-vue'
import { delete_account } from '@/api/post/delete_account'
import { resend_activation_email } from '@/api/post/resend_activation_email'
import { assign, assignWith } from 'lodash-es'

export default defineComponent({
    components: {
        WarningOutlined,
    },
    setup() {
        const store = useStore()
        const $router = useRouter()

        const app_title = process.env.VUE_APP_TITLE

        // prettier-ignore
        const state = reactive({
            modal_visible: false,           // 对话框可见状态
            modal_confirmLoading: false,    // 对话框按钮加载状态
            email_verified: false,          // 电子邮件地址验证状态
            status: '',                     // 用户状态
            last_login: '',                 // 上次登录时间
            disable_delete_button: true,    // 禁用删除按钮状态
            disable_resend_link: false,     // 禁用发送电子邮件按钮状态
            original_profile: {             // 原始用户信息
                id: 0,
                username: '',
                nickname: '',
                email: '',
            },
        })

        const showModal = () => {
            state.modal_visible = true
        }

        const send_email = () => {
            resend_activation_email()
                .then((response) => {
                    if (response.data.status.code === 0) {
                        notification['success']({
                            message: '成功',
                            description: `已向 ${state.original_profile.email} 发送激活邮件`,
                        })
                        state.disable_resend_link = true
                    } else {
                        notification['error']({
                            message: '错误',
                            description: response.data.status.message,
                        })
                    }
                })
                .catch()
        }

        onMounted(() => {
            update()
        })

        const update = () => {
            resetFields_delete()
            resetFields_profile()
            resetFields_password()
            user_info().then((response) => {
                if (response.data.status.code === 0) {
                    state.disable_resend_link = false
                    state.status = response.data.data.user.status
                    state.email_verified = response.data.data.user.emailVerified === '1'
                    state.last_login = new Date(parseInt(response.data.data.user.last_login) * 1000).toLocaleString()
                    assign(state.original_profile, response.data.data.user)
                    assign(modelRef_profile, state.original_profile)
                }
            })
        }

        const modelRef_profile = reactive({
            id: 0,
            username: '',
            nickname: '',
            email: '',
        })

        const modelRef_password = reactive({
            old_password: '',
            new_password: '',
        })

        const modelRef_delete = reactive({
            username: '',
            confirm_text: '',
            password: '',
        })

        const rulesRef_delete = reactive({
            username: [
                {
                    trigger: 'blur',
                    required: true,
                    message: '请输入用户名',
                    type: 'string',
                },
                {
                    trigger: 'blur',
                    max: 16,
                    message: '用户名长度上限为 16 字符',
                },
            ],
            confirm_text: [
                {
                    trigger: 'change',
                    required: false,
                    type: 'string',
                },
                {
                    trigger: 'change',
                    validator: (rule, value) => {
                        return new Promise((resolve, reject) => {
                            if (value === '删除我的账户') {
                                state.disable_delete_button = false
                                resolve()
                            } else {
                                state.disable_delete_button = true
                                reject('')
                            }
                        }).catch()
                    },
                },
            ],
            password: [
                {
                    required: true,
                    message: '请输入密码',
                },
                {
                    trigger: 'blur',
                    min: 8,
                    max: 16,
                    message: '密码长度应在 8-16 字符之间',
                },
            ],
        })

        const rulesRef_password = reactive({
            old_password: [
                {
                    required: true,
                    message: '请输入当前密码',
                },
                {
                    trigger: 'blur',
                    min: 8,
                    max: 16,
                    message: '密码长度应在 8-16 字符之间',
                },
            ],
            new_password: [
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

        const rulesRef_profile = reactive({
            username: [
                {
                    trigger: 'blur',
                    required: true,
                    message: '请输入用户名',
                    type: 'string',
                },
                {
                    trigger: 'blur',
                    message: '用户名已被占用',
                    validator: (rule, value) => {
                        return new Promise((resolve, reject) => {
                            if (value !== state.original_profile.username) {
                                validate_username(value).then((response) => {
                                    const { code, message } = response.data.status
                                    if (code === 0) {
                                        resolve()
                                    } else {
                                        reject(message)
                                    }
                                })
                            } else {
                                resolve()
                            }
                        }).catch()
                    },
                },
                {
                    trigger: 'blur',
                    max: 16,
                    message: '用户名长度上限为 16 字符',
                },
            ],
            email: [
                {
                    trigger: 'blur',
                    required: true,
                    message: '请输入有效的电子邮件地址',
                    type: 'email',
                },
                {
                    trigger: 'blur',
                    message: '电子邮件地址已被占用',
                    validator: (rule, value) => {
                        return new Promise((resolve, reject) => {
                            if (value.toUpperCase() !== state.original_profile.email.toUpperCase()) {
                                validate_email(value).then((response) => {
                                    const { code, message } = response.data.status
                                    if (code === 0) {
                                        resolve()
                                    } else {
                                        reject(message)
                                    }
                                })
                            } else {
                                resolve()
                            }
                        }).catch()
                    },
                },
            ],
            nickname: [
                {
                    trigger: 'blur',
                    required: false,
                    min: 1,
                    max: 16,
                    type: 'string',
                    message: '昵称长度上限为 16 字符',
                },
            ],
        })

        const onSubmit_profile = () => {
            validate_profile().then(() => {
                const form = toRaw(modelRef_profile)
                const user = {}
                // Object.keys(form).forEach((key) => {
                //     if (
                //         form[key] &&
                //         form[key] !== state.original_profile[key]
                //     ) {
                //         user[key] = form[key];
                //     }
                // });
                assignWith(user, form, (objValue, srcValue, key) => {
                    return srcValue && srcValue !== state.original_profile[key] ? srcValue : null
                })
                if (user.length === 0) {
                    return
                }
                edit_user_profile(user)
                    .then((response) => {
                        update()
                        if (response.data.status.code === 0) {
                            // 修改成功
                            notification['success']({
                                message: '成功',
                                description: '您的个人信息现已更新。',
                            })
                            // 更新本地用户信息
                            store.dispatch('UPDATE_USER_INFO')
                        } else {
                            notification['error']({
                                message: '您的修改个人信息请求出现错误',
                                description: `个人信息未被修改，因为 ${response.data.status.message}。`,
                            })
                        }
                    })
                    .catch()
            })
        }

        const onSubmit_password = () => {
            validate_password().then(() => {
                const form = toRaw(modelRef_password)
                change_password(form.old_password, form.new_password).then((response) => {
                    if (response.data.status.code === 0) {
                        //修改密码成功
                        // 修改成功
                        notification['success']({
                            message: '成功',
                            description: '您的个人密码现已更新，请使用新密码重新登录。',
                        })
                        logout()
                            .then((response) => {
                                if (response.data) {
                                    // 退出成功
                                    //退出成功
                                    store.commit('SET_LOGOUT', true)
                                    store.commit('CLEAR_USER_INFO')
                                    store.commit('CLEAR_TOKEN')
                                    $router.push('/login')
                                }
                            })
                            .catch()
                    } else {
                        notification['error']({
                            message: '您的修改密码请求出现错误',
                            description: `您的密码未被修改，因为 ${response.data.status.message}。`,
                        })
                    }
                })
            })
        }

        const onSubmit_delete = () => {
            validate_delete().then(() => {
                const form = toRaw(modelRef_delete)
                delete_account(form.username, form.password)
                    .then((response) => {
                        if (response.data.status.code === 0) {
                            //删除成功
                            store.commit('CLEAR_USER_INFO')
                            store.commit('CLEAR_TOKEN')
                            notification['success']({
                                message: '成功',
                                description: `用户 ${form.username} 已删除，正在前往登录页面。`,
                            })
                            $router.push('/login')
                        } else {
                            notification['error']({
                                message: '您的删除账户请求出现错误',
                                description: `您的账户未被删除，因为 ${response.data.status.message}。`,
                            })
                        }
                    })
                    .catch()
            })
        }

        const {
            resetFields: resetFields_profile,
            validate: validate_profile,
            validateInfos: validateInfos_profile,
        } = Form.useForm(modelRef_profile, rulesRef_profile)

        const {
            resetFields: resetFields_password,
            validate: validate_password,
            validateInfos: validateInfos_password,
        } = Form.useForm(modelRef_password, rulesRef_password)

        const {
            resetFields: resetFields_delete,
            validate: validate_delete,
            validateInfos: validateInfos_delete,
        } = Form.useForm(modelRef_delete, rulesRef_delete)

        return {
            ...toRefs(state),
            resetFields_profile,
            resetFields_password,
            resetFields_delete,
            validate_profile,
            validate_password,
            validate_delete,
            validateInfos_profile,
            validateInfos_password,
            validateInfos_delete,
            modelRef_profile,
            modelRef_password,
            modelRef_delete,
            onSubmit_profile,
            onSubmit_password,
            onSubmit_delete,
            showModal,
            send_email,
            app_title,
        }
    },
})
</script>

<style scoped></style>
