# AGENTS.md

## 项目

Grapery：Vue 3、Nuxt 5 nightly 与原生 GrapesJS 集成实验，包含单页编辑器、Vue SFC 画布区块及 Nuxt API 本地 JSON 存储。

## OpenSpec

- 功能或行为变更须纳入 OpenSpec：优先更新相关 change；新建 change 前询问用户。
- 小型样式、文案及不影响行为的实现调整跳过 OpenSpec。
- 仅读取当前任务相关的 change 文件；不读取其他 change 或主 specs。
- 当前线程已读取且未变化的规格不重复读取。
- 实施前执行 `rtk openspec validate <change> --strict`；实施后逐项更新 tasks。

## Skills

- 此项目不使用 `superpowers:*`。
- 前端视觉设计或重构使用 `design-taste-frontend`，不使用 `ui-ux-pro-max`。

## 工程

- 使用 pnpm、TypeScript、Vue Composition API 和 `<script setup>`。
- 遵循 Nuxt 自动导入：Vue API、Nuxt/项目 composables 及已配置组件库组件不显式导入；其他第三方模块正常导入。
- 类型声明用 `type`，不用 `interface`。
- 组件局部样式使用 CSS Modules 与 Less；reset 和第三方运行时样式使用全局 Less。
- 布局优先 Tailwind Flex；仅二维布局使用 Grid。
- 不添加无布局、样式、状态或脚本用途的类名。
- 默认仅实现桌面端；用户明确要求时再适配移动端。

## 运行与验证

- 默认不运行验证；仅在用户明确要求时执行 `rtk pnpm typecheck` 和 `rtk pnpm build`。
- 假定 dev server 已由用户启动；不启动、重启或替换，需要确认时仅只读检查。
