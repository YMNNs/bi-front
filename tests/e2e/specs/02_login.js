describe('登录：异常处理', () => {
    it('用户名或密码无效', function () {
        const username = Cypress.config('invalid_username')
        const password = Cypress.config('invalid_password')
        cy.visit('/login')
        cy.get(`#${Cypress.config('dom_map').login.username}`)
            .clear()
            .type(username)
            .should('have.value', username)
        cy.get(`#${Cypress.config('dom_map').login.password}`)
            .clear()
            .type(password)
            .should('have.value', password)
        cy.get(`#${Cypress.config('dom_map').login.login}`).click()
        cy.contains('登录失败')
    })

    it('缺少必填项', function () {
        cy.visit('/login')
        cy.get(`#${Cypress.config('dom_map').login.login}`).click()
        cy.contains('请输入')
    })

    it('使用未经验证的电子邮件地址登录', function () {
        cy.visit('/login')
        cy.url().then((el) => {
            if (el.indexOf(Cypress.config('dev_hostname')) >= 0) {
                // 服务器
                cy.get(`#${Cypress.config('dom_map').login.username}`)
                    .clear()
                    .type(Cypress.config('email'))
                    .should('have.value', Cypress.config('email'))
                cy.get(`#${Cypress.config('dom_map').login.password}`)
                    .clear()
                    .type(Cypress.config('valid_password'))
                    .should('have.value', Cypress.config('valid_password'))
                cy.get(`#${Cypress.config('dom_map').login.login}`).click()
                cy.contains('邮箱未激活')
            } else {
                this.skip()
            }
        })
    })
})

describe('登录：正确路径', () => {
    it('登录成功', function () {
        cy.login()
    })
})
