import { valid_username, valid_password, email, nickname, dom_map, mock_data } from '../constant/test_info'

describe('注册：异常处理', () => {
    it('电子邮件地址被占用', function () {
        cy.visit('/register')
        cy.get(`#${dom_map.register.email}`).clear().type(mock_data.email).should('have.value', mock_data.email).blur()
        cy.contains('电子邮件地址已被占用', { timeout: 2000 })
    })

    it('用户名被占用', function () {
        cy.visit('/register')
        cy.get(`#${dom_map.register.username}`)
            .clear()
            .type(mock_data.username)
            .should('have.value', mock_data.username)
            .blur()
        cy.contains('用户名已被占用', { timeout: 2000 })
    })

    it('密码格式不正确', function () {
        const password = '111'
        cy.visit('/register')
        cy.get(`#${dom_map.register.password}`).clear().type(password).should('have.value', password).blur()
        cy.contains('密码长度必须在 8-16 字符之间', { timeout: 2000 })
    })

    it('昵称格式不正确', function () {
        const nickname = 'aaaaa aaaaa aaaaa aaaaa'
        cy.visit('/register')
        cy.get(`#${dom_map.register.nickname}`).clear().type(nickname).should('have.value', nickname).blur()
        cy.contains('昵称长度上限为 16 字符', { timeout: 2000 })
    })

    it('缺少必填项目', function () {
        cy.visit('/register')
        cy.get(`#${dom_map.register.register}`).click()
        cy.contains('请输入', { timeout: 2000 })
    })

    it('重置表单', function () {
        cy.visit('/register')
        cy.get(`#${dom_map.register.register}`).click()
        cy.get(`#${dom_map.register.reset}`).click()
        cy.contains('请输入', { timeout: 2000 }).should('not.exist')
    })
})

describe('注册：正确路径', function () {
    it('注册', () => {
        cy.visit('/register')
        cy.get(`#${dom_map.register.email}`).clear().type(email).should('have.value', email).blur()
        cy.get(`#${dom_map.register.username}`).clear().type(valid_username).should('have.value', valid_username).blur()
        cy.get(`#${dom_map.register.password}`).clear().type(valid_password).should('have.value', valid_password).blur()
        cy.get(`#${dom_map.register.nickname}`).clear().type(nickname).should('have.value', nickname).blur()
        cy.get(`#${dom_map.register.register}`).click()
        cy.contains('注册完成', { timeout: 2000 })
    })
})
