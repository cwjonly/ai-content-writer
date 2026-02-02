FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY src/ ./src/
COPY templates/ ./templates/
COPY public/ ./public/
COPY deploy.sh deploy.bat demo.js test/ ./

# 创建输出目录
RUN mkdir -p output

# 设置执行权限
RUN chmod +x deploy.sh src/index.js

# 暴露端口
EXPOSE 3000

# 设置启动命令
CMD ["node", "web-server.js"]