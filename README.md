# bi-front

## 项目简介

一个基于 Vue.js, Antd, AntV 在线绘图前端。

特点：

- 完善的用户登录模块
- 动态路由
- 可上传数据并选择绘图维度和指标
- 自动化测试和部署 (GitLab CI)
- 支持 7 种图表（可扩展）
- 多环境变量

## 安装项目

```
npm install
```

> 如果提示安装失败，请运行`npm install -force`

### 运行测试服务器，采用`.env`中定义的设置

```
npm run serve
```

### 编译并采用`.env.develop`中定义的设置

```
npm run build-develop
```

### 编译并采用`.env.master`中定义的设置

```
npm run build-master
```

### 运行端到端测试

```
npm run test:e2e
```

### 附注

环境配置文件简介

```dotenv
NODE_ENV=production
VUE_APP_ENV=master
VUE_APP_TITLE=数据分析平台
VUE_APP_API_BASE_URL=http://bi.stager.top:8080/api/
VUE_APP_SHOW_ERROR=false
VUE_APP_MOCK=false
VUE_APP_LOG_LEVEL=1
```

|名称|值|备注|
|---|---|---|
|`NODE_ENV`| `production / development` |Node 环境变量名称|
|`VUE_APP_ENV`| `master / develop` |Vue 环境变量名称|
|`VUE_APP_TITLE`| `<string>` |项目名称|
|`VUE_APP_API_BASE_URL`| `<string>` |后端 URL|
|`VUE_APP_SHOW_ERROR`| `<boolean>` |显示未知错误信息|
|`VUE_APP_MOCK`| `<boolean>` |启用 Mock 数据|
|`VUE_APP_LOG_LEVEL`| `<int>` |日志等级，参见 `src/util/logger.js`|
