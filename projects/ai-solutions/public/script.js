// API基础URL
const API_URL = 'http://localhost:3000/api';

// DOM元素
const templateSelect = document.getElementById('template-select');
const titleInput = document.getElementById('title-input');
const enhancedMode = document.getElementById('enhanced-mode');
const advancedOptions = document.querySelector('.advanced-options');
const wordCountInput = document.getElementById('word-count');
const contentForm = document.getElementById('content-form');
const resultCard = document.getElementById('result-card');
const contentOutput = document.getElementById('content-output');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');
const regenerateBtn = document.getElementById('regenerate-btn');
const statsContainer = document.getElementById('stats-container');
const wordCountSpan = document.getElementById('word-count');
const lineCountSpan = document.getElementById('line-count');
const charCountSpan = document.getElementById('char-count');
const readingTimeSpan = document.getElementById('reading-time');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadTemplates();
    setupEventListeners();
});

// 设置事件监听器
function setupEventListeners() {
    // 增强模式切换
    enhancedMode.addEventListener('change', (e) => {
        if (e.target.checked) {
            advancedOptions.style.display = 'block';
        } else {
            advancedOptions.style.display = 'none';
        }
    });

    // 表单提交
    contentForm.addEventListener('submit', handleGenerate);

    // 按钮事件
    copyBtn.addEventListener('click', copyToClipboard);
    downloadBtn.addEventListener('click', downloadContent);
    regenerateBtn.addEventListener('click', () => {
        resultCard.style.display = 'none';
        contentForm.reset();
    });
}

// 加载模板列表
async function loadTemplates() {
    try {
        const response = await fetch(`${API_URL}/templates`);
        const data = await response.json();
        
        // 清空现有选项
        templateSelect.innerHTML = '<option value="">请选择模板...</option>';
        
        // 添加模板选项
        data.templates.forEach(template => {
            const option = document.createElement('option');
            option.value = template;
            option.textContent = template;
            templateSelect.appendChild(option);
        });
    } catch (error) {
        console.error('加载模板失败:', error);
        alert('加载模板失败，请确保后端服务正在运行');
    }
}

// 处理内容生成
async function handleGenerate(e) {
    e.preventDefault();
    
    const templateName = templateSelect.value;
    const title = titleInput.value;
    const useEnhanced = enhancedMode.checked;
    const wordCount = wordCountInput.value ? parseInt(wordCountInput.value) : null;
    
    if (!templateName) {
        alert('请选择一个模板');
        return;
    }
    
    try {
        // 显示加载状态
        const submitBtn = contentForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '生成中...';
        submitBtn.disabled = true;
        
        // 发送生成请求
        const response = await fetch(`${API_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                templateName,
                title,
                options: wordCount ? { wordCount } : {},
                enhanced: useEnhanced
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // 显示结果
            displayResult(data);
        } else {
            alert('生成失败: ' + data.error);
        }
    } catch (error) {
        console.error('生成内容失败:', error);
        alert('生成内容失败，请确保后端服务正在运行');
    } finally {
        // 恢复按钮状态
        const submitBtn = contentForm.querySelector('button[type="submit"]');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// 显示生成结果
function displayResult(data) {
    contentOutput.value = data.content;
    resultCard.style.display = 'block';
    
    // 如果有统计信息，显示统计区域
    if (data.stats) {
        showStats(data.stats);
    }
    
    // 滚动到结果区域
    resultCard.scrollIntoView({ behavior: 'smooth' });
}

// 显示统计信息
function showStats(stats) {
    wordCountSpan.textContent = stats.wordCount;
    lineCountSpan.textContent = stats.lineCount;
    charCountSpan.textContent = stats.characterCount;
    readingTimeSpan.textContent = stats.readingTime;
    statsContainer.style.display = 'block';
}

// 复制到剪贴板
async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(contentOutput.value);
        
        // 显示复制成功反馈
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '已复制!';
        copyBtn.style.background = '#48bb78';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
    } catch (error) {
        console.error('复制失败:', error);
        // 降级方案
        contentOutput.select();
        document.execCommand('copy');
        
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '已复制!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }
}

// 下载内容
async function downloadContent() {
    const content = contentOutput.value;
    const title = titleInput.value || 'generated-content';
    const filename = `${title}-${Date.now()}.md`;
    
    try {
        // 调用后端保存API
        const response = await fetch(`${API_URL}/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content,
                filename
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // 创建下载链接
            const downloadUrl = `http://localhost:3000/output/${filename}`;
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // 显示成功反馈
            const originalText = downloadBtn.textContent;
            downloadBtn.textContent = '下载成功!';
            downloadBtn.style.background = '#48bb78';
            
            setTimeout(() => {
                downloadBtn.textContent = originalText;
                downloadBtn.style.background = '';
            }, 2000);
        } else {
            alert('下载失败: ' + data.error);
        }
    } catch (error) {
        console.error('下载失败:', error);
        alert('下载失败，请确保后端服务正在运行');
    }
}

// 自动保存草稿
function saveDraft() {
    const draft = {
        template: templateSelect.value,
        title: titleInput.value,
        enhanced: enhancedMode.checked,
        wordCount: wordCountInput.value
    };
    localStorage.setItem('ai-writer-draft', JSON.stringify(draft));
}

// 加载草稿
function loadDraft() {
    const draft = localStorage.getItem('ai-writer-draft');
    if (draft) {
        const data = JSON.parse(draft);
        templateSelect.value = data.template || '';
        titleInput.value = data.title || '';
        enhancedMode.checked = data.enhanced || false;
        wordCountInput.value = data.wordCount || '';
        
        if (data.enhanced) {
            advancedOptions.style.display = 'block';
        }
    }
}

// 定期保存草稿
setInterval(saveDraft, 5000);

// 页面加载时加载草稿
window.addEventListener('load', loadDraft);

// 页面关闭前保存草稿
window.addEventListener('beforeunload', saveDraft);

// 检查后端服务连接
async function checkBackendConnection() {
    try {
        const response = await fetch(`${API_URL}/templates`, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        return false;
    }
}

// 页面加载时检查后端连接
window.addEventListener('load', async () => {
    const connected = await checkBackendConnection();
    if (!connected) {
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f56565;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 300px;
        `;
        alertDiv.innerHTML = `
            <strong>⚠️ 后端服务未连接</strong><br>
            请确保后端服务器正在运行在 http://localhost:3000
        `;
        document.body.appendChild(alertDiv);
        
        // 5秒后自动移除
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 5000);
    }
});