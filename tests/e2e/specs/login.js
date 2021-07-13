import {
    invalid_password,
    invalid_username,
    dom_map,
    valid_username,
    valid_password,
    mock_data,
} from '../constant/test_info'

describe('登录：异常处理', () => {
    it('用户名或密码无效', () => {
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
    it('缺少必填项', () => {
        cy.visit('/login')
        cy.get('#' + dom_map.login.login).click()
        cy.contains('请输入', { timeout: 2000 })
    })
    it('使用未经验证的电子邮件地址登录', () => {})
})

Cypress.Commands.add('login', () => {
    cy.visit('/login')
    // if (cy.url().toString().indexOf('develop')) {
    //     // 服务器
    //     const username = valid_username
    //     const password = valid_password
    // } else {
    //     const username = mock_data.username
    //     const password = mock_data.password
    // }
})
