## Context

`EditorLeftPanel` 当前用互斥单选按钮切换区块与图层，并通过 `getTargets()` 向 `GrapesEditor.client.vue` 暴露两个稳定的 DOM 节点。父组件在客户端 `onMounted` 初始化 GrapesJS，并将 Block Manager 和 Layer Manager 分别挂载到这两个节点。

新布局需要加入页面入口并改成紧凑标签导航，同时不能因切换标签而卸载 GrapesJS 已持有的 DOM。页面管理首版仅承担视觉占位，不参与项目数据流。

左右 manager 面板只被 `GrapesEditor.client.vue` 使用，且其 DOM 节点直接参与父组件内的 GrapesJS 初始化。实现时将这些布局合并回父组件，使初始化直接读取本地模板引用，避免通过 `defineExpose()` 建立不必要的命令式边界。

## Goals / Non-Goals

**Goals:**

- 使用组件库实现页面、组件双标签布局，并在页面标签内纵向组织页面管理和图层。
- 保持区块与图层 manager 的 DOM 引用和滚动状态稳定。
- 提供清晰的展开状态、键盘操作语义和统一图标。
- 保持父组件客户端初始化和失败反馈逻辑有效。

**Non-Goals:**

- 不提供页面拖拽排序。
- 不修改 GrapesJS 项目数据、存储接口、右侧栏交互或画布布局。

## Decisions

### 使用 Naive UI Tabs 表达管理面板

采用 `NTabs` 和两个 `NTabPane`，将当前值绑定到 `pages | blocks` 状态并默认选择页面。页面 pane 上部展示有限高度的页面管理列表，下部图层 manager 占据剩余空间。

标签导航避免折叠面板产生大面积空白，使窄侧栏保持稳定结构，并由组件库提供选中状态和键盘导航。

### manager 标签页使用 `display-directive="show"`

`NTabPane` 使用 `show` 指令控制内容可见性，使页面 pane 中的图层容器和组件容器在切换后仍保留于 DOM。父组件在 `nextTick` 后读取本地模板引用并传入 GrapesJS。

如果目标节点缺失，沿用父组件现有“编辑器容器尚未准备好”失败反馈并终止初始化，不创建部分 GrapesJS 实例。

由于 `show` 只保留至少激活过一次的 pane，客户端挂载时先依次激活包含 manager 的左右 pane，使四个挂载节点完成创建，再恢复默认页面和属性标签并初始化 GrapesJS。

GrapesJS 销毁实例时不保证清空通过 `appendTo` 注入的外部 DOM。每次重新初始化前，在确认四个 manager 挂载节点均有效后统一清空其子节点，避免重试或热更新后重复追加 manager。

Selector Manager 不使用与 Style Manager 相同目标的 `appendTo`，避免模块生命周期重复渲染；编辑器创建后将其视图显式插入样式挂载节点一次。

### 页面标签接入 GrapesJS Pages API

父组件从 `editor.Pages.getAll()` 建立轻量页面列表，并监听明确的 Pages 事件同步页面名称与选中状态。点击页面调用 `Pages.select()`；新增先调用 `Pages.add()` 再显式选择；重命名调用 `Page.setName()`；删除调用 `Pages.remove()`。

页面名称必须为非空白文本。系统至少保留一个页面，最后一个页面的删除操作禁用；删除当前页面后选择剩余第一页。新增和重命名使用 Naive UI 对话框，删除使用确认对话框，页面行通过更多菜单提供操作。

页面同步只监听 add、remove、select、update 明确事件，并通过微任务合并同一操作产生的连续事件，避免在 GrapesJS 同步 mutation 栈中反复更新 Vue 列表。新增页面先创建带稳定根节点的页面，再显式选择。

页面状态与操作封装在 `useGrapesPages` composable 中。composable 接收编辑器 ref，使用同步 watch 绑定或解绑 Pages 事件，并在作用域销毁时清理监听；工作台组件只负责渲染页面管理 UI。

GrapesJS Editor 和 Page 均为带内部状态的类实例，Vue 仅跟踪实例引用与页面数组替换，不递归代理实例内部对象。编辑器实例和页面列表使用浅层 ref，避免页面切换时破坏 GrapesJS Frame/View 对象链。

### 标题使用统一图标集

三个标题分别使用 `DocumentsOutline`、`LayersOutline` 和 `GridOutline`，通过 Naive UI `NIcon` 渲染。继续复用已安装的 `@vicons/ionicons5`，不新增依赖。

### 当前标签内容占满剩余高度

左侧栏保持纵向 Flex，标签导航维持紧凑高度，当前标签内容占据剩余空间。内容区和 GrapesJS manager 使用 `min-height: 0` 与内部滚动，避免侧栏整体溢出。局部布局样式继续使用 CSS Modules 与 Less。

### 右侧栏复用标签交互

右侧属性与样式面板同样使用 `NTabs` 和 `NTabPane`，当前值绑定到 `traits | styles` 状态。两个 pane 均使用 `display-directive="show"`，确保 GrapesJS Trait Manager 和 Style Manager 的挂载节点在切换后保持稳定。

Style Manager 参照常见设计工具的信息架构，将属性拆分为布局、尺寸、间距、定位、排版、背景、边框和效果八组。布局默认展开，其余分组默认收起；各组复用 GrapesJS 内建属性和控件，不维护额外样式状态。

### 使用配置工厂隔离固定 GrapesJS 配置

将 blocks、style sectors、devices 及固定编辑器选项放入独立配置工厂。工厂接收项目数据和五个 DOM 挂载节点，每次初始化返回新的 `EditorConfig`，避免共享配置对象被 GrapesJS 处理后影响重试初始化。Vue 生命周期、网络请求、状态和编辑器事件继续留在客户端组件。

默认区块统一归入“基础”分类。容器和按钮保留适合直接使用的初始 HTML 与样式，文本、链接、图片、视频和地图使用 GrapesJS 内置 component type，确保后续属性和行为沿用原生实现。

## Risks / Trade-offs

- [Naive UI Tabs 内部包装层可能限制 Flex 高度] → 通过公开的 pane class/style 属性建立 Flex 高度链，并将 GrapesJS manager 的滚动保持在稳定容器上。
- [Pages 事件与 Vue 列表状态可能失步] → 所有页面事件统一重新读取 `Pages.getAll()` 和 `Pages.getSelected()`，不在前端维护第二份页面模型。
- [收起后 GrapesJS manager 可能需要重新计算尺寸] → manager DOM 不卸载；重新展开后保留内容和状态，必要时由现有编辑器刷新机制处理视觉尺寸。
