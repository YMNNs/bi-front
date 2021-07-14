import { dom_map, mock_data } from '../constant/test_info'

describe('修改用户信息：错误处理', () => {
    it('用户名被占用', function () {
        cy.login()
        cy.visit('/edit_user_profile')
        cy.get(`#${dom_map.profile.username}`)
            .clear()
            .type(mock_data.duplicated_username)
            .should('have.value', mock_data.duplicated_username)
            .blur()
        cy.contains('用户名已被占用', { timeout: 2000 })
    })
})
