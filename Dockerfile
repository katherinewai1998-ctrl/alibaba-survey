# 使用阿里云 Node.js 镜像（国内访问更快）
FROM registry.cn-hangzhou.aliyuncs.com/acs/node:18-alpine

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
