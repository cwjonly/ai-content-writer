@echo off
REM AI内容生成工具Windows部署脚本

echo 开始部署AI内容生成工具...

REM 检查Node.js
echo 检查Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: Node.js未安装
    pause
    exit /b 1
)

echo Node.js版本: 
node --version

REM 安装依赖
echo 安装依赖...
call npm install

REM 创建必要目录
echo 创建输出目录...
if not exist "output" mkdir output

REM 设置执行权限
echo 设置执行权限...
icacls "src\index.js" /grant Everyone:F

REM 测试运行
echo 测试运行...
npm start -- --help > nul

echo 部署完成！
echo.
echo 使用方法:
echo   npm start create              创建新内容
echo   npm start templates -l        查看所有模板
echo   npm start init               初始化项目
echo.
pause