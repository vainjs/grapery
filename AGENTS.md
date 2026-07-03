# AGENTS.md

## 项目定位

Grapery 是 Vue 3、Nuxt 5 nightly 与原生 GrapesJS 的集成实验，范围包括单页编辑器、Vue SFC 画布区块和 Nuxt API 本地 JSON 存储。

## 规格来源

- 功能或行为变更必须纳入 OpenSpec；默认更新当前相关 change，不另建 change，创建 change 前需询问。
- 实施前运行 `rtk openspec validate <change> --strict`，实施后逐项更新 tasks。
- 默认不主动使用 `superpowers:*` skills；仅在用户明确要求时使用。

## 工程约定

- 使用 pnpm；所有 shell 命令添加 `rtk` 前缀。
- 使用 TypeScript、Vue Composition API 和 `<script setup>`。
- 类型声明使用 `type`，不使用 `interface`。
- 组件局部样式使用 CSS Modules 与 Less；reset 和第三方运行时样式使用全局 Less。
- 布局优先使用 Tailwind Flex；仅在明确的二维布局中使用 Grid。
- 不添加无实际布局、样式、状态或脚本用途的类名。

## 实现与验证

- 默认不运行验证；仅在用户明确要求时运行 `rtk pnpm typecheck` 和 `rtk pnpm build`。
