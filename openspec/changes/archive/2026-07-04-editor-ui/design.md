## Context

当前首页直接创建封装式编辑器，公共 runtime config 包含不再需要的授权字段，固定项目 API 也沿用旧命名。目标是以原生 GrapesJS 作为编辑内核，由 Vue 管理工作台布局和保存状态，同时保持 Nuxt SSR 边界与单机 JSON 存储实验。

## Goals / Non-Goals

**Goals:**

- 建立原生 GrapesJS 的全屏单页编辑工作台。
- 支持基础 HTML 区块、图层、属性、样式、设备和历史命令。
- 在客户端加载固定项目并由用户手动保存。
- 从当前工作树清除旧编辑器实现痕迹。

**Non-Goals:**

- Vue 组件区块、在线组件编译、静态导出、发布或多人协作。
- 多项目或生产级数据持久化。

## Decisions

### Vue 工作台承载 GrapesJS managers

编辑器客户端组件负责布局与状态，GrapesJS 使用 `panels.defaults: []` 关闭默认工具栏。工作台主结构为左、中、右三列：左侧承载 Block/Layer managers，右侧承载 Trait/Style/Selector managers，中间列再分为上方控制条和下方画布。各 manager 通过 `appendTo` 挂载到 Vue 模板中的固定容器。相比重写所有 manager UI，此方式保留 GrapesJS 的成熟交互，同时让工作台布局和工具栏保持可控。

左右区域分别实现为 manager 面板组件，通过只读 DOM getter 向父组件暴露 GrapesJS 挂载点。中间区域的控制条抽为纯展示组件，仅通过 props/emits 交换状态；画布容器及加载反馈保留在父级客户端组件，使 GrapesJS 画布 DOM、初始化和销毁由同一组件持有。父级继续独占 SDK 初始化、保存、设备和历史命令，避免第三方实例生命周期分散。

### 客户端生命周期

组件使用 `.client.vue` 并在 `onMounted` 中动态导入 GrapesJS，确保服务端构建不执行浏览器代码。初始化前先请求项目；成功后保存 editor 实例，`onBeforeUnmount` 调用 `destroy()`。初始化或加载失败由组件显示错误状态。

### 编辑器路由

根应用只承载 `<NuxtPage>`。`/editor` 页面挂载客户端编辑器，`/` 使用独立的最小入口页并提供跳转 `/editor` 的单一主按钮，不自动重定向。这样编辑器生命周期仅在访问编辑器路由时启动，并为后续扩展产品首页保留稳定路径。

### 数据流与保存状态

GET `/api/projects/default` 返回 `{ project, updatedAt }`，其中 `project` 为 GrapesJS `ProjectData`。编辑事件将状态置为 `dirty`；保存按钮提交 `{ project: editor.getProjectData() }`。保存期间禁止重复提交，成功后置为 `saved`，失败后恢复 `dirty` 并显示错误，不把失败伪装成成功。

### 项目格式

服务端仍执行对象级校验和原子写入，不依赖浏览器包的运行时类型。默认项目使用 GrapesJS pages/components/styles 结构。旧格式数据不提供专门迁移；若 GrapesJS 无法加载，客户端显示错误且不覆盖文件。

### 清理策略

删除旧 change 和旧编辑器专用文件；重命名仍有价值的服务端类型和首页组件。README、AGENTS.md 与 OpenSpec 配置只描述当前架构。Git 历史与 `.data` 用户文件不改写。

### Less 与 CSS Modules

工作台组件使用 `<style module lang="less">`，模板通过 `$style` 引用局部类名，避免组件样式依赖全局命名约定。页面 reset、GrapesJS 官方 CSS 和 GrapesJS 运行时生成类名的主题覆盖保留在全局 `main.less`；第三方运行时类名无法通过 CSS Modules 映射，将其强行模块化会导致 manager 样式失效。

### Tailwind CSS

Tailwind CSS 通过官方 `@tailwindcss/vite` 插件接入 Nuxt，并使用独立的全局 CSS 入口导入。该入口排在 `main.less` 之前，使 GrapesJS 官方样式和项目主题覆盖保持最终优先级。现有工作台继续使用 Less CSS Modules，Tailwind 作为后续页面和组件开发的 utility 能力，不在本 change 中重写现有样式。

工作台采用 slate-50、slate-100 与 slate-200 分层表面、深色正文和靛蓝主操作色的柔和亮色主题，纯白仅用于激活控件和画布内容，避免连续大面积白色。模板的基础布局、间距、颜色、响应式规则和交互状态使用 Tailwind utilities 表达，减少组件内重复样式。CSS Modules 与 Less 仅保留 Tailwind 不适合表达的属性状态选择器和 keyframes，并继续作为复杂局部样式的扩展边界。图标按钮提供可访问名称、明显焦点环和至少 40 像素的桌面工具栏点击区域；加载动画尊重 reduced motion。

视觉优化遵循克制的专业工具风格：左右侧栏与中间控制条使用一致的 56 像素顶部节奏，减少阴影、嵌套底色和重复边框；画布通过留白、单层边框和轻微阴影成为主要视觉焦点。圆角统一为 8 像素交互控件与 12 像素画布容器，靛蓝只用于主操作、选中和焦点状态。首页保持单一入口，不扩展营销内容。

## Risks / Trade-offs

- [GrapesJS manager DOM 不是 Vue 组件] → Vue 只负责稳定容器与工作台状态，manager 内部交互交给 GrapesJS。
- [初始化期间项目请求失败] → 显示可重试错误视图，禁止创建空编辑器覆盖已有数据。
- [旧本地项目格式不兼容] → 明确报错并保留原文件，由开发者自行备份或清除。
- [Nuxt nightly 与 GrapesJS 类型存在差异] → 使用客户端动态导入，并以类型检查和生产构建作为门槛。
- [CSS Modules 改写类名后动态状态选择器失效] → 状态类同样通过 `$style` 绑定，属性状态继续使用 `data-*`。
- [Tailwind Preflight 影响 GrapesJS 运行时 DOM] → Tailwind 入口先加载，GrapesJS 官方 CSS 和项目主题随后覆盖。
- [长 utility class 降低模板可读性] → 按工作台区域分行组织，只有重复或复杂选择器保留在 CSS Module。
- [过度简化导致操作层级不清] → 保留选中、悬停、焦点和保存状态的文字与颜色反馈。
- [拆分后 manager DOM 挂载点尚未准备] → 父组件在挂载和 nextTick 后通过左右组件 getter 解析容器，缺失时进入明确错误状态。

## Migration Plan

1. 创建并严格校验 change。
2. 替换依赖、配置、编辑器和项目数据命名。
3. 更新存储、文档和协作约束。
4. 运行测试、类型检查、构建和仓库残留搜索。

## Open Questions

无。
