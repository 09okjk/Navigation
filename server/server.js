const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 9436;

// 数据文件路径
const dataFilePath = path.join(__dirname, 'data', 'tools.json');

// 确保数据目录存在
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 如果数据文件不存在，创建一个空数组
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([]));
}

// 中间件
app.use(cors()); // 允许跨域请求
app.use(express.json()); // 解析JSON请求体

// 静态文件服务
app.use(express.static(path.join(__dirname, '../dist')));

// 获取所有工具
app.get('/api/tools', (req, res) => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading tools data:', error);
    res.status(500).json({ error: '无法读取工具数据' });
  }
});

// 添加新工具
app.post('/api/tools', (req, res) => {
  try {
    const tools = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    const newTool = req.body;
    newTool.id = Date.now().toString(); // 生成唯一ID
    tools.push(newTool);
    fs.writeFileSync(dataFilePath, JSON.stringify(tools, null, 2));
    res.status(201).json(newTool);
  } catch (error) {
    console.error('Error adding tool:', error);
    res.status(500).json({ error: '无法添加工具' });
  }
});

// 更新工具
app.put('/api/tools/:id', (req, res) => {
  try {
    const tools = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    const id = req.params.id;
    const updatedTool = req.body;
    
    const index = tools.findIndex(tool => tool.id === id);
    if (index === -1) {
      return res.status(404).json({ error: '工具不存在' });
    }
    
    tools[index] = { ...tools[index], ...updatedTool };
    fs.writeFileSync(dataFilePath, JSON.stringify(tools, null, 2));
    res.json(tools[index]);
  } catch (error) {
    console.error('Error updating tool:', error);
    res.status(500).json({ error: '无法更新工具' });
  }
});

// 删除工具
app.delete('/api/tools/:id', (req, res) => {
  try {
    const tools = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    const id = req.params.id;
    
    const filteredTools = tools.filter(tool => tool.id !== id);
    if (filteredTools.length === tools.length) {
      return res.status(404).json({ error: '工具不存在' });
    }
    
    fs.writeFileSync(dataFilePath, JSON.stringify(filteredTools, null, 2));
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting tool:', error);
    res.status(500).json({ error: '无法删除工具' });
  }
});

// 处理SPA路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
