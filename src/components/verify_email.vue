<template>
    <div style="padding-top: 30vh">
        <a-result title="正在处理..." v-if="step === 'waiting'" />
        <a-result
            status="warning"
            title="您提供的链接无效或已过期。"
            :sub-title="$route.query.token"
            v-if="step === 'error'"
            ><template #extra>
                <a-button @click.prevent="$router.push('/')" type="primary">返回控制台</a-button>
            </template>
        </a-result>
        <a-result
            status="success"
            title="邮箱已激活"
            v-if="step === 'success'"
            sub-title="您提供的邮箱现已可用于登录和重置密码。"
            ><template #extra>
                <a-button @click.prevent="$router.push('/')" type="primary">返回控制台</a-button>
            </template>
        </a-result>
    </div>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { activate_email } from '@/api/post/activate_email'
export default defineComponent({
    setup() {
        {
            const state = reactive({
                step: 'waiting',
            })
            const $route = useRoute()

            onMounted(() => {
                if ($route.query.token) {
                    // 有token，验证
                    state.step = 'waiting'
                    const token = $route.query.token
                    activate_email(token)
                        .then((response) => {
                            if (response.data.status.code === 0) {
                                state.step = 'success'
                            } else {
                                state.step = 'error'
                            }
                        })
                        .catch()
                } else {
                    // 无token，错误
                    state.step = 'error'
                }
            })
            return {
                ...toRefs(state),
            }
        }
    },
})
</script>

<style scoped></style>
