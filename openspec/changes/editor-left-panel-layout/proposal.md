## Why

现有左侧栏需要在页面、图层和区块之间提供清晰切换，同时保持 GrapesJS manager DOM 稳定。使用统一标签导航可在有限宽度内提供直接、紧凑的管理入口。

## What Changes

- 将左侧栏重构为“页面 / 组件”两个标签页，页面标签内依次展示页面管理和图层。
- 默认显示页面标签，用户一次查看一个管理面板。
- 页面标签接入 GrapesJS Pages API，支持列表、选择、新增、重命名和删除。
- 图层和区块分区继续承载原生 GrapesJS manager，切换分区不销毁 manager DOM。
- 使用 Naive UI Tabs 改善键盘操作、选中语义和视觉一致性。
- 默认提供容器、文本、链接、按钮、图片、视频和地图七个基础区块。
- 将右侧属性/样式面板合并到 `GrapesEditor.client.vue`，并统一使用 Naive UI Tabs 切换。
- 非目标：不修改画布布局，不提供页面拖拽排序。

## Capabilities

### New Capabilities

无。

### Modified Capabilities

- `editor-workbench`: 左侧工作台调整为包含静态页面入口、图层和组件的三标签布局。

## Impact

- 将左右 manager 面板布局与状态合并到 `GrapesEditor.client.vue`，减少仅服务于父组件的命令式组件边界。
- 新增 GrapesJS 配置工厂，隔离固定配置与 Vue 客户端生命周期。
- 新增页面管理 composable，隔离 Pages 状态、事件和操作逻辑。
- 继续使用现有 `@vicons/ionicons5` 依赖，不新增运行时依赖或后端接口。
