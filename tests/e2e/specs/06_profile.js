describe('修改用户信息：错误处理', () => {
    it('用户名被占用', function () {
        cy.login()
        cy.visit('/edit_user_profile')
        cy.get(`#${Cypress.config('dom_map').profile.username}`)
            .clear()
            .type(Cypress.config('mock_data').duplicated_username)
            .should('have.value', Cypress.config('mock_data').duplicated_username)
            .blur()
        cy.contains('用户名已被占用')
    })

    it('用户名过长', function () {
        cy.login()
        cy.visit('/edit_user_profile')
        cy.get(`#${Cypress.config('dom_map').profile.username}`)
            .clear()
            .type(Cypress.config('username_long'))
            .should('have.value', Cypress.config('username_long'))
            .blur()
        cy.contains('用户名长度上限为 16 字符')
    })

    it('电子邮件地址被占用', function () {
        cy.login()
        cy.visit('/edit_user_profile')
        cy.get(`#${Cypress.config('dom_map').profile.email}`)
            .clear()
            .type(Cypress.config('mock_data').duplicated_email)
            .should('have.value', Cypress.config('mock_data').duplicated_email)
            .blur()
        cy.contains('电子邮件地址已被占用')
    })

    it('电子邮件格式不正确', function () {
        cy.login()
        cy.visit('/edit_user_profile')
        cy.get(`#${Cypress.config('dom_map').profile.email}`)
            .clear()
            .type(Cypress.config('invalid_email'))
            .should('have.value', Cypress.config('invalid_email'))
            .blur()
        cy.contains('请输入有效的电子邮件地址')
    })

    it('昵称过长', function () {
        cy.login()
        cy.visit('/edit_user_profile')
        cy.get(`#${Cypress.config('dom_map').profile.nickname}`)
            .clear()
            .type(Cypress.config('nickname_long'))
            .should('have.value', Cypress.config('nickname_long'))
            .blur()
        cy.contains('昵称长度上限为 16 字符')
    })

    it('缺少必填信息', function () {
        cy.login()
        cy.visit('/edit_user_profile')
        cy.get(`#${Cypress.config('dom_map').profile.username}`).clear()
        cy.get(`#${Cypress.config('dom_map').profile.email}`).clear()
        cy.get(`#${Cypress.config('dom_map').profile.nickname}`).clear()
        cy.get(`#${Cypress.config('dom_map').profile.update_profile_button}`).click()
        cy.contains('请输入')
    })
})

describe('修改用户信息：正确路径', () => {
    it('修改用户信息', function () {
        cy.login()
        cy.visit('/edit_user_profile')
        cy.get(`#${Cypress.config('dom_map').profile.username}`)
            .clear()
            .type(Cypress.config('valid_username_new'))
            .should('have.value', Cypress.config('valid_username_new'))
            .blur()
        cy.get(`#${Cypress.config('dom_map').profile.email}`)
            .clear()
            .type(Cypress.config('email_new'))
            .should('have.value', Cypress.config('email_new'))
            .blur()
        cy.get(`#${Cypress.config('dom_map').profile.nickname}`)
            .clear()
            .type(Cypress.config('nickname_new'))
            .should('have.value', Cypress.config('nickname_new'))
            .blur()
        cy.get(`#${Cypress.config('dom_map').profile.update_profile_button}`).click()
        cy.contains('您的个人信息现已更新。')
        // 再改回去
        cy.get(`#${Cypress.config('dom_map').profile.username}`)
            .clear()
            .type(Cypress.config('valid_username'))
            .should('have.value', Cypress.config('valid_username'))
            .blur()
        cy.get(`#${Cypress.config('dom_map').profile.email}`)
            .clear()
            .type(Cypress.config('email'))
            .should('have.value', Cypress.config('email'))
            .blur()
        cy.get(`#${Cypress.config('dom_map').profile.nickname}`)
            .clear()
            .type(Cypress.config('nickname'))
            .should('have.value', Cypress.config('nickname'))
            .blur()
        cy.get(`#${Cypress.config('dom_map').profile.update_profile_button}`).click()
        cy.contains('您的个人信息现已更新。')
    })
})

describe('修改密码：错误处理', () => {
    it('原密码格式不正确', function () {
        cy.login()
        cy.visit('/edit_user_profile')
        cy.get(`#${Cypress.config('dom_map').profile.current_password}`)
            .clear()
            .type(Cypress.config('password_short'))
            .should('have.value', Cypress.config('password_short'))
            .blur()
        cy.contains('密码长度必须在 8-16 字符之间')
    })

    it('新密码格式不正确', function () {
        cy.login()
        cy.visit('/edit_user_profile')
        cy.get(`#${Cypress.config('dom_map').profile.new_password}`)
            .clear()
            .type(Cypress.config('password_short'))
            .should('have.value', Cypress.config('password_short'))
            .blur()
        cy.contains('密码长度必须在 8-16 字符之间')
    })

    it('旧密码不匹配', function () {
        cy.login()
        cy.visit('/edit_user_profile')
        cy.get(`#${Cypress.config('dom_map').profile.current_password}`)
            .clear()
            .type(Cypress.config('invalid_password'))
            .should('have.value', Cypress.config('invalid_password'))
            .blur()
        cy.get(`#${Cypress.config('dom_map').profile.new_password}`)
            .clear()
            .type(Cypress.config('valid_password'))
            .should('have.value', Cypress.config('valid_password'))
            .blur()
        cy.get(`#${Cypress.config('dom_map').profile.update_password_button}`).click()
        cy.contains('您的修改密码请求出现错误')
    })
})

