const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const imageFolder = path.join(__dirname, 'xiaoming');

// 获取图片列表的接口
app.get('/api/images', (req, res) => {
    fs.readdir(imageFolder, (err, files) => {
        if (err) {
            return res.status(500).json({ error: '无法读取图片目录' });
        }

        const images = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png'].includes(ext);
        });

        res.json({ images });
    });
});

// 直接返回图片数据
app.get('/api/images/:filename', (req, res) => {
    const filePath = path.join(imageFolder, req.params.filename);
    
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: '图片未找到' });
    }
});

// 新增：直接返回所有图片的base64编码
app.get('/api/images-data', async (req, res) => {
    try {
        const files = fs.readdirSync(imageFolder);
        const images = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png'].includes(ext);
        });

        const imageData = await Promise.all(images.map(async (imageName) => {
            const filePath = path.join(imageFolder, imageName);
            const data = fs.readFileSync(filePath);
            return {
                name: imageName,
                data: `data:image/${path.extname(imageName).slice(1)};base64,${data.toString('base64')}`
            };
        }));

        res.json({ images: imageData });
    } catch (error) {
        res.status(500).json({ error: '无法读取图片数据' });
    }
});

app.listen(port, () => {
    console.log(`服务器正在运行：http://localhost:${port}`);
});