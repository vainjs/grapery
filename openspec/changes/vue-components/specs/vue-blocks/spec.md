## ADDED Requirements

### Requirement: Vue block 静态注册

系统 SHALL 允许开发者通过仓库内静态定义注册 Vue SFC、默认 props、traits 和区块元数据。

#### Scenario: 注册 Vue block

- **WHEN** 编辑器初始化且静态注册表包含有效定义
- **THEN** GrapesJS 在项目数据加载前注册组件类型并在区块面板显示该 block

### Requirement: Vue 画布渲染

系统 SHALL 在 GrapesJS canvas 中挂载注册的 Vue SFC，并 MUST 在组件删除、重新渲染或编辑器销毁时卸载对应 Vue app。

#### Scenario: 拖入 Vue block

- **WHEN** 用户将 Vue block 拖入画布
- **THEN** 画布显示该 Vue 组件且外层节点仍可由 GrapesJS 选择

#### Scenario: 删除 Vue block

- **WHEN** 用户从项目中删除 Vue block
- **THEN** 系统卸载该 block 对应的 Vue app

### Requirement: Traits 与 props 同步

系统 SHALL 将定义的 GrapesJS traits 映射为 Vue props，并在 trait 值变化时更新 Vue 渲染。

#### Scenario: 修改组件属性

- **WHEN** 用户通过属性面板修改 Vue block trait
- **THEN** 对应 Vue prop 更新且画布立即重新渲染

### Requirement: Vue block 持久化

系统 SHALL 在 GrapesJS 项目数据中保存 Vue block 类型和 props，并在刷新后通过同一注册表恢复。

#### Scenario: 保存并恢复

- **WHEN** 用户修改 Vue block props、保存项目并刷新
- **THEN** 系统恢复相同组件类型、属性值和画布渲染

### Requirement: 组件代码安全边界

系统 MUST 只注册构建时包含在仓库中的 Vue 组件，不得执行用户提交或远程加载的组件代码。

#### Scenario: 组件来源

- **WHEN** 开发者扩展 Vue block 列表
- **THEN** 组件必须通过本地静态注册表和 Nuxt 构建链加入
