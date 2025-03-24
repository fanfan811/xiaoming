const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const path = require('path');

const app = express();

// 修改 CORS 配置，允许多个源
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

// 删除重复的 CORS 配置
// 删除这段代码，因为已经有了上面的 cors 配置
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });

// 设置静态文件目录
const xiaomingDir = path.join(__dirname, 'xiaoming');
app.use('/api/images', express.static(xiaomingDir));

// 添加CORS支持
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// 添加测试路由
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// 改进图片列表API
app.get('/api/images', (req, res) => {
    fs.readdir(xiaomingDir, (err, files) => {
        if (err) {
            console.error('读取目录失败:', err);
            return res.status(500).json({ error: '无法读取图片目录' });
        }

        // 过滤出图片文件
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
        const allImages = files.filter(file => 
            imageExtensions.includes(path.extname(file).toLowerCase())
        );

        // 直接返回所有图片
        res.json({
            images: allImages,
            total: allImages.length
        });
    });
});

// 添加图片详细信息API
app.get('/api/images/:imageName', (req, res) => {
    const imagePath = path.join(xiaomingDir, req.params.imageName);
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).json({ error: '图片未找到' });
    }
});

// 确保 target 不是空的
app.use('/api', createProxyMiddleware({
    target: process.env.TARGET_URL || 'http://localhost:3000',
    changeOrigin: true
}));

app.listen(3002, () => {
    console.log('Server running on port 3002');
});
console.log("Proxy target:", process.env.TARGET_URL);
