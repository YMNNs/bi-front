/**
 * 控件id表，列举了所有页面的可交互元素id
 * 引用于页面和测试用例
 * 测试中用到，不支持ES6
 */
module.exports = {
    register: {
        email: 'email',
        username: 'username',
        password: 'password',
        nickname: 'nickname',
        register: 'register',
        reset: 'reset',
    },
    login: {
        username: 'username',
        password: 'password',
        rememberMe: 'rememberMe',
        login: 'login',
    },
    new_data: {
        select_file: 'select_file',
        name: 'name',
        description: 'description',
        keys_text: 'keys_text',
        keys_number: 'keys_number',
        submit: 'submit',
    },
    chart_management: {
        search: 'search',
        sort: 'sort',
    },
    new_chart: {
        name: 'name',
        data: 'data',
        chart_type: 'chart_type',
        submit: 'submit',
    },
    edit_chart: {
        submit: 'submit',
        reset: 'reset',
        chart_type_prefix: 'chart_type_',
    },
    dashboard: {
        size: 'size',
        edit: 'edit',
        add: 'add',
        cancel_edit_dashboard: 'cancel_edit_dashboard',
        cancel_add_edit_chart: 'cancel_add_edit_chart',
        reset: 'reset',
        finish_edit_dashboard: 'finish_edit_dashboard',
        finish_add: 'finish_add',
        finish_edit_chart: 'finish_edit_chart',
        select_chart: 'select_chart',
        left: 'left',
        right: 'right',
        delete: 'delete',
        edit_instrument: 'edit_instrument',
        filter_checkbox: 'filter_checkbox',
        select_keys: 'select_keys',
    },
    profile: {
        username: 'username',
        email: 'email',
        resend_link: 'resend_link',
        nickname: 'nickname',
        update_profile_button: 'update_profile_button',
        current_password: 'current_password',
        new_password: 'new_password',
        update_password_button: 'update_password_button',
        delete_account_button: 'delete_account_button',
        delete_username: 'delete_username',
        delete_confirm: 'delete_confirm',
        delete_password: 'delete_password',
        confirm_delete_button: 'confirm_delete_button',
    },
    reset_password: {
        email: 'email',
        request_button: 'request_button',
        new_password: 'new_password',
        reset_button: 'reset_button',
    },
    layout: {
        dropdown: 'dropdown',
        settings: 'settings',
        logout: 'logout',
    },
}
