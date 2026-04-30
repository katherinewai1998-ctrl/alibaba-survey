# 腾讯云 CloudBase 部署指南

## 📋 问卷文件清单

部署前请确认以下文件已存在于 `public/` 目录：

```
public/
├── index-a-cloud-qwen.html      (问卷 A：阿里云 & 千问模型) ✅ 新建
├── index-b-ecommerce-ding.html  (问卷 B：电商 & 钉钉) ✅ 新建
├── index.html                   (完整版问卷)
├── index-cloud-ai.html          (旧版：阿里云 & 千问)
└── admin.html                   (管理后台)
```

---

## 🚀 方式一：控制台手动上传（推荐，最快）

### 步骤 1：登录腾讯云 CloudBase 控制台

1. 访问：https://console.cloud.tencent.com/tcb
2. 使用微信或 QQ 扫码登录
3. 进入您的环境：`alibaba-survey-250138-6-1425221209`

### 步骤 2：进入静态网站托管

1. 左侧菜单选择 **「静态网站托管」**
2. 点击 **「文件管理」** 标签页
3. 进入文件浏览器界面

### 步骤 3：上传新问卷文件

1. 点击 **「上传文件」** 按钮
2. 选择以下两个文件：
   - `/Users/kkkat/.easyclaw/workspace/alibaba-survey/public/index-a-cloud-qwen.html`
   - `/Users/kkkat/.easyclaw/workspace/alibaba-survey/public/index-b-ecommerce-ding.html`
3. 确认上传路径为 `/`（根目录）
4. 点击 **「确定」** 开始上传

### 步骤 4：验证部署

上传完成后，访问以下链接验证：

**问卷 A**：
```
https://alibaba-survey-250138-6-1425221209.sh.run.tcloudbase.com/index-a-cloud-qwen.html
```

**问卷 B**：
```
https://alibaba-survey-250138-6-1425221209.sh.run.tcloudbase.com/index-b-ecommerce-ding.html
```

---

## 🚀 方式二：使用 CloudBase CLI（适合批量部署）

### 步骤 1：安装 CloudBase CLI

```bash
# 使用 npm 全局安装
npm install -g @cloudbase/cli

# 或使用 yarn
yarn global add @cloudbase/cli
```

### 步骤 2：登录腾讯云

```bash
tcb login
```

扫码登录您的腾讯云账号。

### 步骤 3：部署静态网站

```bash
cd /Users/kkkat/.easyclaw/workspace/alibaba-survey

# 部署 public 目录到 CloudBase
tcb hosting:deploy ./public --env alibaba-survey-250138-6-1425221209
```

### 步骤 4：验证部署

等待部署完成后，访问问卷链接验证。

---

## 🚀 方式三：使用 Git 自动部署（需配置）

如果您已配置 GitHub Webhook 自动部署：

### 步骤 1：确认 Webhook 已配置

1. 进入腾讯云 CloudBase 控制台
2. 选择 **「设置」** → **「自动部署」**
3. 确认已绑定 GitHub 仓库：`katherinewai1998-ctrl/alibaba-survey`
4. 确认分支为 `main`

### 步骤 2：触发自动部署

```bash
cd /Users/kkkat/.easyclaw/workspace/alibaba-survey

# 推送代码到 GitHub（已自动触发）
git push origin main
```

### 步骤 3：等待部署完成

自动部署通常需要 **5-10 分钟**。可通过以下方式检查进度：

1. 腾讯云控制台 → **「云开发」** → **「函数」** → 查看部署日志
2. 或访问：https://console.cloud.tencent.com/tcb/build/index

---

## ✅ 部署验证清单

部署完成后，请逐一验证以下内容：

### 1. 问卷 A 访问测试

```bash
curl -I "https://alibaba-survey-250138-6-1425221209.sh.run.tcloudbase.com/index-a-cloud-qwen.html"
```

**预期结果**：
- HTTP 状态码：`200 OK`
- Content-Type: `text/html`

### 2. 问卷 B 访问测试

```bash
curl -I "https://alibaba-survey-250138-6-1425221209.sh.run.tcloudbase.com/index-b-ecommerce-ding.html"
```

**预期结果**：
- HTTP 状态码：`200 OK`
- Content-Type: `text/html`

### 3. 浏览器功能测试

访问问卷链接，验证以下功能：

- [ ] 页面正常加载
- [ ] 步骤导航按钮正确显示
- [ ] 表单可以正常填写
- [ ] 提交成功（可在管理后台查看数据）

### 4. 管理后台验证

访问：https://alibaba-survey-250138-6-1425221209.sh.run.tcloudbase.com/admin.html

- 密码：`admin123`
- 验证能否看到新提交的问卷数据

---

## ⚠️ 常见问题排查

### 问题 1：404 Not Found

**原因**：文件未上传到 CloudBase 存储桶

**解决方案**：
1. 检查 `public/` 目录是否存在目标文件
2. 使用方式一（控制台手动上传）重新上传
3. 确认上传路径为根目录 `/`

### 问题 2：缓存问题（显示旧版本）

**原因**：CDN 缓存或浏览器缓存

**解决方案**：
1. 在 URL 后添加时间戳参数：
   ```
   https://alibaba-survey-250138-6-1425221209.sh.run.tcloudbase.com/index-a-cloud-qwen.html?nocache=202604301600
   ```
2. 清除浏览器缓存（Ctrl+Shift+Delete）
3. 使用无痕模式访问

### 问题 3：路由配置未生效

**原因**：`cloudbaserc.json` 中的路由配置未同步

**解决方案**：
1. 确认 `cloudbaserc.json` 已包含新路由
2. 重新部署：`tcb hosting:deploy ./public --env <envId>`

---

## 📊 部署后检查清单

- [ ] 问卷 A 可正常访问
- [ ] 问卷 B 可正常访问
- [ ] 管理后台可正常访问
- [ ] 表单提交流程正常
- [ ] 数据可在管理后台查看
- [ ] 旧版问卷仍可访问（向后兼容）

---

## 📞 技术支持

如遇到问题，可通过以下方式获取帮助：

1. **腾讯云文档**：https://docs.cloudbase.net/
2. **CloudBase CLI 文档**：https://docs.cloudbase.net/cli-v1/intro.html
3. **腾讯云工单**：https://console.cloud.tencent.com/workorder

---

**最后更新**：2026-04-30 16:02 GMT+8