describe('修改密码：正确路径', () => {
    it('修改密码', function () {
        cy.login()
        cy.visit('/edit_user_profile')
        cy.url().then((el) => {
            const password_info = {}
            if (el.indexOf(Cypress.config('dev_hostname')) >= 0) {
                // 服务器
                password_info.current_password = Cypress.config('valid_password')
            } else {
                password_info.current_password = Cypress.config('mock_data').password
            }
            cy.get(`#${Cypress.config('dom_map').profile.current_password}`)
                .clear()
                .type(password_info.current_password)
                .should('have.value', password_info.current_password)
                .blur()
            cy.get(`#${Cypress.config('dom_map').profile.new_password}`)
                .clear()
                .type(Cypress.config('valid_password'))
                .should('have.value', Cypress.config('valid_password'))
                .blur()
            cy.get(`#${Cypress.config('dom_map').profile.update_password_button}`).click()
            cy.contains('您的个人密码现已更新，请使用新密码重新登录。')
        })
    })
})

describe('删除账户：错误处理', () => {
    it('用户名不匹配', function () {
        cy.login()
        cy.visit('/edit_user_profile')
        cy.get(`#${Cypress.config('dom_map').profile.delete_account_button}`).click()
        cy.url().then((el) => {
            const delete_info = {}
            if (el.indexOf(Cypress.config('dev_hostname')) >= 0) {
                // 服务器
                delete_info.username = Cypress.config('valid_username')
                delete_info.password = Cypress.config('valid_password')
            } else {
                // 本地 mock
                delete_info.username = Cypress.config('mock_data').username
                delete_info.password = Cypress.config('mock_data').password
            }
            cy.get(`#${Cypress.config('dom_map').profile.delete_username}`)
                .clear()
                .type(Cypress.config('invalid_username'))
                .blur()
            cy.get(`#${Cypress.config('dom_map').profile.delete_confirm}`)
                .clear()
                .type('删除我的账户')
                .blur()
            cy.get(`#${Cypress.config('dom_map').profile.delete_password}`)
                .clear()
                .type(delete_info.password)
                .blur()
            cy.get(`#${Cypress.config('dom_map').profile.confirm_delete_button}`).click()
            cy.contains('您的删除账户请求出现错误')
        })
    })

    it('密码不匹配', function () {
        cy.login()
        cy.visit('/edit_user_profile')
        cy.get(`#${Cypress.config('dom_map').profile.delete_account_button}`).click()
        cy.url().then((el) => {
            const delete_info = {}
            if (el.indexOf(Cypress.config('dev_hostname')) >= 0) {
                // 服务器
                delete_info.username = Cypress.config('valid_username')
                delete_info.password = Cypress.config('valid_password')
            } else {
                // 本地 mock
                delete_info.username = Cypress.config('mock_data').username
                delete_info.password = Cypress.config('mock_data').password
            }
            cy.get(`#${Cypress.config('dom_map').profile.delete_username}`)
                .clear()
                .type(delete_info.username)
                .blur()
            cy.get(`#${Cypress.config('dom_map').profile.delete_confirm}`)
                .clear()
                .type('删除我的账户')
                .blur()
            cy.get(`#${Cypress.config('dom_map').profile.delete_password}`)
                .clear()
                .type(Cypress.config('invalid_password'))
                .blur()
            cy.get(`#${Cypress.config('dom_map').profile.confirm_delete_button}`).click()
            cy.contains('您的删除账户请求出现错误')
        })
    })
})

describe('删除账户：正确路径', () => {
    it('删除账户', function () {
        cy.login()
        cy.visit('/edit_user_profile')
        cy.get(`#${Cypress.config('dom_map').profile.delete_account_button}`).click()
        cy.url().then((el) => {
            const delete_info = {}
            if (el.indexOf(Cypress.config('dev_hostname')) >= 0) {
                // 服务器
                delete_info.username = Cypress.config('valid_username')
                delete_info.password = Cypress.config('valid_password')
            } else {
                // 本地 mock
                delete_info.username = Cypress.config('mock_data').username
                delete_info.password = Cypress.config('mock_data').password
            }
            cy.get(`#${Cypress.config('dom_map').profile.delete_username}`)
                .clear()
                .type(delete_info.username)
                .blur()
            cy.get(`#${Cypress.config('dom_map').profile.delete_confirm}`)
                .clear()
                .type('删除我的账户')
                .blur()
            cy.get(`#${Cypress.config('dom_map').profile.delete_password}`)
                .clear()
                .type(delete_info.password)
                .blur()
            cy.get(`#${Cypress.config('dom_map').profile.confirm_delete_button}`).click()
            cy.contains('已删除，正在前往登录页面')
        })
    })
})
