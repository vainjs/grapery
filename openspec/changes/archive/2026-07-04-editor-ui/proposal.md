## Why

当前首页依赖封装式编辑器，无法直接控制工作台结构，也不符合项目转向原生 GrapesJS 的目标。需要先建立原生 GrapesJS 的编辑、保存和恢复闭环，作为后续 Vue 组件区块集成的稳定基础。

## What Changes

- **BREAKING**：移除原有封装式编辑器依赖、公开授权配置及其专用代码、样式、命名和文档。
- 使用原生 GrapesJS 在客户端初始化单页网站编辑器。
- 使用 Vue 构建包含工具栏、区块、图层、画布、属性和样式面板的编辑器工作台。
- 提供桌面、平板和手机画布切换，以及撤销和重做操作。
- 将现有固定项目 API 改造为读取和保存 GrapesJS 项目数据，并提供明确的保存状态。
- 清理旧 MVP OpenSpec artifacts 和不再使用的实现。

非目标：

- Vue SFC 作为 GrapesJS 区块运行；该能力由后续 `vue-components` change 定义。
- 多项目、认证、协作、发布、静态导出或生产级存储。
- 复刻任何商业编辑器的像素级界面。

## Capabilities

### New Capabilities

- `editor-workbench`: 原生 GrapesJS 工作台的布局、编辑命令、设备切换与客户端生命周期。
- `project-storage`: 固定 GrapesJS 项目的加载、手动保存、状态反馈与本地 JSON 持久化。
- `project-guidance`: 当前架构、开发约束与两个 change 的实施顺序。

### Modified Capabilities

无。

## Impact

- 编辑器依赖切换为 `grapesjs`。
- 首页编辑器组件、全局样式、Nuxt runtime config、固定项目 API 数据类型和默认项目将调整。
- README、AGENTS.md、OpenSpec 配置和旧 change 将清理或重写。
