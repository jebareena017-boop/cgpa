// Lightweight Local Server for SJC CGPA Calculator
// Built using Node.js standard modules (no npm install required)

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    
    // Default route redirects to login.html
    if (reqPath === '/' || reqPath === '') {
        reqPath = '/login.html';
    }

    const safePath = path.normalize(path.join(__dirname, reqPath));
    if (!safePath.startsWith(__dirname)) {
        res.writeHead(403);
        return res.end('Access denied');
    }

    fs.stat(safePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('404 Not Found: ' + reqPath);
        }

        const ext = path.extname(safePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache'
        });

        const stream = fs.createReadStream(safePath);
        stream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 SJC MCA CGPA Calculator is running on Localhost!`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log(`👉 http://localhost:${PORT}/login.html`);
    console.log(`👉 http://localhost:${PORT}/index.html`);
    console.log(`======================================================\n`);
    console.log(`Press Ctrl + C in this terminal to stop the server.\n`);
});
