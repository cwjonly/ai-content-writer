const express = require('express');
const path = require('path');
const ContentWriter = require('./src/ContentWriter');
const EnhancedContentWriter = require('./src/EnhancedContentWriter');
const TemplateManager = require('./src/TemplateManager');

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.static('public'));

// 获取所有模板
app.get('/api/templates', async (req, res) => {
  try {
    const templateManager = new TemplateManager();
    const templates = templateManager.getTemplateList();
    res.json({ templates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 生成内容
app.post('/api/generate', async (req, res) => {
  try {
    const { templateName, title, options = {}, enhanced = false } = req.body;
    
    let writer;
    if (enhanced) {
      writer = new EnhancedContentWriter(templateName, title, options);
    } else {
      writer = new ContentWriter(templateName, title);
    }
    
    const content = await writer.generate();
    
    res.json({
      content,
      stats: enhanced ? writer.getStats() : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 保存内容
app.post('/api/save', async (req, res) => {
  try {
    const { content, filename, format = 'markdown' } = req.body;
    const fs = require('fs').promises;
    const outputPath = path.join('output', filename);
    
    await fs.mkdir('output', { recursive: true });
    await fs.writeFile(outputPath, content, 'utf8');
    
    res.json({ message: '文件保存成功', path: outputPath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 首页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 启动服务器
app.listen(port, () => {
  console.log(`AI内容生成工具Web界面已启动，访问 http://localhost:${port}`);
});

module.exports = app;