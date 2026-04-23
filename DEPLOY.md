# 阿里巴巴问卷系统 - 云平台部署指南

## 🚀 部署到 Render（推荐，完全免费）

### 步骤 1：准备代码

确保您的代码已经在 Git 仓库中：

```bash
cd /Users/kkkat/.easyclaw/workspace/alibaba-survey

# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"
```

### 步骤 2：推送到 GitHub

1. 在 GitHub 创建新仓库（名称如：`alibaba-survey`）
2. 推送代码：

```bash
# 替换为您的 GitHub 用户名和仓库名
git remote add origin https://github.com/YOUR_USERNAME/alibaba-survey.git
git branch -M main
git push -u origin main
```

### 步骤 3：部署到 Render

1. **访问 Render**: https://render.com
2. **注册/登录**（可以使用 GitHub 账号）
3. **创建新服务**:
   - 点击 "New +" → "Web Service"
   - 连接您的 GitHub 仓库
   - 选择 `alibaba-survey` 仓库

4. **配置服务**:
   ```
   Name: alibaba-survey
   Region: Singapore（选择离您最近的）
   Branch: main
   Root Directory: （留空）
   Runtime: Node
   Build Command: echo "Building..."
   Start Command: node server/index.js
   ```

5. **选择免费套餐**:
   - Instance Type: **Free**
   - 点击 "Advanced" 展开

6. **添加环境变量**:
   ```
   NODE_ENV = production
   ADMIN_PASSWORD = admin123（或您自定义的密码）
   ```

7. **点击 "Create Web Service"**

### 步骤 4：等待部署完成

- Render 会自动构建和部署您的应用
- 大约需要 2-5 分钟
- 部署完成后，您会看到一个 URL，格式如：
  ```
  https://alibaba-survey.onrender.com
  ```

### 步骤 5：访问您的问卷

- **问卷地址**: `https://alibaba-survey.onrender.com`
- **后台管理**: 点击网站右上角的"后台管理"
- **管理密码**: 您设置的环境变量密码

## 🎯 部署到 Railway（备选方案）

### 步骤：

1. 访问 https://railway.app
2. 使用 GitHub 登录
3. 点击 "New Project" → "Deploy from GitHub repo"
4. 选择您的仓库
5. Railway 会自动检测 Node.js 并部署
6. 在 Settings 中添加环境变量：
   ```
   ADMIN_PASSWORD = admin123
   ```
7. 点击 "Deploy"

## 📊 部署后注意事项

### Render 免费套餐限制：
- ⚠️ 每月 750 小时免费额度（足够 24/30 天运行）
- ⚠️ 15 分钟无访问会自动休眠（下次访问需要 30 秒唤醒）
- ✅ 自动 HTTPS
- ✅ 自动部署（推送代码到 GitHub 自动更新）

### 解决方案：
1. **避免休眠**: 使用 UptimeRobot 等工具定期访问
2. **升级套餐**: $7/月，不休眠

### 数据持久化：
- ⚠️ Render 免费版的文件系统是临时的
- ⚠️ 重启后数据会丢失

### 长期方案 - 添加数据库：

如果需要长期保存数据，建议添加 MongoDB：

1. 在 Render 创建 MongoDB 服务
2. 连接字符串添加到环境变量
3. 修改代码使用 MongoDB

## 🔧 自定义域名（可选）

1. 购买域名（如：namecheap.com）
2. 在 Render Dashboard → Settings → Custom Domain
3. 按提示配置 DNS

## 📝 管理密码修改

在 Render Dashboard → Environment → 添加/修改：
```
ADMIN_PASSWORD = 您的新密码
```

然后点击 "Manual Deploy" 重启服务。

## 🎉 完成！

现在您的问卷系统已经部署到云平台，任何人都可以访问了！

---

**技术支持**: 如有问题，请查看 Render 的日志 Dashboard → Logs
