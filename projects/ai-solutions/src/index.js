#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const figlet = require('figlet');
const ContentWriter = require('./ContentWriter');
const TemplateManager = require('./TemplateManager');

// 显示欢迎界面
console.log(
  chalk.cyan(
    figlet.textSync('AI Writer', {
      font: 'Small',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    })
  )
);

program
  .name('ai-writer')
  .description('智能内容生成工具')
  .version('1.0.0');

program
  .command('create')
  .alias('c')
  .description('创建新内容')
  .option('-t, --template <template>', '使用指定模板')
  .option('-o, --output <file>', '输出文件路径')
  .option('-T, --title <title>', '内容标题')
  .action(async (options) => {
    try {
      const spinner = ora('正在初始化...').start();
      
      // 初始化模板管理器
      const templateManager = new TemplateManager();
      spinner.succeed('初始化完成');
      
      // 获取模板选择
      const templateChoice = options.template || 
        (await inquirer.prompt([{
          type: 'list',
          name: 'template',
          message: '请选择内容模板:',
          choices: templateManager.getTemplateList()
        }])).template;
      
      // 获取内容标题
      const title = options.title || 
        (await inquirer.prompt([{
          type: 'input',
          name: 'title',
          message: '请输入内容标题:',
          default: '新文章'
        }])).title;
      
      // 创建内容生成器
      const writer = new ContentWriter(templateChoice, title);
      
      // 生成内容
      const contentSpinner = ora('正在生成内容...').start();
      const content = await writer.generate();
      contentSpinner.succeed('内容生成完成');
      
      // 显示预览
      console.log('\n=== 内容预览 ===');
      console.log(content.substring(0, 300) + '...');
      
      // 保存或输出
      if (options.output) {
        await writer.saveToFile(options.output);
        console.log(chalk.green(`\n内容已保存到: ${options.output}`));
      } else {
        const saveChoice = await inquirer.prompt([{
          type: 'confirm',
          name: 'save',
          message: '是否保存到文件?',
          default: true
        }]);
        
        if (saveChoice.save) {
          const outputPath = await inquirer.prompt([{
            type: 'input',
            name: 'path',
            message: '请输入保存路径:',
            default: `${title.replace(/\s+/g, '_')}.md`
          }]);
          
          await writer.saveToFile(outputPath.path);
          console.log(chalk.green(`\n内容已保存到: ${outputPath.path}`));
        }
      }
      
    } catch (error) {
      console.error(chalk.red('发生错误:'), error.message);
      process.exit(1);
    }
  });

program
  .command('templates')
  .alias('t')
  .description('管理模板')
  .option('-l, --list', '列出所有可用模板')
  .option('-a, --add <file>', '添加新模板')
  .option('-r, --remove <template>', '移除模板')
  .action(async (options) => {
    const templateManager = new TemplateManager();
    
    if (options.list) {
      console.log(chalk.blue('可用模板:'));
      templateManager.getTemplateList().forEach(template => {
        console.log(`  - ${template}`);
      });
    } else if (options.add) {
      try {
        await templateManager.addTemplate(options.add);
        console.log(chalk.green('模板添加成功'));
      } catch (error) {
        console.error(chalk.red('添加模板失败:'), error.message);
      }
    } else if (options.remove) {
      try {
        await templateManager.removeTemplate(options.remove);
        console.log(chalk.green('模板移除成功'));
      } catch (error) {
        console.error(chalk.red('移除模板失败:'), error.message);
      }
    }
  });

program
  .command('init')
  .description('初始化项目')
  .action(async () => {
    try {
      const spinner = ora('正在初始化项目...').start();
      
      // 创建基础目录结构
      const fs = require('fs');
      const path = require('path');
      
      const dirs = ['src', 'templates', 'output', 'docs'];
      dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      });
      
      // 创建默认模板
      const defaultTemplate = {
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
      
      const templatePath = path.join('templates', 'default.json');
      fs.writeFileSync(templatePath, JSON.stringify(defaultTemplate, null, 2));
      
      spinner.succeed('项目初始化完成');
      console.log(chalk.blue('已创建:'));
      dirs.forEach(dir => console.log(`  - ${dir}/`));
      console.log(chalk.green(`  - templates/default.json`));
      
    } catch (error) {
      console.error(chalk.red('初始化失败:'), error.message);
    }
  });

// 如果没有提供命令，显示帮助
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse();