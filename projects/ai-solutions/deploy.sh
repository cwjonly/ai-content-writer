#!/bin/bash

# AI内容生成工具部署脚本

set -e

echo "开始部署AI内容生成工具..."

# 检查Node.js版本
echo "检查Node.js版本..."
if ! command -v node &> /dev/null; then
    echo "错误: Node.js未安装"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "错误: Node.js版本过低，请使用14.0.0或更高版本"
    exit 1
fi

echo "Node.js版本: $(node -v)"

# 安装依赖
echo "安装依赖..."
npm install

# 创建必要目录
echo "创建输出目录..."
mkdir -p output

# 检查模板文件
if [ ! -f "templates/blog-post.json" ]; then
    echo "警告: 默认模板文件不存在，请检查templates目录"
fi

# 设置执行权限
echo "设置执行权限..."
chmod +x src/index.js

# 测试运行
echo "测试运行..."
npm start -- --help > /dev/null

echo "部署完成！"
echo ""
echo "使用方法:"
echo "  npm start create              # 创建新内容"
echo "  npm start templates -l        # 查看所有模板"
echo "  npm start init               # 初始化项目"
echo ""