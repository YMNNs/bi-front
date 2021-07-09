<template>
    <div class="page-wrapper">
        <a-card :bordered="true" style="width: 700px; margin: 0 auto">
            <!--    注册页-->
            <template v-if="step === 'register'">
                <a-page-header title="注册" :sub-title="subtitle" @back="$router.go(-1)" />
                <br />
                <!--注册表单-->
                <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
                    <a-form-item v-bind="validateInfos.email" label="电子邮件地址">
                        <a-input
                            v-model:value="modelRef.email"
                            size="large"
                            style="width: 100%"
                            @blur="validate('email').catch()"
                        />
                    </a-form-item>
                    <a-form-item v-bind="validateInfos.username" label="用户名">
                        <a-input
                            v-model:value="modelRef.username"
                            size="large"
                            style="width: 100%"
                            @blur="validate('username').catch()"
                        />
                    </a-form-item>
                    <a-form-item v-bind="validateInfos.password" label="密码">
                        <a-input-password
                            v-model:value="modelRef.password"
                            size="large"
                            style="width: 100%"
                            @blur="validate('password').catch()"
                        />
                    </a-form-item>
                    <a-form-item v-bind="validateInfos.nickname" label="昵称">
                        <a-input
                            v-model:value="modelRef.nickname"
                            size="large"
                            placeholder="可稍后设置"
                            style="width: 100%"
                            @blur="validate('nickname').catch()"
                        />
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 14, offset: 6 }">
                        <a-button type="primary" @click.prevent="onSubmit" :loading="buttonLoading">注册 </a-button>
                        <a-button style="margin-left: 10px" @click="resetFields">重置 </a-button>
                        <template #help
                            ><p>
                                <br />
                                选择<strong>注册</strong>来完成注册，选择<strong>重置</strong>来清空表单以供重新填写。
                            </p></template
                        >
                    </a-form-item>
                </a-form>
            </template>
            <!--    注册等待页-->
            <template v-if="step === 'waiting'">
                <a-result status="info" title="请稍候..." sub-title="一点点处理工作。" />
            </template>
            <!--    注册错误页-->
            <template v-if="step === 'error'">
                <a-result status="error" title="错误">
                    <template #subTitle>{{ error }}</template>
                    <template #extra>
                        <a-button key="back" type="primary" @click="$router.go(-1)">返回 </a-button>
                    </template>
                </a-result>
            </template>
            <!--    注册结果页-->
            <template v-if="step === 'done'">
                <a-result
                    status="success"
                    title="注册完成"
                    sub-title="我们已经向您的电子邮箱发送了一封验证邮件，请您尽快完成邮件验证。"
                >
                    <template #extra>
                        <a-button key="console" type="primary" @click="$router.push('/')">前往控制台 </a-button>
                    </template>
                </a-result>
            </template>
        </a-card>
    </div>
</template>

<script>
import { defineComponent, reactive, toRaw, toRefs, ref } from 'vue'
import { validate_username } from '@/api/post/validate_username'
import { validate_email } from '@/api/post/validate_email'
import { register } from '@/api/post/register'
import { useStore } from 'vuex'
import { Form } from 'ant-design-vue'

export default defineComponent({
    setup() {
        const store = useStore()

        // prettier-ignore
        const state = reactive({
            step: 'register',                                           // 当前步骤
            subtitle: `请填写表单以注册${process.env.VUE_APP_TITLE}`,      // 副标题
            error: '',                                                  // 当前错误
        })

        const buttonLoading = ref(false)

        // 表单模型
        const modelRef = reactive({
            username: '',
            password: '',
            email: '',
            nickname: '',
        })

        // 表单验证规则
        const rulesRef = reactive({
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
                {
                    trigger: 'blur',
                    message: '用户名已被占用',
                    validator: (rule, value) => {
                        return new Promise((resolve, reject) => {
                            validate_username(value).then((response) => {
                                const { code, message } = response.data.status
                                if (code === 0) {
                                    resolve()
                                } else {
                                    reject(message)
                                }
                            })
                        })
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
                    message: '密码长度必须在 8-16 字符之间',
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
                            validate_email(value).then((response) => {
                                const { code, message } = response.data.status
                                if (code === 0) {
                                    resolve()
                                } else {
                                    reject(message)
                                }
                            })
                        })
                    },
                },
            ],
            nickname: [
                {
                    trigger: 'blur',
                    required: false,
                    max: 16,
                    type: 'string',
                    message: '昵称长度上限为 16 字符',
                },
            ],
        })

        const { resetFields, validate, validateInfos } = Form.useForm(modelRef, rulesRef)

        const onSubmit = () => {
            validate()
                .then(() => {
                    buttonLoading.value = {
                        delay: 500,
                    }
                    state.step = 'waiting'
                    const form = toRaw(modelRef)
                    register(form.email, form.username, form.password, form.nickname).then((response) => {
                        if (response.data.status.code === 0) {
                            //注册成功
                            store.commit('CLEAR_USER_INFO')
                            store.commit('SET_TOKEN', response.data.data)
                            // 继续获取用户信息
                            setTimeout(() => {
                                store.dispatch('UPDATE_USER_INFO').then(() => {
                                    buttonLoading.value = false
                                    state.step = 'done'
                                })
                            }, 500)
                        } else {
                            state.step = 'error'
                            state.error = response.data.status.message
                        }
                    })
                })
                .catch()
        }

        return {
            ...toRefs(state),
            validateInfos,
            resetFields,
            modelRef,
            validate,
            onSubmit,
            labelCol: {
                span: 6,
            },
            wrapperCol: {
                span: 14,
            },
            buttonLoading,
        }
    },
})
</script>

<style scoped>
.page-wrapper {
    padding: 10vh;
}
</style>
