# project-guidance Specification

## Purpose

定义项目协作文档必须反映的当前技术架构、能力范围、限制条件和 OpenSpec change 实施顺序，避免开发过程中重新引入已移除的编辑器依赖或越过既定阶段。

## Requirements

### Requirement: 当前架构说明

项目文档 SHALL 只描述 Nuxt、Vue 与原生 GrapesJS 集成，并 MUST 不包含已移除依赖、授权配置或兼容层说明。

#### Scenario: 开发者阅读项目文档

- **WHEN** 开发者查看 README、AGENTS.md 和 OpenSpec 配置
- **THEN** 文档说明当前工作台、存储能力和已知限制

### Requirement: 变更实施顺序

AGENTS.md MUST 规定先完成 `editor-ui`，再通过 `vue-components` 引入 Vue 组件区块。

#### Scenario: 开始 Vue 组件集成

- **WHEN** 开发者准备实施 Vue 组件区块
- **THEN** `editor-ui` 已完成并通过验证
