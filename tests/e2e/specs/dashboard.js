import { dom_map } from '../constant/test_info'

describe('更改仪表盘尺寸', () => {
    it('更改成功', function () {
        cy.login()
        cy.visit('/dashboard')
        cy.get(`#${dom_map.dashboard.size}`).parent().parent().click()
        cy.contains('每行显示 3 个').click()
        cy.contains('当前显示').click()
        cy.contains('每行显示 3 个')
    })
})
