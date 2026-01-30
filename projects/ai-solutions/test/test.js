const ContentWriter = require('../src/ContentWriter');
const TemplateManager = require('../src/TemplateManager');
const path = require('path');
const fs = require('fs');

async function runTests() {
  console.log('开始运行测试...\n');
  
  let passedTests = 0;
  let totalTests = 0;
  
  // 测试1: 模板管理器
  console.log('测试1: 模板管理器');
  totalTests++;
  
  try {
    const templateManager = new TemplateManager();
    const templates = templateManager.getTemplateList();
    
    if (templates.length > 0) {
      console.log('✓ 成功加载模板列表:', templates);
      passedTests++;
    } else {
      console.log('✗ 未能加载任何模板');
    }
  } catch (error) {
    console.log('✗ 模板管理器测试失败:', error.message);
  }
  
  // 测试2: 内容生成器
  console.log('\n测试2: 内容生成器');
  totalTests++;
  
  try {
    const writer = new ContentWriter('blog-post', '测试文章');
    const content = await writer.generate();
    
    if (content && content.length > 100) {
      console.log('✓ 成功生成内容，长度:', content.length);
      console.log('预览:', content.substring(0, 100) + '...');
      passedTests++;
    } else {
      console.log('✗ 生成内容为空或过短');
    }
  } catch (error) {
    console.log('✗ 内容生成器测试失败:', error.message);
  }
  
  // 测试3: 文件保存
  console.log('\n测试3: 文件保存');
  totalTests++;
  
  try {
    const writer = new ContentWriter('blog-post', '测试保存');
    const content = await writer.generate();
    const testPath = path.join('output', 'test-output.md');
    
    await writer.saveToFile(testPath);
    
    if (fs.existsSync(testPath)) {
      const savedContent = fs.readFileSync(testPath, 'utf8');
      if (savedContent === content) {
        console.log('✓ 文件保存成功');
        // 清理测试文件
        fs.unlinkSync(testPath);
        passedTests++;
      } else {
        console.log('✗ 保存的内容不匹配');
      }
    } else {
      console.log('✗ 文件未创建');
    }
  } catch (error) {
    console.log('✗ 文件保存测试失败:', error.message);
  }
  
  // 测试4: 模板验证
  console.log('\n测试4: 模板验证');
  totalTests++;
  
  try {
    const templateManager = new TemplateManager();
    const validTemplate = {
      name: 'test-template',
      sections: [
        {
          type: 'heading',
          level: 1,
          text: '测试标题'
        }
      ]
    };
    
    const isValid = templateManager.validateTemplate(validTemplate);
    if (isValid) {
      console.log('✓ 模板验证功能正常');
      passedTests++;
    } else {
      console.log('✗ 模板验证失败');
    }
  } catch (error) {
    console.log('✗ 模板验证测试失败:', error.message);
  }
  
  // 总结
  console.log('\n=== 测试总结 ===');
  console.log(`通过: ${passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('🎉 所有测试通过！');
  } else {
    console.log('⚠️  部分测试失败');
  }
  
  return passedTests === totalTests;
}

// 如果直接运行此文件
if (require.main === module) {
  runTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('测试运行失败:', error);
      process.exit(1);
    });
}

module.exports = { runTests };