// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import { dom_map, mock_data, nickname, valid_password, valid_username } from '../constant/test_info'

/**
 * 登录操作
 * 自动判断环境
 */
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
        cy.get(`#${dom_map.login.username}`).clear().type(login_info.username).should('have.value', login_info.username)
        cy.get(`#${dom_map.login.password}`).clear().type(login_info.password).should('have.value', login_info.password)
        cy.get(`#${dom_map.login.login}`).click()
        cy.contains(login_info.nickname, { timeout: 2000 })
    })
})
