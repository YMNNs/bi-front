export const chart_types = [
    {
        type_id: 1,
        type_name: '折线图',
        description: '使用一条折线的线段显示数据在一个具有顺序性的维度上的变化',
        icon_type: 'icon-jibenzhexiantu',
        component: () => import('@/components/graph/plot'),
        yField: 'value',
        seriesField: 'category',
        prepare_data: (data, columns, number_keys, text_keys) => {
            console.log('计算图表数据')
            const _result = []
            const columns_number = columns.filter((i) => i.type === 'number')
            const all_category_value = new Set()
            const all_keys_text_value = new Set()
            data.forEach((i) => {
                number_keys.forEach((number) => {
                    const item = {}
                    item['value'] = i[number]
                    item['category'] = columns_number.find((_i) => _i.key === number).title
                    all_category_value.add(item['category']) // 添加到分类集合
                    item[text_keys[0]] = i[text_keys[0]] // 只有一个维度列，简化
                    all_keys_text_value.add(item[text_keys[0]]) // 添加到维度集合
                    _result.push(item)
                })
            })
            const result = []
            // 先遍历分类
            all_category_value.forEach((i) => {
                all_keys_text_value.forEach((j) => {
                    const _line = _result.filter((_res) => _res['category'] === i && _res[text_keys[0]] === j)
                    const line = {}
                    line[text_keys[0]] = j
                    line['category'] = i
                    line['value'] = _line.reduce((previousValue, currentValue) => {
                        return previousValue + currentValue['value']
                    }, 0)
                    result.push(line)
                })
            })
            return result
        },
        limit: {
            number: {
                max: 5,
                min: 1,
            },
            text: {
                max: 1,
                min: 1,
            },
        },
    },
    {
        type_id: 2,
        type_name: '柱状图',
        description: '使用柱形显示维度的数值。横轴显示分类维度，纵轴显示相应的值',
        icon_type: 'icon-duoxilieezhuzhuangtu',
        component: () => import('@/components/graph/column'),
        yField: 'value',
        seriesField: 'category',
        prepare_data: (data, columns, number_keys, text_keys) => {
            console.log('计算图表数据')
            const _result = []
            const columns_number = columns.filter((i) => i.type === 'number')
            const all_category_value = new Set()
            const all_keys_text_value = new Set()
            data.forEach((i) => {
                number_keys.forEach((number) => {
                    const item = {}
                    item['value'] = i[number]
                    item['category'] = columns_number.find((_i) => _i.key === number).title
                    all_category_value.add(item['category']) // 添加到分类集合
                    item[text_keys[0]] = i[text_keys[0]] // 只有一个维度列，简化
                    all_keys_text_value.add(item[text_keys[0]]) // 添加到维度集合
                    _result.push(item)
                })
            })
            const result = []
            // 先遍历分类
            all_category_value.forEach((i) => {
                all_keys_text_value.forEach((j) => {
                    const _line = _result.filter((_res) => _res['category'] === i && _res[text_keys[0]] === j)
                    const line = {}
                    line[text_keys[0]] = j
                    line['category'] = i
                    line['value'] = _line.reduce((previousValue, currentValue) => {
                        return previousValue + currentValue['value']
                    }, 0)
                    result.push(line)
                })
            })
            return result
        },
        limit: {
            number: {
                max: 5,
                min: 1,
            },
            text: {
                max: 1,
                min: 1,
            },
        },
    },
    {
        type_id: 3,
        type_name: '条形图',
        description: '使用柱形显示维度的数值。纵轴显示分类维度，横轴显示相应的值',
        icon_type: 'icon-duidietiaoxingtu',
        component: () => import('@/components/graph/bar'),
        yField: 'value',
        seriesField: 'category',
        prepare_data: (data, columns, number_keys, text_keys) => {
            console.log('计算图表数据')
            const _result = []
            const columns_number = columns.filter((i) => i.type === 'number')
            const all_category_value = new Set()
            const all_keys_text_value = new Set()
            data.forEach((i) => {
                number_keys.forEach((number) => {
                    const item = {}
                    item['value'] = i[number]
                    item['category'] = columns_number.find((_i) => _i.key === number).title
                    all_category_value.add(item['category']) // 添加到分类集合
                    item[text_keys[0]] = i[text_keys[0]] // 只有一个维度列，简化
                    all_keys_text_value.add(item[text_keys[0]]) // 添加到维度集合
                    _result.push(item)
                })
            })
            const result = []
            // 先遍历分类
            all_category_value.forEach((i) => {
                all_keys_text_value.forEach((j) => {
                    const _line = _result.filter((_res) => _res['category'] === i && _res[text_keys[0]] === j)
                    const line = {}
                    line[text_keys[0]] = j
                    line['category'] = i
                    line['value'] = _line.reduce((previousValue, currentValue) => {
                        return previousValue + currentValue['value']
                    }, 0)
                    result.push(line)
                })
            })
            return result
        },
        limit: {
            number: {
                max: 5,
                min: 1,
            },
            text: {
                max: 1,
                min: 1,
            },
        },
    },
    {
        type_id: 4,
        type_name: '面积图',
        description: '使用带填充区域的线段显示数据在一个具有顺序性的维度上的变化',
        icon_type: 'icon-duidiemianjitu',
        component: () => import('@/components/graph/area'),
        yField: 'value',
        seriesField: 'category',
        prepare_data: (data, columns, number_keys, text_keys) => {
            console.log('计算图表数据')
            const _result = []
            const columns_number = columns.filter((i) => i.type === 'number')
            const all_category_value = new Set()
            const all_keys_text_value = new Set()
            data.forEach((i) => {
                number_keys.forEach((number) => {
                    const item = {}
                    item['value'] = i[number]
                    item['category'] = columns_number.find((_i) => _i.key === number).title
                    all_category_value.add(item['category']) // 添加到分类集合
                    item[text_keys[0]] = i[text_keys[0]] // 只有一个维度列，简化
                    all_keys_text_value.add(item[text_keys[0]]) // 添加到维度集合
                    _result.push(item)
                })
            })
            const result = []
            // 先遍历分类
            all_category_value.forEach((i) => {
                all_keys_text_value.forEach((j) => {
                    const _line = _result.filter((_res) => _res['category'] === i && _res[text_keys[0]] === j)
                    const line = {}
                    line[text_keys[0]] = j
                    line['category'] = i
                    line['value'] = _line.reduce((previousValue, currentValue) => {
                        return previousValue + currentValue['value']
                    }, 0)
                    result.push(line)
                })
            })
            return result
        },
        limit: {
            number: {
                max: 5,
                min: 1,
            },
            text: {
                max: 1,
                min: 1,
            },
        },
    },
    {
        type_id: 5,
        type_name: '饼图',
        description: '通过扇形区块的颜色和弧长（角度、面积）来展现数据的分类和占比情况',
        icon_type: 'icon-bingtu',
        component: () => import('@/components/graph/pie'),
        yField: 'value',
        seriesField: 'category',
        prepare_data: (data, columns, number_keys, text_keys) => {
            console.log('计算图表数据')
            const _result = []
            const columns_number = columns.filter((i) => i.type === 'number')
            const all_category_value = new Set()
            const all_keys_text_value = new Set()
            data.forEach((i) => {
                number_keys.forEach((number) => {
                    const item = {}
                    item['value'] = i[number]
                    item['category'] = columns_number.find((_i) => _i.key === number).title
                    all_category_value.add(item['category']) // 添加到分类集合
                    item[text_keys[0]] = i[text_keys[0]] // 只有一个维度列，简化
                    all_keys_text_value.add(item[text_keys[0]]) // 添加到维度集合
                    _result.push(item)
                })
            })
            const result = []
            // 先遍历分类
            all_category_value.forEach((i) => {
                all_keys_text_value.forEach((j) => {
                    const _line = _result.filter((_res) => _res['category'] === i && _res[text_keys[0]] === j)
                    const line = {}
                    line[text_keys[0]] = j
                    line['category'] = i
                    line['value'] = _line.reduce((previousValue, currentValue) => {
                        return previousValue + currentValue['value']
                    }, 0)
                    result.push(line)
                })
            })
            return result
        },
        limit: {
            number: {
                max: 1,
                min: 1,
            },
            text: {
                max: 1,
                min: 1,
            },
        },
    },
    {
        type_id: 6,
        type_name: '散点图',
        description: '将所有的数据以不同颜色的点的形式展现在平面直角坐标系上',
        icon_type: 'icon-sandiantu',
        component: () => import('@/components/graph/scatter'),
        yField: 'value',
        seriesField: 'category',
        prepare_data: (data, columns, number_keys, text_keys) => {
            console.log('计算图表数据')
            const _result = []
            const columns_number = columns.filter((i) => i.type === 'number')
            const all_category_value = new Set()
            const all_keys_text_value = new Set()
            data.forEach((i) => {
                number_keys.forEach((number) => {
                    const item = {}
                    item['value'] = i[number]
                    item['category'] = columns_number.find((_i) => _i.key === number).title
                    all_category_value.add(item['category']) // 添加到分类集合
                    item[text_keys[0]] = i[text_keys[0]] // 只有一个维度列，简化
                    all_keys_text_value.add(item[text_keys[0]]) // 添加到维度集合
                    _result.push(item)
                })
            })
            const result = []
            // 先遍历分类
            all_category_value.forEach((i) => {
                all_keys_text_value.forEach((j) => {
                    const _line = _result.filter((_res) => _res['category'] === i && _res[text_keys[0]] === j)
                    const line = {}
                    line[text_keys[0]] = j
                    line['category'] = i
                    line['value'] = _line.reduce((previousValue, currentValue) => {
                        return previousValue + currentValue['value']
                    }, 0)
                    result.push(line)
                })
            })
            return result
        },
        limit: {
            number: {
                max: 2,
                min: 2,
            },
            text: {
                max: 1,
                min: 1,
            },
        },
    },
    {
        type_id: 7,
        type_name: '雷达图',
        description: '将不同系列的多个维度的数据量映射到坐标轴上',
        icon_type: 'icon-leidatu',
        component: () => import('@/components/graph/radar'),
        yField: 'value',
        seriesField: 'category',
        prepare_data: (data, columns, number_keys, text_keys) => {
            console.log('计算图表数据')
            const _result = []
            const columns_number = columns.filter((i) => i.type === 'number')
            const all_category_value = new Set()
            const all_keys_text_value = new Set()
            data.forEach((i) => {
                number_keys.forEach((number) => {
                    const item = {}
                    item['value'] = i[number]
                    item['category'] = columns_number.find((_i) => _i.key === number).title
                    all_category_value.add(item['category']) // 添加到分类集合
                    item[text_keys[0]] = i[text_keys[0]] // 只有一个维度列，简化
                    all_keys_text_value.add(item[text_keys[0]]) // 添加到维度集合
                    _result.push(item)
                })
            })
            const result = []
            // 先遍历分类
            all_category_value.forEach((i) => {
                all_keys_text_value.forEach((j) => {
                    const _line = _result.filter((_res) => _res['category'] === i && _res[text_keys[0]] === j)
                    const line = {}
                    line[text_keys[0]] = j
                    line['category'] = i
                    line['value'] = _line.reduce((previousValue, currentValue) => {
                        return previousValue + currentValue['value']
                    }, 0)
                    result.push(line)
                })
            })
            return result
        },
        limit: {
            number: {
                max: 5,
                min: 1,
            },
            text: {
                max: 1,
                min: 1,
            },
        },
    },
]
