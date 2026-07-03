## Why

原生 GrapesJS 工作台目前只能开发 HTML 组件，无法复用项目中的 Vue SFC、props 和组件化开发体验。需要建立受控的 Vue block 注册形式，让开发者以 Vue 组件实现画布内容，同时保留 GrapesJS 的编辑和持久化能力。

## What Changes

- 新增类型安全的 Vue block 定义与静态注册表。
- 在 GrapesJS canvas iframe 内挂载仓库中的 Vue SFC。
- 将 GrapesJS traits 与 Vue props 同步，并序列化组件类型和属性。
- 在复制、删除、重新渲染和编辑器销毁时管理 Vue app 生命周期。
- 增加一个示例 Vue block 和组件开发说明。

非目标：

- 在线编辑或编译 SFC。
- 加载远程或用户提交的可执行组件代码。
- 深入修改 Vue 组件内部 DOM，或导出脱离 Vue 运行时的静态页面。

## Capabilities

### New Capabilities

- `vue-blocks`: Vue SFC 的定义、注册、画布渲染、属性同步、生命周期和持久化。

### Modified Capabilities

无。

## Impact

- 新增 Vue block 适配器、静态注册表和示例 SFC。
- GrapesJS 初始化通过 plugin 在项目加载前注册组件类型。
- 默认项目与 README 增加 Vue block 示例和开发约定。
