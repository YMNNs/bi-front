import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { setupAntd } from '@/antd'

// 本地测试使用假后端
if (process.env.VUE_APP_MOCK === 'true') {
    import('@/api/mock/user_info')
    import('@/api/mock/validate_username')
    import('@/api/mock/validate_email')
    import('@/api/mock/register')
    import('@/api/mock/request_reset_password')
    import('@/api/mock/reset_password')
    import('@/api/mock/validate_reset_password_token')
    import('@/api/mock/login')
    import('@/api/mock/edit_user_profile')
    import('@/api/mock/change_password')
    import('@/api/mock/change_table')
    import('@/api/mock/logout')
    import('@/api/mock/delete_account')
    import('@/api/mock/resend_activation_email')
    import('@/api/mock/activate_email')
    import('@/api/mock/table_content')
    import('@/api/mock/all_charts')
    import('@/api/mock/delete_chart')
    import('@/api/mock/all_tables')
    import('@/api/mock/create_chart')
    import('@/api/mock/view_chart')
    import('@/api/mock/edit_chart')
    import('@/api/mock/view_dashboard')
    import('@/api/mock/edit_dashboard')
    import('@/api/mock/create_instrument')
    import('@/api/mock/create_data')
    import('@/api/mock/delete_data')
    import('@/api/mock/get_dashboard_size')
    import('@/api/mock/change_dashboard_size')
    import('@/api/mock/get_data_keys')
    import('@/api/mock/update_data')
}

const app = createApp(App)

// 已配置按需引入，新组件需要在@/antd/index.js中导入
setupAntd(app)
app.use(store)
app.use(router)
app.mount('#app')
