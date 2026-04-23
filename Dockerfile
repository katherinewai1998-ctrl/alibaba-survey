# 使用阿里云镜像仓库的 Node.js 镜像
FROM registry.cn-hangzhou.aliyuncs.com/dockerhub_mirror/node:18.20-alpine

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
