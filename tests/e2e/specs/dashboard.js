import { chart_name, dom_map, mock_data } from '../constant/test_info'

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

describe.only('编辑仪表盘', () => {
    it('新增仪表', function () {
        cy.login()
        cy.visit('/dashboard')
        cy.get(`#${dom_map.dashboard.edit}`).click()
        cy.get(`#${dom_map.dashboard.add}`).click()
        cy.get(`#${dom_map.dashboard.select_chart}`).click()
        cy.url().then((el) => {
            const dashboard_info = {}
            if (el.indexOf('develop') > 0) {
                // 服务器
                dashboard_info.chart_name = chart_name
            } else {
                dashboard_info.chart_name = mock_data.charts[0].chart_name
            }
            cy.contains('.ant-select-item-option-content', dashboard_info.chart_name).click()
            cy.get(`#${dom_map.dashboard.finish_add}`).click()
            cy.contains('成功')
        })
    })

    it.only('编辑仪表', function () {
        cy.login()
        cy.visit('/dashboard')
        cy.get(`#${dom_map.dashboard.edit}`).click()
        cy.url().then((el) => {
            const dashboard_info = {}
            if (el.indexOf('develop') > 0) {
                // 服务器
                dashboard_info.chart_name = chart_name
            } else {
                dashboard_info.chart_name = mock_data.charts[0].chart_name
            }
            cy.contains('.ant-card-head-title', dashboard_info.chart_name)
                .parent('.ant-card')
                .children('.ant-card-actions')
                .get(`${dom_map.dashboard.edit}`)
        })
    })
})
