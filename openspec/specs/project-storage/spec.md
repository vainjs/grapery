# project-storage Specification

## Purpose

定义固定 GrapesJS 项目在单机实验环境中的默认数据读取、用户手动保存、输入结构校验和原子文件写入行为，并明确接口成功及失败时工作台应呈现的状态。

## Requirements

### Requirement: 固定 GrapesJS 项目读取

系统 SHALL 通过 `GET /api/projects/default` 返回 GrapesJS 项目和更新时间；文件不存在时 MUST 返回默认项目。

#### Scenario: 首次读取

- **WHEN** 固定项目文件不存在
- **THEN** 接口返回包含默认页面的项目和 `updatedAt: null`

#### Scenario: 读取已保存项目

- **WHEN** 固定项目文件包含有效对象
- **THEN** 接口返回项目和 ISO 8601 更新时间

### Requirement: 手动保存

系统 SHALL 通过工作台保存按钮将当前 GrapesJS 项目提交到 `PUT /api/projects/default`。

#### Scenario: 保存成功

- **WHEN** 用户点击保存且接口成功持久化项目
- **THEN** 工作台显示已保存状态并清除脏状态

#### Scenario: 保存失败

- **WHEN** 保存请求失败
- **THEN** 工作台显示失败信息并保留未保存状态

### Requirement: 项目数据校验与原子写入

系统 MUST 拒绝空值、数组或非对象项目，并 MUST 通过同目录临时文件和重命名原子替换目标 JSON。

#### Scenario: 无效保存数据

- **WHEN** 客户端提交缺失或非对象的 `project`
- **THEN** 接口返回 HTTP 400 且不覆盖已有项目

#### Scenario: 正常写入

- **WHEN** 保存有效项目成功
- **THEN** 目标文件包含完整可解析的 JSON
