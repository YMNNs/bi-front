describe('请求重置密码：错误处理', () => {
    it('电子邮件地址未注册', function () {
        cy.visit('/reset_password')
        cy.url().then((el) => {
            if (el.indexOf(Cypress.config('dev_hostname')) >= 0) {
                this.skip()
            }
            cy.get(`#${Cypress.config('dom_map').reset_password.email}`)
                .clear()
                .type(Cypress.config('email'))
            cy.get(`#${Cypress.config('dom_map').reset_password.request_button}`).click()
            cy.contains('未找到此电子邮件地址对应的账户')
        })
    })

    it('电子邮件地址格式不正确', function () {
        cy.visit('/reset_password')
        cy.url().then((el) => {
            if (el.indexOf(Cypress.config('dev_hostname')) >= 0) {
                this.skip()
            }
            cy.get(`#${Cypress.config('dom_map').reset_password.email}`)
                .clear()
                .type(Cypress.config('invalid_email'))
                .blur()
            cy.contains('请输入有效的电子邮件地址')
        })
    })
})

describe('请求重置密码：正确路径', () => {
    it('发送电子邮件', function () {
        cy.visit('/reset_password')
        cy.url().then((el) => {
            if (el.indexOf(Cypress.config('dev_hostname')) >= 0) {
                this.skip()
            }
            cy.get(`#${Cypress.config('dom_map').reset_password.email}`)
                .clear()
                .type(Cypress.config('mock_data').email)
                .blur()
            cy.get(`#${Cypress.config('dom_map').reset_password.request_button}`).click()
            cy.contains('已发送电子邮件')
        })
    })
})

describe('重置密码：错误处理', () => {
    it('错误token', function () {
        cy.visit(`/reset_password?token=${Cypress.config('invalid_token')}`)
        cy.contains('您提供的令牌无效或已过期')
    })

    it('密码格式不正确', function () {
        cy.visit('/login')
        cy.url().then((el) => {
            if (el.indexOf(Cypress.config('dev_hostname')) >= 0) {
                this.skip()
            }
            cy.visit(`/reset_password?token=${Cypress.config('mock_data').reset_password_token}`)
            cy.get(`#${Cypress.config('dom_map').reset_password.new_password}`)
                .clear()
                .type(Cypress.config('password_short'))
                .blur()
            cy.contains('密码长度必须在 8-16 字符之间')
        })
    })
})

describe('重置密码：正确路径', () => {
    it('重置密码', function () {
        cy.visit('/login')
        cy.url().then((el) => {
            if (el.indexOf(Cypress.config('dev_hostname')) >= 0) {
                this.skip()
            }
            cy.visit(`/reset_password?token=${Cypress.config('mock_data').reset_password_token}`)
            cy.get(`#${Cypress.config('dom_map').reset_password.new_password}`)
                .clear()
                .type(Cypress.config('valid_password'))
                .blur()
            cy.get(`#${Cypress.config('dom_map').reset_password.reset_button}`).click()
            cy.contains('您的密码已重置')
        })
    })
})
