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

describe('编辑仪表盘', () => {
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

    it('编辑仪表', function () {
        cy.login()
        cy.visit('/dashboard')
        cy.get(`#${dom_map.dashboard.edit}`).click()
        cy.url().then((el) => {
            const dashboard_info = {}
            if (el.indexOf('develop') > 0) {
                // 服务器
                dashboard_info.chart_name = chart_name
            } else {
                dashboard_info.chart_name = mock_data.charts.find((i) => i.id === 2).chart_name
            }
            // 删除再恢复
            cy.contains('.ant-card-head-title', dashboard_info.chart_name)
                .parents('.ant-card')
                .children('.ant-card-actions')
                .find(`#${dom_map.dashboard.delete}`)
                .click()
            cy.contains('确 定').click()
            cy.contains('.ant-card-head-title', dashboard_info.chart_name).should('not.exist')
            cy.get(`#${dom_map.dashboard.reset}`).click()
            // 进入编辑
            cy.contains('.ant-card-head-title', dashboard_info.chart_name)
                .parents('.ant-card')
                .children('.ant-card-actions')
                .find(`#${dom_map.dashboard.edit_instrument}`)
                .click()
            // 勾选并清空筛选值
            cy.get(`#${dom_map.dashboard.filter_checkbox}`).click()
            cy.get('.ant-select-selection-overflow')
                .children()
                .find('.ant-select-selection-item-remove')
                .each((i) => {
                    cy.get(i).click()
                })
            cy.get('.ant-checkbox-checked').should('not.exist')
            cy.get(`#${dom_map.dashboard.filter_checkbox}`).click()
            // 只删除一个筛选值
            cy.get('.ant-select-selection-overflow').children().get('.ant-select-selection-item-remove').first().click()
            cy.get('.ant-checkbox-checked').should('exist')
            cy.get(`#${dom_map.dashboard.finish_edit_chart}`).click()
            cy.get(`#${dom_map.dashboard.finish_edit_dashboard}`).click()
            // 保存编辑
            cy.contains('成功')
        })
    })
})
