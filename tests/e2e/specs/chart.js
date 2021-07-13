import { chart_name, chart_name_long, data_name, dom_map, mock_data } from '../constant/test_info'

describe('新建图表：正确路径', () => {
    it('新建图表', function () {
        cy.login()
        cy.visit('/new_chart')
        cy.get(`#${dom_map.new_chart.name}`).clear().type(chart_name).should('have.value', chart_name).blur()
        cy.url().then((el) => {
            const chart_info = {}
            if (el.indexOf('develop') > 0) {
                // 服务器
                chart_info.data_name = data_name
            } else {
                chart_info.data_name = mock_data.tables[0].name
            }
            cy.get(`#${dom_map.new_chart.data}`).click()
            cy.contains(chart_info.data_name).click()
            cy.get(`#${dom_map.new_chart.chart_type}`).click()
            cy.contains('折线图').click()
            cy.get(`#${dom_map.new_chart.submit}`).click()
            cy.contains('成功', { timeout: 2000 })
        })
    })
})

describe('新建图表：错误处理', () => {
    it('图表名称过长', function () {
        cy.login()
        cy.visit('/new_chart')
        cy.get(`#${dom_map.new_chart.name}`).clear().type(chart_name_long).should('have.value', chart_name_long).blur()
        cy.contains('图表名称长度上限为 128 字符', { timeout: 2000 })
    })
    it('缺少必填项', function () {
        cy.login()
        cy.visit('/new_chart')
        cy.get(`#${dom_map.new_chart.submit}`).click()
        cy.contains('请', { timeout: 2000 })
    })
})

describe('查看图表', () => {
    it('搜索图表', function () {
        cy.login()
        cy.visit('/chart_management')
        cy.url().then((el) => {
            const chart_info = {}
            if (el.indexOf('develop') > 0) {
                // 服务器
                chart_info.name = chart_name
            } else {
                chart_info.name = mock_data.charts[0].chart_name
            }
            cy.get(`#${dom_map.chart_management.search}`)
                .clear()
                .type(chart_info.name + '\n')
            cy.contains(chart_info.name, { timeout: 2000 })
            cy.contains('已过滤')
            // 清除过滤器
            cy.get('.anticon-close').click()
            cy.contains('已过滤').should('not.exist')
        })
    })
})

describe('编辑图表：正确路径', () => {
    it('编辑图表', function () {
        cy.login()
        cy.visit('/chart_management')
        cy.url().then((el) => {
            const chart_info = {}
            if (el.indexOf('develop') > 0) {
                // 服务器
                chart_info.name = chart_name
            } else {
                chart_info.name = mock_data.charts[0].chart_name
            }
            cy.contains(chart_info.name).click()
            cy.contains('编辑图表')
            // 取消勾选
            cy.get('.ant-tree-checkbox-checked').each((i) => {
                cy.get(i).click()
            })
            // 勾选第一个维度和第一个指标
            cy.get('.ant-tree').each((i) => {
                cy.get(i).children().first().children('.ant-tree-checkbox').click()
            })
            // 更改图表类型
            cy.get(`#${dom_map.edit_chart.chart_type_prefix}2`).click()
            cy.contains('图表无法预览').should('not.exist')
            cy.get(`#${dom_map.edit_chart.submit}`).click()
            cy.contains('您确定要继续吗')
            // 确认对话框
            cy.get('.ant-modal-confirm-btns').children('.ant-btn-primary').click()
            cy.contains('成功')
        })
    })
})
