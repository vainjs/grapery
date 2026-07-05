## MODIFIED Requirements

### Requirement: 客户端编辑器工作台

系统 SHALL 在 `/editor` 页面的客户端生命周期中初始化原生 GrapesJS，并显示由 Vue 布局承载的全屏编辑工作台。

#### Scenario: 浏览器打开编辑器页面

- **WHEN** 固定项目加载成功且编辑器容器可用
- **THEN** 系统显示左侧页面/图层/区块分区、中间上方控制条、中间下方画布和右侧属性/样式区域

#### Scenario: 服务端渲染编辑器页面

- **WHEN** Nuxt 在服务端渲染 `/editor`
- **THEN** 系统不导入 GrapesJS 浏览器运行时且不访问 DOM

#### Scenario: 组件卸载

- **WHEN** 首页编辑器组件被卸载
- **THEN** 系统销毁 GrapesJS 实例和事件监听

### Requirement: Tailwind CSS 工具类

系统 SHALL 通过 Tailwind CSS 官方 Vite 插件为 Nuxt 模板提供 utility classes。

#### Scenario: 编译 Tailwind utility

- **WHEN** Vue 模板使用 Tailwind utility class
- **THEN** 生产构建生成对应样式且无需浏览器运行时

#### Scenario: 与现有样式共存

- **WHEN** 应用同时加载 Tailwind、全局 Less 和组件 CSS Modules
- **THEN** GrapesJS 官方样式及项目主题覆盖保持生效

#### Scenario: 工作台使用 utility classes

- **WHEN** Nuxt 编译编辑器工作台模板
- **THEN** 分层浅灰亮色主题的基础布局、视觉和交互状态由 Tailwind utilities 生成，局部复杂规则继续由 CSS Modules 隔离

#### Scenario: 键盘操作工具栏

- **WHEN** 用户通过键盘聚焦工作台按钮
- **THEN** 按钮显示清晰焦点状态且图标按钮具有可访问名称

#### Scenario: 工作台三栏布局

- **WHEN** 编辑器工作台完成渲染
- **THEN** 左右面板贯穿工作台高度且控制条只位于中间画布区域上方

#### Scenario: 工作台组件边界

- **WHEN** Vue 渲染编辑器工作台
- **THEN** 左右 manager 面板、画布及 GrapesJS 生命周期由父级客户端组件管理，中间控制条由独立组件负责展示

#### Scenario: 工作台视觉层级

- **WHEN** 用户查看编辑器工作台
- **THEN** 画布作为主要视觉焦点，侧栏和控制条使用一致、简洁且可区分的表面层级

### Requirement: 基础内容编辑

系统 SHALL 提供可拖入画布的容器、文本、链接、按钮、图片、视频和地图区块，并允许用户通过图层、属性和样式管理器编辑内容。

#### Scenario: 添加基础区块

- **WHEN** 用户从区块面板拖入任一基础区块
- **THEN** 对应 GrapesJS 组件出现在画布和图层面板并可被选择编辑

## ADDED Requirements

### Requirement: 左侧管理分区

系统 SHALL 使用页面和组件标签组织编辑器左侧管理内容，页面标签内 SHALL 依次展示页面管理和图层，并 MUST 在标签切换时保留 GrapesJS manager DOM。

#### Scenario: 默认显示页面标签

- **WHEN** 编辑器左侧栏首次渲染
- **THEN** 页面标签默认选中并先显示项目真实页面列表和当前页面状态，再显示图层 manager

#### Scenario: 切换管理标签

- **WHEN** 用户选择页面或组件标签
- **THEN** 系统显示目标管理面板并隐藏其他管理面板

#### Scenario: 保留 manager 内容

- **WHEN** 用户在页面与组件标签之间反复切换
- **THEN** GrapesJS 图层和组件 manager 的 DOM、内容及滚动容器保持挂载

#### Scenario: 重新初始化编辑器

- **WHEN** 系统销毁并重新创建 GrapesJS 实例
- **THEN** 系统清理外部 manager 挂载节点且每个 manager 仅渲染一份内容

#### Scenario: 键盘操作分区

- **WHEN** 用户使用键盘聚焦并操作标签
- **THEN** 系统显示清晰焦点状态并正确更新当前标签

### Requirement: 页面管理

系统 SHALL 通过 GrapesJS Pages API 提供页面列表、选择、新增、重命名和删除操作，并 MUST 将页面变更纳入项目保存数据。

#### Scenario: 选择页面

- **WHEN** 用户点击页面列表中的页面
- **THEN** 系统选择该 GrapesJS 页面并在画布显示其内容

#### Scenario: 新增页面

- **WHEN** 用户输入非空页面名称并确认新增
- **THEN** 系统创建空白页面并自动选择该页面

#### Scenario: 重命名页面

- **WHEN** 用户为已有页面输入非空名称并确认
- **THEN** 系统更新页面名称且保持页面内容不变

#### Scenario: 删除当前页面

- **WHEN** 项目存在多个页面且用户确认删除当前页面
- **THEN** 系统删除该页面并自动选择剩余第一页

#### Scenario: 保护最后页面

- **WHEN** 项目只剩一个页面
- **THEN** 系统禁用该页面的删除操作

#### Scenario: 页面名称校验

- **WHEN** 用户提交空白页面名称
- **THEN** 系统阻止提交并显示名称必填反馈

### Requirement: 右侧管理标签

系统 SHALL 使用属性和样式标签组织编辑器右侧管理内容，并 MUST 在标签切换时保留 GrapesJS manager DOM。

#### Scenario: 默认显示属性标签

- **WHEN** 编辑器右侧栏首次渲染
- **THEN** 属性标签默认选中并显示属性 manager

#### Scenario: 切换右侧标签

- **WHEN** 用户在属性和样式标签之间切换
- **THEN** 系统显示目标 manager 且两个 manager 的 DOM 保持挂载

#### Scenario: 样式属性分类

- **WHEN** 用户打开样式标签
- **THEN** 系统按布局、尺寸、间距、定位、排版、背景、边框和效果分类显示可编辑属性
