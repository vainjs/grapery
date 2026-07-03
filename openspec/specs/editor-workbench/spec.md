# editor-workbench Specification

## Purpose

定义 Grapery 编辑器工作台的客户端生命周期、基础内容编辑、命令操作、路由入口、错误反馈、组件职责和样式技术边界，确保 Nuxt、Vue 与 GrapesJS 的集成行为可验证且保持一致。

## Requirements

### Requirement: 客户端编辑器工作台

系统 SHALL 在 `/editor` 页面的客户端生命周期中初始化原生 GrapesJS，并显示由 Vue 布局承载的全屏编辑工作台。

#### Scenario: 浏览器打开编辑器页面

- **WHEN** 固定项目加载成功且编辑器容器可用
- **THEN** 系统显示左侧区块/图层、中间上方控制条、中间下方画布和右侧属性/样式区域

#### Scenario: 服务端渲染编辑器页面

- **WHEN** Nuxt 在服务端渲染 `/editor`
- **THEN** 系统不导入 GrapesJS 浏览器运行时且不访问 DOM

#### Scenario: 组件卸载

- **WHEN** 首页编辑器组件被卸载
- **THEN** 系统销毁 GrapesJS 实例和事件监听

### Requirement: 基础内容编辑

系统 SHALL 提供可拖入画布的基础 HTML 区块，并允许用户通过图层、属性和样式管理器编辑内容。

#### Scenario: 添加基础区块

- **WHEN** 用户从区块面板拖入文本或容器区块
- **THEN** 区块出现在画布和图层面板并可被选择编辑

### Requirement: 编辑命令

系统 SHALL 提供撤销、重做和桌面、平板、手机设备切换操作。

#### Scenario: 撤销编辑

- **WHEN** 用户执行可撤销编辑后点击撤销
- **THEN** 画布恢复到上一个项目状态

#### Scenario: 切换设备

- **WHEN** 用户选择不同设备
- **THEN** 画布使用对应设备宽度显示且不修改项目内容

### Requirement: 初始化失败反馈

系统 MUST 在项目加载或 GrapesJS 初始化失败时显示错误和重试操作。

#### Scenario: 项目加载失败

- **WHEN** 固定项目接口请求失败
- **THEN** 系统不创建空编辑器并允许用户重试

### Requirement: 独立编辑器路由

系统 SHALL 仅在 `/editor` 路径显示编辑器，并 MUST 在 `/` 提供独立入口页和跳转编辑器的操作且不自动重定向。

#### Scenario: 访问编辑器路径

- **WHEN** 用户访问 `/editor`
- **THEN** Nuxt 渲染 GrapesJS 编辑器页面

#### Scenario: 访问根路径

- **WHEN** 用户访问 `/`
- **THEN** Nuxt 渲染包含“进入编辑器”按钮的独立页面且不初始化 GrapesJS

#### Scenario: 从首页进入编辑器

- **WHEN** 用户点击首页的“进入编辑器”按钮
- **THEN** Nuxt 导航到 `/editor`

### Requirement: 工作台样式隔离

系统 SHALL 使用 Less 编写工作台样式，并 MUST 通过 CSS Modules 隔离组件局部类名。

#### Scenario: 构建工作台样式

- **WHEN** Nuxt 编译编辑器客户端组件
- **THEN** Less 被正确处理且模板引用模块化后的局部类名

#### Scenario: 加载 GrapesJS manager 样式

- **WHEN** GrapesJS 渲染运行时 manager DOM
- **THEN** 官方样式与必要主题覆盖通过全局 Less 生效

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
- **THEN** 左右 manager 面板和中间控制条由独立组件负责展示，画布及 GrapesJS 生命周期由父级客户端组件管理

#### Scenario: 工作台视觉层级

- **WHEN** 用户查看编辑器工作台
- **THEN** 画布作为主要视觉焦点，侧栏和控制条使用一致、简洁且可区分的表面层级
