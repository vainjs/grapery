# Grapery

Grapery 是一个用于探索 Vue 3、Nuxt 5 nightly 与原生 [GrapesJS](https://grapesjs.com/) 工程化集成的实验项目。

`/editor` 提供由 Vue 布局承载的 GrapesJS 网站编辑器，包含区块、图层、属性、样式、设备切换、撤销重做，以及固定项目的本地 JSON 保存能力。根路径 `/` 提供进入编辑器的入口页面。

## 技术栈

- Vue 3、Composition API 与 TypeScript
- Nuxt 5 nightly / Nitro
- GrapesJS
- Tailwind CSS、Less 与 Vue CSS Modules
- OpenSpec
- pnpm

## 当前能力

- `/editor` 全屏 GrapesJS 编辑工作台
- 客户端挂载与 SSR 隔离
- HTML 区块、图层、属性和样式编辑
- 桌面、平板和手机画布
- 手动保存及保存状态
- `.data/projects/default.json` 原子文件持久化

下一阶段 `vue-components` change 将增加以 Vue SFC 开发并挂载 GrapesJS block 的能力。

项目仅支持单个固定项目，不包含认证、协作、发布或生产级存储。文件存储只适用于单机开发实验。

## 开始使用

要求 Node.js 20+ 与 pnpm。

```bash
pnpm install
pnpm dev
```

开发服务器默认运行在 `http://localhost:3000`。

```bash
pnpm typecheck
pnpm build
pnpm preview
```

仓库中的自动化终端命令必须添加 `rtk` 前缀，例如 `rtk pnpm build`。

## 项目结构

```text
app/
  components/       编辑器工作台与客户端初始化
  assets/           全局 Less 与第三方样式入口
server/
  api/              固定项目读写接口
  utils/            项目校验与文件存储
openspec/
  changes/          功能规格、设计与实施任务
.data/              本地项目数据（不提交）
```

## OpenSpec 工作流

1. 创建 change，并完成 proposal、specs、design 和 tasks。
2. 运行 `rtk openspec validate <change> --strict`。
3. 按 tasks 实施并逐项更新。
4. 运行类型检查和生产构建。
5. 验收后归档 change。

当前按 `editor-ui`、`vue-components` 的顺序推进。
