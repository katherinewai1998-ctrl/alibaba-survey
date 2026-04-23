# 使用 Node.js 官方镜像
# 云效流水线会自动配置 Docker 镜像加速
FROM node:18.20-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制项目代码
COPY . .

# 暴露端口
EXPOSE 8080

# 启动应用
CMD ["node", "server/index.js"]
