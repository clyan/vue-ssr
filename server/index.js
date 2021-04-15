const express = require('express')
const app = express()
const { createBundleRenderer } = require('vue-server-renderer')
const serverBundle = require('../dist/server/vue-ssr-server-bundle.json');  
const clientManifest = require('../dist/client/vue-ssr-client-manifest.json');
const fs = require('fs')
const path = require('path')
const renderer  = createBundleRenderer(serverBundle, {
    runInNewContext: false,
    template: fs.readFileSync(path.join(__dirname, '../public/index.temp.html'), 'utf-8'),// 宿主模板
    clientManifest
});
// 中间件处理静态文件请求
app.use(express.static(path.join(__dirname, '../dist/client/'), {index: false}))


app.get('*',async (req, res) => {
    // 每次请求都创建一个新的vue实例
    const context = { 
        url: req.url,
        title: 'ssr test'
     }
    try {
        const html = await renderer.renderToString(context);
        // eslint-disable-next-line no-console
        // console.log(html);
        res.send(html);
    } catch (error) {
        res.status(500).end('Internal Server Error')
    }
})

app.listen(8080,() => {
    console.log("http://127.0.0.1:8080")
})