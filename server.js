const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// 静态文件服务
app.use(express.static('.'));

// 文件树API
app.get('/.file-tree', (req, res) => {
    const scanDir = (dir) => {
        const items = fs.readdirSync(dir);
        return items.map(item => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            const relativePath = path.relative('.', fullPath);
            
            if (stat.isDirectory()) {
                return {
                    name: item,
                    type: 'dir',
                    path: relativePath,
                    children: scanDir(fullPath)
                };
            } else {
                return {
                    name: item,
                    type: 'file',
                    path: relativePath
                };
            }
        });
    };
    
    res.json(scanDir('.'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});