/**
 * 增强版内容生成器 - 包含更多高级功能
 */
class EnhancedContentWriter {
  constructor(templateName, title = '', options = {}) {
    this.templateName = templateName;
    this.title = title;
    this.options = options;
    this.templateManager = new TemplateManager();
    this.content = '';
    this.metadata = {
      createdAt: new Date(),
      template: templateName,
      title: title,
      wordCount: 0
    };
  }

  /**
   * 生成内容
   */
  async generate() {
    try {
      // 获取模板
      const template = await this.templateManager.getTemplate(this.templateName);
      if (!template) {
        throw new Error(`模板 "${this.templateName}" 不存在`);
      }

      // 应用选项
      if (this.options.wordCount) {
        this.options.maxWords = this.options.wordCount;
      }

      // 生成标题
      this.content = this.generateTitle(template);

      // 生成各个部分
      if (template.sections) {
        for (const section of template.sections) {
          this.content += await this.generateSection(section);
        }
      }

      // 添加元数据
      this.metadata.wordCount = this.countWords(this.content);
      this.content += this.generateMetadata();

      return this.content;
    } catch (error) {
      throw new Error(`生成内容失败: ${error.message}`);
    }
  }

  /**
   * 生成标题
   */
  generateTitle(template) {
    if (this.title) {
      return `# ${this.title}\n\n`;
    } else if (template.title) {
      return `# ${template.title}\n\n`;
    } else {
      return '# 新内容\n\n';
    }
  }

  /**
   * 生成内容部分（增强版）
   */
  async generateSection(section) {
    switch (section.type) {
      case 'heading':
        return this.generateHeading(section);
      case 'paragraph':
        return await this.generateParagraph(section);
      case 'list':
        return this.generateList(section);
      case 'code':
        return this.generateCode(section);
      case 'quote':
        return this.generateQuote(section);
      case 'image':
        return this.generateImage(section);
      case 'table':
        return this.generateTable(section);
      default:
        return '';
    }
  }

  /**
   * 生成增强版段落
   */
  async generateParagraph(section) {
    let text = section.text || '';
    
    if (!text && section.placeholder) {
      text = section.placeholder;
      
      // 如果设置了字数限制，截取或扩展内容
      if (this.options.maxWords) {
        const words = text.split(' ');
        if (words.length > this.options.maxWords) {
          text = words.slice(0, this.options.maxWords).join(' ') + '...';
        } else if (this.options.expand && words.length < this.options.maxWords) {
          text += ' ' + this.generatePadding(this.options.maxWords - words.length);
        }
      }
    }
    
    return `${text}\n\n`;
  }

  /**
   * 生成标题
   */
  generateHeading(section) {
    const level = section.level || 1;
    const text = section.text || '标题';
    const prefix = '#'.repeat(level);
    return `${prefix} ${text}\n\n`;
  }

  /**
   * 生成列表
   */
  generateList(section) {
    if (!section.items) {
      return '';
    }

    const prefix = section.ordered ? '' : '- ';
    let listContent = '';
    
    section.items.forEach(item => {
      listContent += `${prefix} ${item}\n`;
    });
    
    return `${listContent}\n`;
  }

  /**
   * 生成代码块
   */
  generateCode(section) {
    const language = section.language || '';
    const code = section.code || '';
    return `\`\`\`${language}\n${code}\n\`\`\`\n\n`;
  }

  /**
   * 生成引用
   */
  generateQuote(section) {
    const text = section.text || '';
    const author = section.author ? `\n— ${section.author}` : '';
    return `> ${text}${author}\n\n`;
  }

  /**
   * 生成图片占位符
   */
  generateImage(section) {
    const alt = section.alt || '图片描述';
    const caption = section.caption || '';
    return `![${alt}](${section.url || '#'})\n${caption ? `\n${caption}\n` : ''}\n`;
  }

  /**
   * 生成表格
   */
  generateTable(section) {
    if (!section.rows || !section.headers) {
      return '';
    }

    let tableContent = '| ' + section.headers.join(' | ') + ' |\n';
    tableContent += '|' + section.headers.map(() => ' ---').join('') + '|\n';
    
    section.rows.forEach(row => {
      tableContent += '| ' + row.join(' | ') + ' |\n';
    });
    
    return `${tableContent}\n`;
  }

  /**
   * 生成元数据信息
   */
  generateMetadata() {
    return `---
生成时间: ${this.metadata.createdAt.toISOString()}
模板: ${this.metadata.template}
标题: ${this.metadata.title}
字数: ${this.metadata.wordCount}
---
`;
  }

  /**
   * 计算字数
   */
  countWords(text) {
    return text.trim().split(/\s+/).length;
  }

  /**
   * 生成填充文本
   */
  generatePadding(wordCount) {
    const paddingWords = [
      '这是一个', '很好的', '补充说明', '可以', '帮助', '读者', '更好地', '理解',
      '相关内容', '通过', '这种方式', '可以', '使', '文章', '更加', '完整',
      '同时', '也能够', '提供', '更多', '有用', '信息', '让', '读者', '获得', '更好的', '阅读体验'
    ];
    
    let result = '';
    for (let i = 0; i < wordCount && i < paddingWords.length; i++) {
      if (i > 0 && i % 5 === 0) result += ', ';
      result += paddingWords[i];
    }
    return result;
  }

  /**
   * 保存到文件（支持多种格式）
   */
  async saveToFile(filePath, format = 'markdown') {
    const fs = require('fs').promises;
    const path = require('path');
    
    // 确保输出目录存在
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    
    let content = this.content;
    
    // 根据格式转换
    if (format === 'html') {
      content = this.convertToMarkdownHTML(content);
    } else if (format === 'json') {
      content = JSON.stringify({
        metadata: this.metadata,
        content: this.content
      }, null, 2);
    }
    
    await fs.writeFile(filePath, content, 'utf8');
  }

  /**
   * 将Markdown转换为简单的HTML
   */
  convertToMarkdownHTML(markdown) {
    let html = markdown
      // 标题
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // 段落
      .replace(/\n\n+/g, '</p><p>')
      .replace(/^(?!<[h|p])(.+)$/gim, '<p>$1</p>')
      // 代码块
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      // 行内代码
      .replace(/`(.+?)`/g, '<code>$1</code>')
      // 粗体
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // 斜体
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // 列表
      .replace(/^- (.+)$/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      // 引用
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      // 添加HTML头部和尾部
      .replace(/^(?!<h1)/, '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Generated Content</title></head><body>')
      .replace(/(?!<\/h1>$)/, '</body></html>');
    
    return html;
  }

  /**
   * 获取内容统计信息
   */
  getStats() {
    return {
      wordCount: this.metadata.wordCount,
      lineCount: this.content.split('\n').length,
      characterCount: this.content.length,
      readingTime: Math.ceil(this.metadata.wordCount / 200) // 假设每分钟阅读200字
    };
  }
}

module.exports = EnhancedContentWriter;