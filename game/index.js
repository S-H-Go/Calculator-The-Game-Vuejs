// var http = require('http');
// var fs = require('fs');
// var url = require('url');
// console.log("http://localhost:8080");

// http.createServer(function (req, res) {
//     // 解析请求，包括文件名
//    var pathname = url.parse(req.url).pathname;
   
//    // 输出请求的文件名
//    console.log("Request for " + pathname + " received.");

//    fs.readFile("../vuegame/dist/index.html", function (err, data) {
//     if (err) {
//        console.log(err);
//        // HTTP 状态码: 404 : NOT FOUND
//        // Content Type: text/html
//        res.writeHead(404, {'Content-Type': 'text/html'});
//     }else{             
//        // HTTP 状态码: 200 : OK
//        // Content Type: text/html
//        res.writeHead(200, {'Content-Type': 'text/html'});    
//        // 响应文件内容
//        res.write(data.toString());
//     }
//     //  发送响应数据
//     res.end();
//  });   
// }).listen(8080);


var express = require('express');  
var app = express();  
const hostname = 'localhost';
const port = 8080;

//Express 提供了内置的中间件 express.static 来设置静态文件
app.use(express.static('./'));

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});

