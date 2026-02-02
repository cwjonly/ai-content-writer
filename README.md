# AI 内容生成工具

一款基于Node.js的智能内容生成工具，帮助用户快速创建高质量的文章和内容。

## 功能特点

- 🤖 智能内容生成
- 📝 多种预设模板
- 🎨 灵活的内容结构
- 💾 文件自动保存
- 🔧 可扩展的模板系统

## 安装

```bash
# 克隆项目
git clone https://github.com/cwjonly/ai-content-writer.git
cd ai-content-writer

# 安装依赖
npm install
```

## 快速开始

### 初始化项目

```bash
# 初始化项目结构
npm run init
```

### 使用示例

```bash
# 创建新内容
npm start create

# 使用特定模板
npm start create -t blog-post

# 设置标题
npm start create -T "我的新文章"

# 直接输出到文件
npm start create -o output.md
```

### 管理模板

```bash
# 查看所有模板
npm start templates -l

# 添加新模板
npm start templates -a my-template.json

# 移除模板
npm start templates -r blog-post
```

## 模板系统

工具支持基于JSON格式的模板系统，模板定义内容结构：

```json
{
  "name": "my-template",
  "title": "我的模板",
  "sections": [
    {
      "type": "heading",
      "level": 1,
      "text": "标题"
    },
    {
      "type": "paragraph",
      "text": "段落内容"
    },
    {
      "type": "list",
      "items": ["项目一", "项目二"]
    },
    {
      "type": "code",
      "language": "javascript",
      "code": "// 示例代码"
    }
  ]
}
```

### 支持的内容类型

- **heading**: 标题
- **paragraph**: 段落
- **list**: 列表（有序/无序）
- **code**: 代码块
- **quote**: 引用

## 开发

```bash
# 运行测试
npm test

# 开发模式
npm start
```

## 贡献

欢迎提交Pull Request或Issue！

## 许可证

MIT License

## 作者

AI Solutions Team