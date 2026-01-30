/**
 * 内容生成器核心类
 */
class ContentWriter {
  constructor(templateName, title = '') {
    this.templateName = templateName;
    this.title = title;
    this.templateManager = new TemplateManager();
    this.content = '';
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

      // 生成标题
      this.content = this.generateTitle(template);

      // 生成各个部分
      if (template.sections) {
        for (const section of template.sections) {
          this.content += this.generateSection(section);
        }
      }

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
      return '# 新文章\n\n';
    }
  }

  /**
   * 生成内容部分
   */
  generateSection(section) {
    switch (section.type) {
      case 'heading':
        return this.generateHeading(section);
      case 'paragraph':
        return this.generateParagraph(section);
      case 'list':
        return this.generateList(section);
      case 'code':
        return this.generateCode(section);
      case 'quote':
        return this.generateQuote(section);
      default:
        return '';
    }
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
   * 生成段落
   */
  generateParagraph(section) {
    let text = section.text || '';
    if (!text && section.placeholder) {
      text = section.placeholder;
    }
    return `${text}\n\n`;
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
    return `> ${text}\n\n`;
  }

  /**
   * 保存到文件
   */
  async saveToFile(filePath) {
    const fs = require('fs').promises;
    const path = require('path');
    
    // 确保输出目录存在
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    
    await fs.writeFile(filePath, this.content, 'utf8');
  }

  /**
   * 设置生成选项
   */
  setOptions(options) {
    this.options = options;
  }
}

module.exports = ContentWriter;