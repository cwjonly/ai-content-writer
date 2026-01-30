/**
 * 模板管理器
 */
class TemplateManager {
  constructor() {
    this.templatesPath = '../templates';
    this.templates = new Map();
    this.loadTemplates();
  }

  /**
   * 加载所有模板
   */
  loadTemplates() {
    const fs = require('fs');
    const path = require('path');
    
    try {
      const templatesDir = path.join(__dirname, this.templatesPath);
      if (!fs.existsSync(templatesDir)) {
        return;
      }
      
      const files = fs.readdirSync(templatesDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      jsonFiles.forEach(file => {
        try {
          const filePath = path.join(templatesDir, file);
          const data = fs.readFileSync(filePath, 'utf8');
          const template = JSON.parse(data);
          this.templates.set(template.name, template);
        } catch (error) {
          console.warn(`加载模板文件 ${file} 失败:`, error.message);
        }
      });
    } catch (error) {
      console.warn('加载模板失败:', error.message);
    }
  }

  /**
   * 获取所有模板名称列表
   */
  getTemplateList() {
    return Array.from(this.templates.keys());
  }

  /**
   * 获取指定模板
   */
  async getTemplate(name) {
    return this.templates.get(name);
  }

  /**
   * 添加新模板
   */
  async addTemplate(templatePath) {
    const fs = require('fs').promises;
    const path = require('path');
    
    try {
      // 读取模板文件
      const templateData = await fs.readFile(templatePath, 'utf8');
      const template = JSON.parse(templateData);
      
      // 验证模板格式
      if (!this.validateTemplate(template)) {
        throw new Error('模板格式无效');
      }
      
      // 确保模板目录存在
      const templatesDir = path.join(__dirname, this.templatesPath);
      await fs.mkdir(templatesDir, { recursive: true });
      
      // 保存模板
      const filename = `${template.name}.json`;
      const savePath = path.join(templatesDir, filename);
      await fs.writeFile(savePath, JSON.stringify(template, null, 2));
      
      // 重新加载模板
      this.templates.set(template.name, template);
      
    } catch (error) {
      throw new Error(`添加模板失败: ${error.message}`);
    }
  }

  /**
   * 移除模板
   */
  async removeTemplate(name) {
    const fs = require('fs').promises;
    const path = require('path');
    
    if (!this.templates.has(name)) {
      throw new Error(`模板 "${name}" 不存在`);
    }
    
    try {
      const templatesDir = path.join(__dirname, this.templatesPath);
      const filePath = path.join(templatesDir, `${name}.json`);
      
      await fs.unlink(filePath);
      this.templates.delete(name);
      
    } catch (error) {
      throw new Error(`移除模板失败: ${error.message}`);
    }
  }

  /**
   * 验证模板格式
   */
  validateTemplate(template) {
    if (!template.name || typeof template.name !== 'string') {
      return false;
    }
    
    if (!template.sections || !Array.isArray(template.sections)) {
      return false;
    }
    
    // 验证每个部分
    for (const section of template.sections) {
      if (!section.type || typeof section.type !== 'string') {
        return false;
      }
      
      switch (section.type) {
        case 'heading':
          if (section.level && (typeof section.level !== 'number' || section.level < 1 || section.level > 6)) {
            return false;
          }
          break;
        case 'paragraph':
        case 'quote':
          if (section.text && typeof section.text !== 'string') {
            return false;
          }
          break;
        case 'list':
          if (section.items && !Array.isArray(section.items)) {
            return false;
          }
          break;
        case 'code':
          if (section.code && typeof section.code !== 'string') {
            return false;
          }
          break;
      }
    }
    
    return true;
  }

  /**
   * 创建默认模板
   */
  createDefaultTemplate() {
    return {
      name: 'default-article',
      title: '文章标题',
      sections: [
        {
          type: 'paragraph',
          placeholder: '这是引言部分...'
        },
        {
          type: 'heading',
          level: 2,
          text: '主要观点'
        },
        {
          type: 'paragraph',
          placeholder: '在这里详细描述你的主要观点...'
        }
      ]
    };
  }
}

module.exports = TemplateManager;