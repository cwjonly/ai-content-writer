#!/usr/bin/env node

/**
 * 演示脚本 - 展示AI内容生成工具的功能
 */

const ContentWriter = require('./src/ContentWriter');
const TemplateManager = require('./src/TemplateManager');
const fs = require('fs');
const path = require('path');

async function demo() {
  console.log('='.repeat(60));
  console.log('🤖 AI内容生成工具演示');
  console.log('='.repeat(60));
  
  // 1. 显示可用模板
  console.log('\n📋 可用模板列表:');
  const templateManager = new TemplateManager();
  const templates = templateManager.getTemplateList();
  
  templates.forEach((template, index) => {
    console.log(`  ${index + 1}. ${template}`);
  });
  
  // 2. 生成博客文章
  console.log('\n📝 生成博客文章示例:');
  console.log('-'.repeat(30));
  
  const blogWriter = new ContentWriter('blog-post', '人工智能的发展趋势');
  const blogContent = await blogWriter.generate();
  
  console.log(blogContent.substring(0, 500) + '...\n');
  
  // 3. 生成技术指南
  console.log('\n🛠️ 生成技术指南示例:');
  console.log('-'.repeat(30));
  
  const guideWriter = new ContentWriter('technical-guide', 'Node.js最佳实践');
  const guideContent = await guideWriter.generate();
  
  console.log(guideContent.substring(0, 500) + '...\n');
  
  // 4. 保存文件示例
  console.log('\n💾 保存文件示例:');
  console.log('-'.repeat(30));
  
  try {
    // 创建输出目录
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 保存博客文章
    const blogPath = path.join(outputDir, 'demo-blog.md');
    await blogWriter.saveToFile(blogPath);
    console.log(`✓ 博客文章已保存到: ${blogPath}`);
    
    // 保存技术指南
    const guidePath = path.join(outputDir, 'demo-guide.md');
    await guideWriter.saveToFile(guidePath);
    console.log(`✓ 技术指南已保存到: ${guidePath}`);
    
    // 显示文件大小
    const blogStats = fs.statSync(blogPath);
    const guideStats = fs.statSync(guidePath);
    
    console.log(`\n文件统计:`);
    console.log(`  - 博客文章: ${blogStats.size} 字节`);
    console.log(`  - 技术指南: ${guideStats.size} 字节`);
    
  } catch (error) {
    console.error('保存文件时出错:', error.message);
  }
  
  // 5. 展示自定义模板示例
  console.log('\n🎨 自定义模板示例:');
  console.log('-'.repeat(30));
  
  const customTemplate = {
    name: 'custom-product-review',
    title: '产品评测：',
    sections: [
      {
        type: 'paragraph',
        placeholder: '这是一个关于[产品名称]的评测文章...'
      },
      {
        type: 'heading',
        level: 2,
        text: '产品介绍'
      },
      {
        type: 'paragraph',
        placeholder: '产品的基本信息，包括功能、特点等...'
      },
      {
        type: 'heading',
        level: 2,
        text: '使用体验'
      },
      {
        type: 'list',
        items: [
          '优点一：...',
          '优点二：...',
          '优点三：...'
        ]
      },
      {
        type: 'heading',
        level: 2,
        text: '总结'
      },
      {
        type: 'paragraph',
        placeholder: '总体评价和推荐建议...'
      }
    ]
  };
  
  // 临时保存自定义模板
  const customTemplatePath = path.join(__dirname, 'templates', 'custom-product-review.json');
  fs.writeFileSync(customTemplatePath, JSON.stringify(customTemplate, null, 2));
  
  // 使用自定义模板生成内容
  const customWriter = new ContentWriter('custom-product-review', '智能手机评测：iPhone 15 Pro');
  const customContent = await customWriter.generate();
  
  console.log(customContent.substring(0, 500) + '...\n');
  
  // 清理临时文件
  if (fs.existsSync(customTemplatePath)) {
    fs.unlinkSync(customTemplatePath);
  }
  
  // 6. 总结
  console.log('='.repeat(60));
  console.log('🎉 演示完成！');
  console.log('='.repeat(60));
  console.log('\n这个AI内容生成工具具有以下特点：');
  console.log('  🚀 快速生成结构化内容');
  console.log('  📁 灵活的模板系统');
  console.log('  💾 便捷的文件保存');
  console.log('  🔧 可扩展的架构');
  console.log('  🎯 支持多种内容类型');
  
  console.log('\n使用方式：');
  console.log('  npm start create              # 交互式创建内容');
  console.log('  npm start create -t blog-post # 使用特定模板');
  console.log('  npm start templates -l        # 查看所有模板');
}

// 运行演示
if (require.main === module) {
  demo().catch(console.error);
}

module.exports = { demo };