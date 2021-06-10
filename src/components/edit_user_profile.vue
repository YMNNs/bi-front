<template>
    <a-page-header
        title="编辑个人信息"
        sub-title="您可以在此页面编辑您的信息"
        @back="$router.go(-1)"
    />
    <a-row>
        <a-col span="22" offset="1">
            <a-divider />
            <a-row gutter="32">
                <a-col span="8"
                    ><a-typography-title :level="3"
                        >主要设置</a-typography-title
                    >
                    <p>此信息将显示在您的个人资料中。</p>
                </a-col>
                <a-col span="14"
                    ><a-form layout="vertical">
                        <a-form-item v-bind="validateInfos_profile.username">
                            <template #label>
                                <strong>用户名</strong>
                            </template>
                            <template #help>
                                <p>
                                    用户名作为您的登录凭据之一，不会对外公开显示。
                                </p>
                            </template>
                            <a-input
                                @blur="validate_profile('username').catch()"
                                v-model:value="modelRef_profile.username"
                            >
                                <template #addonAfter>
                                    <strong
                                        >用户ID:
                                        {{ modelRef_profile.id }}</strong
                                    >
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
                                    请先点击验证邮件中的链接以激活您的电子邮件地址，这封邮件已经发送到<strong
                                        >{{ current_email }}</strong
                                    >。 <br /><a>重新发送验证邮件</a>
                                </p>
                            </template>
                            <a-input
                                @blur="validate_profile('email').catch()"
                                v-model:value="modelRef_profile.email"
                            >
                            </a-input>
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
                            >
                            </a-input>
                        </a-form-item>
                        <br />
                        <a-form-item>
                            <template #help>
                                <p>
                                    <br />
                                    这个页面上的所有字段都是可选的，可以在任何时候删除。通过填写它们，您就同意我们在您的用户信息出现的任何地方共享这些数据。请参阅我们的隐私声明，了解更多关于我们如何使用这些信息。
                                </p>
                            </template>
                            <a-button type="primary">保存个人信息</a-button>
                        </a-form-item>
                    </a-form></a-col
                >
            </a-row>
        </a-col>
    </a-row>
    <a-row>
        <a-col span="22" offset="1">
            <a-divider />
            <a-row gutter="32">
                <a-col span="8"
                    ><a-typography-title :level="3">密码</a-typography-title>
                    <p>
                        密码更新成功后，您将被重定向到登录页面，您可以使用新密码登录。
                    </p>
                </a-col>
                <a-col span="14">
                    <a-form layout="vertical" hideRequiredMark="true">
                        <a-form-item
                            v-bind="validateInfos_password.old_password"
                        >
                            <template #label>
                                <strong>当前密码</strong>
                            </template>
                            <template #help>
                                <p>要更改密码，您必须提供当前密码。</p>
                            </template>
                            <a-input-password
                                @blur="
                                    validate_password('old_password').catch()
                                "
                                v-model:value="modelRef_password.old_password"
                            >
                            </a-input-password>
                        </a-form-item>
                        <br />
                        <a-form-item
                            v-bind="validateInfos_password.new_password"
                        >
                            <template #label>
                                <strong>新密码</strong>
                            </template>
                            <template #help>
                                <p>新密码必须在8-16字符之间。</p>
                            </template>
                            <a-input-password
                                @blur="
                                    validate_password('new_password').catch()
                                "
                                v-model:value="modelRef_password.new_password"
                            >
                            </a-input-password>
                        </a-form-item>
                        <br />
                        <a-form-item>
                            <a-button type="primary">保存密码</a-button>
                        </a-form-item>
                    </a-form>
                </a-col>
            </a-row>
        </a-col>
    </a-row>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import { useForm } from "@ant-design-vue/use";
import { validate_username } from "@/api/post/validate_username";
import { validate_email } from "@/api/post/validate_email";
export default defineComponent({
    setup() {
        const state = reactive({
            email_verified: false,
            status: "enabled",
            last_login: "",
            current_email: "i@stager.top",
        });

        const modelRef_profile = reactive({
            id: 0,
            username: "",
            nickname: "",
            email: "",
            role: "",
        });

        const modelRef_password = reactive({
            old_password: "",
            new_password: "",
        });

        const rulesRef_password = reactive({
            old_password: [
                {
                    required: true,
                    message: "请输入当前密码",
                },
                {
                    trigger: "blur",
                    min: 8,
                    max: 16,
                    message: "密码长度应在8-16位之间",
                },
            ],
            new_password: [
                {
                    required: true,
                    message: "请输入新密码",
                },
                {
                    trigger: "blur",
                    min: 8,
                    max: 16,
                    message: "密码长度应在8-16位之间",
                },
            ],
        });

        const rulesRef_profile = reactive({
            username: [
                {
                    trigger: "blur",
                    required: false,
                    message: "请输入用户名",
                    type: "string",
                },
                {
                    trigger: "blur",
                    message: "用户名已被占用",
                    validator: (rule, value) => {
                        return new Promise((resolve, reject) => {
                            validate_username(value).then((response) => {
                                const { code, message } = response.data.status;
                                if (code === 0) {
                                    console.log("用户名验证成功");
                                    resolve();
                                } else {
                                    console.log("用户名验证失败");
                                    reject(message);
                                }
                            });
                        });
                    },
                },
            ],
            email: [
                {
                    trigger: "blur",
                    required: false,
                    message: "请输入有效的电子邮件地址",
                    type: "email",
                },
                {
                    trigger: "blur",
                    message: "电子邮件地址已被占用",
                    validator: (rule, value) => {
                        return new Promise((resolve, reject) => {
                            validate_email(value).then((response) => {
                                const { code, message } = response.data.status;
                                if (code === 0) {
                                    console.log("电子邮件验证成功");
                                    resolve();
                                } else {
                                    console.log("电子邮件验证失败");
                                    reject(message);
                                }
                            });
                        });
                    },
                },
            ],
            nickname: [
                {
                    trigger: "blur",
                    required: false,
                    min: 1,
                    max: 16,
                    type: "string",
                    message: "昵称长度应小于16字符",
                },
            ],
        });

        const {
            resetFields: resetFields_profile,
            validate: validate_profile,
            validateInfos: validateInfos_profile,
        } = useForm(modelRef_profile, rulesRef_profile);

        const {
            resetFields: resetFields_password,
            validate: validate_password,
            validateInfos: validateInfos_password,
        } = useForm(modelRef_password, rulesRef_password);

        return {
            ...toRefs(state),
            resetFields_profile,
            resetFields_password,
            validate_profile,
            validate_password,
            validateInfos_profile,
            validateInfos_password,
            modelRef_profile,
            modelRef_password,
        };
    },
});
</script>

<style scoped></style>
