import {
    invalid_password,
    invalid_username,
    dom_map,
    valid_username,
    valid_password,
    mock_data,
    nickname,
    email,
} from '../constant/test_info'

describe('登录：异常处理', () => {
    it('用户名或密码无效', function () {
        const username = invalid_username
        const password = invalid_password
        cy.visit('/login')
        cy.get('#' + dom_map.login.username)
            .clear()
            .type(username)
            .should('have.value', username)
        cy.get('#' + dom_map.login.password)
            .clear()
            .type(password)
            .should('have.value', password)
        cy.get('#' + dom_map.login.login).click()
        cy.contains('登录失败', { timeout: 2000 })
    })
    it('缺少必填项', function () {
        cy.visit('/login')
        cy.get('#' + dom_map.login.login).click()
        cy.contains('请输入', { timeout: 2000 })
    })
    it('使用未经验证的电子邮件地址登录', function () {
        cy.visit('/login')
        cy.url().then((el) => {
            if (el.indexOf('develop') > 0) {
                // 服务器
                cy.get('#' + dom_map.login.username)
                    .clear()
                    .type(email)
                    .should('have.value', email)
                cy.get('#' + dom_map.login.password)
                    .clear()
                    .type(valid_password)
                    .should('have.value', valid_password)
                cy.contains(nickname, { timeout: 2000 })
            } else {
                this.skip()
            }
        })
    })
})

Cypress.Commands.add('login', function () {
    cy.visit('/login')
    cy.url().then((el) => {
        const login_info = {}
        if (el.indexOf('develop') > 0) {
            // 服务器
            login_info.username = valid_username
            login_info.password = valid_password
            login_info.nickname = nickname
        } else {
            // 本地 mock
            login_info.username = mock_data.username
            login_info.password = mock_data.password
            login_info.nickname = mock_data.nickname
        }
        cy.get('#' + dom_map.login.username)
            .clear()
            .type(login_info.username)
            .should('have.value', login_info.username)
        cy.get('#' + dom_map.login.password)
            .clear()
            .type(login_info.password)
            .should('have.value', login_info.password)
        cy.get('#' + dom_map.login.login).click()
        cy.contains(login_info.nickname, { timeout: 2000 })
    })
})
