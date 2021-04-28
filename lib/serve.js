const express = require('express');
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware'); // 代理

const chalk = require('chalk') // 粉笔  文字颜色
const log = content => console.log(chalk.green(content)) //  打印


module.exports =  (origin, port) =>{

	// 允许所有域名跨域
	app.all('*', function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
		res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");

		// 跨域请求CORS中的预请求
		if (req.method == "OPTIONS") {
			// res.send(200); //让options请求快速返回
		} else {
			log(req.method+":"+res.req.url)
			next();
		}
	});

	// 服务器代理
	app.use('/api', createProxyMiddleware({
		target: origin,
		changeOrigin: true,
		pathRewrite: {
			"^/api": "/"
		}
	}))

	app.listen(port, () => {
		log(`服务器启动: http://localhost:${port}`)
	})

} 
