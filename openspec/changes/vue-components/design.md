## Context

`editor-ui` 已建立原生 GrapesJS 工作台和项目存储。GrapesJS component model 可序列化，但 Vue SFC 需要独立的运行时挂载与 props 更新机制，并且画布位于 iframe document 中。

## Goals / Non-Goals

**Goals:**

- 让仓库内 Vue SFC 以类型安全定义注册为 GrapesJS block。
- 保持 traits、Vue props 和项目 JSON 一致。
- 正确管理每个画布组件对应的 Vue app 生命周期。

**Non-Goals:**

- 执行远程代码、在线编译 SFC 或编辑组件源码。
- 让 Style Manager 修改 Vue 组件内部 DOM。
- 静态 HTML 导出。

## Decisions

### 静态定义与注册

每个 Vue block 定义唯一 type、Vue Component、默认 props、traits、分类和包装节点配置。单一静态注册表在 GrapesJS plugin 阶段注册全部 component types，保证项目数据解析前类型已存在。相比动态模块 URL，此方式由 Nuxt 构建链处理组件并避免执行不可信代码。

### ComponentView 挂载 Vue

自定义 GrapesJS view 在 `onRender` 中创建 iframe document 内的挂载节点，并使用 Vue `createApp` 渲染组件。根渲染函数读取响应式 props，以确保 model 更新触发 Vue 更新。`removed` 与再次渲染前均卸载旧 app。

### Traits 与 props

定义中的 props 作为 GrapesJS model 顶层字段保存，trait 使用 `changeProp: true`。view 监听每个 prop 的 model change 并写入响应式对象。这样 `getProjectData()` 自动持久化值，复制、撤销重做和刷新恢复均沿用 GrapesJS model 行为。

### 样式边界

GrapesJS Style Manager 只操作自定义 component 的外层元素。Vue SFC 自己管理内部结构和样式，业务视觉参数通过 traits 映射为 props。

### 未注册类型

项目恢复依赖静态注册表。组件被移除注册表时，GrapesJS 保留其序列化数据但无法恢复 Vue 视图；开发者必须先迁移已保存项目再删除定义。

## Risks / Trade-offs

- [每个 block 创建独立 Vue app] → 适合当前单页实验；大量实例时再评估共享 renderer。
- [Vue 内部 DOM 不受 GrapesJS 直接管理] → 明确包装节点与 props 的编辑边界。
- [组件定义改名导致旧项目失配] → type 作为持久化标识，发布后保持稳定。
- [画布重新渲染导致重复 app] → 每次挂载前卸载，并在 `removed` 中兜底。

## Migration Plan

1. 严格校验 change。
2. 实现注册适配器和示例组件。
3. 在编辑器初始化 plugin 中注册，并更新默认项目与文档。
4. 运行类型检查和生产构建。

## Open Questions

无。
