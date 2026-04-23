# 阿里巴巴相关业务调研问卷系统 - 完整版

一个完整的在线问卷调查系统，包含前端填写界面和后台数据管理功能。基于您提供的完整 DOCX 文档内容开发。

## 📋 功能特性

### 前端问卷系统（完整版）

#### 第一部分：调研者基础信息（必答）
- ✅ 年龄段、性别、职业类型、职位
- ✅ 大模型产品使用情况（9 种主流模型）

#### 第二部分：用户身份筛选（必答）
- ✅ B 端/C 端用户分类
- ✅ 业务身份识别（网店商家、云服务使用者、办公用户、大模型应用者）
- ✅ 阿里产品使用情况（10 种产品）

#### 第三部分：B 端用户调研模块

**（一）淘天商家专项调研**
- ✅ 店铺信息（开店时长、类型、主营品类）
- ✅ 平台功能依赖度
- ✅ 多平台使用情况
- ✅ 10 维度满意度评分（1-5 分）
- ✅ 核心竞争力与短板分析
- ✅ 未来发展规划
- ✅ 开放性建议

**（二）阿里云用户专项调研**
- ✅ 云服务使用情况
- ✅ 多云服务商对比
- ✅ 业务场景分析（9 种场景）
- ✅ 使用时长与付费模式
- ✅ 月投入金额
- ✅ 10 维度满意度评分
- ✅ 10 维度厂商对比
- ✅ 核心竞争力与短板
- ✅ 未来发展规划
- ✅ 开放性建议

**（三）钉钉用户专项调研**
- ✅ 协同办公工具使用情况
- ✅ 企业规模分布
- ✅ 核心使用场景（10 种场景）
- ✅ 12 维度满意度评分
- ✅ 核心竞争力与短板
- ✅ 未来发展规划

**（四）千问模型应用者专项调研**
- ✅ 大模型使用情况（9 种模型）
- ✅ 业务应用场景（8 种场景）
- ✅ 应用深度分析
- ✅ 12 维度满意度评分
- ✅ 核心竞争力与短板
- ✅ 未来发展规划

### 后台管理系统
- ✅ 数据列表展示（分页）
- ✅ 多维度筛选（用户类型）
- ✅ 详情查看弹窗（完整数据展示）
- ✅ 数据导出 CSV（带时间戳命名）
- ✅ 单条删除功能
- ✅ 实时统计面板（总提交数、B 端用户、C 端用户）
- ✅ 自动刷新（30 秒）

## 🚀 快速开始

### 1. 启动服务器

```bash
cd /Users/kkkat/.easyclaw/workspace/alibaba-survey
npm start
```

### 2. 访问系统

- **填写问卷**: http://localhost:3000
- **后台管理**: 点击导航栏"后台管理"按钮

## 📁 项目结构

```
alibaba-survey/
├── public/
│   └── index.html          # 前端页面（Vue 3 CDN 版，完整问卷）
├── server/
│   └── index.js            # Express 后端服务器
├── data/
│   └── submissions.json    # 数据存储（自动创建）
├── package.json            # 项目配置
└── README.md               # 说明文档
```

## 🛠️ 技术栈

- **前端**: Vue 3 (CDN 方式，无需构建)
- **后端**: Node.js + Express
- **数据存储**: JSON 文件（易于备份和迁移）

## 📊 数据字段说明

### 基础字段
- `id`: 唯一标识符
- `age`: 年龄段
- `gender`: 性别
- `occupation`: 职业
- `position`: 职位
- `models`: 使用过的大模型（数组）
- `userType`: 用户类型（B 端/C 端/两者都是）
- `businessIdentities`: 业务身份（数组）
- `alibabaProducts`: 使用的阿里产品（数组）
- `submittedAt`: 提交时间

### 淘天商家字段
- `taobaoSeller`: 是否淘宝/天猫卖家
- `storeAge`: 开店时长
- `storeType`: 店铺类型
- `categories`: 主营品类（数组）
- `taobaoFunctions`: 依赖功能（数组）
- `ecommercePlatforms`: 使用平台（数组）
- `taobaoRatings`: 满意度评分（数组，10 项）
- `taobaoStrengths`: 核心竞争力（数组）
- `taobaoWeaknesses`: 短板（数组）
- `taobaoFuturePlan`: 未来计划
- `taobaoSuggestion`: 建议（文本）

### 阿里云字段
- `cloudUser`: 是否云服务用户
- `cloudProviders`: 云服务商（数组）
- `cloudScenarios`: 业务场景（数组）
- `aliyunDuration`: 使用时长
- `aliyunPayment`: 付费模式
- `aliyunSpending`: 月投入金额
- `aliyunRatings`: 满意度评分（数组，10 项）
- `cloudBest`: 各维度最优厂商（数组，10 项）
- `aliyunStrengths`: 核心竞争力（数组）
- `aliyunWeaknesses`: 短板（数组）
- `aliyunFuturePlan`: 未来计划
- `aliyunSuggestion`: 建议（文本）

### 钉钉字段
- `officeToolUser`: 是否办公工具用户
- `officeTools`: 使用工具（数组）
- `companySize`: 企业规模
- `dingtalkScenarios`: 使用场景（数组）
- `dingtalkRatings`: 满意度评分（数组，12 项）
- `dingtalkStrengths`: 核心竞争力（数组）
- `dingtalkWeaknesses`: 短板（数组）
- `dingtalkFuturePlan`: 未来计划

### 千问模型字段
- `llmUser`: 是否大模型用户
- `llmModels`: 使用模型（数组）
- `llmScenarios`: 业务场景（数组）
- `qwenDuration`: 使用时长
- `qwenDepth`: 应用深度
- `qwenRatings`: 满意度评分（数组，12 项）
- `qwenStrengths`: 核心竞争力（数组）
- `qwenWeaknesses`: 短板（数组）
- `qwenFuturePlan`: 未来计划

## 🔧 API 接口

### GET /api/submissions
获取所有问卷提交数据

### POST /api/submissions
提交新的问卷数据

### DELETE /api/submissions/:id
删除指定 ID 的提交记录

## 📈 后台管理功能

### 数据筛选
- 按用户类型筛选（B 端/C 端）

### 数据统计
- 总提交数
- B 端用户数量
- C 端用户数量

### 数据导出
- 批量导出 CSV（自动命名：问卷数据_YYYY-MM-DD.csv）
- 包含所有问卷字段

## 🎨 界面特点

- **渐变背景**: 紫色系渐变，专业美观
- **进度条**: 实时显示填写进度
- **分步填写**: 3 个步骤，降低填写压力
- **条件逻辑**: 根据用户类型自动显示/隐藏相关题目
- **响应式设计**: 完美支持手机、平板、电脑
- **评分组件**: 可视化 1-5 分评分
- **标签展示**: 多选答案以标签形式展示

## ⚠️ 注意事项

1. 首次运行需要安装依赖：`npm install`
2. 数据文件自动创建在 `data/submissions.json`
3. 建议定期备份 `data/submissions.json` 文件
4. 服务器默认运行在 3000 端口

## 🔐 数据安全

- 匿名制问卷，不收集个人敏感信息
- 数据仅存储在本地
- 后台管理需要直接访问服务器地址

## 📞 技术支持

如遇问题，请检查：
1. Node.js 版本是否 >= 16
2. 端口 3000 是否被占用
3. 依赖是否完整安装

## 📄 许可证

仅供内部使用

---

**版本**: 2.0 完整版  
**更新日期**: 2026-04-22  
**问卷来源**: 阿里巴巴相关业务调研问卷 (4).docx
