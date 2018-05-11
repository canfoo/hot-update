
var path = require('path');
var fs = require('fs');
var hot = require('../index');
var obj = require('./js/p1');

hot(path.join(__dirname, './js/p1')); // 配置热加载文件

setInterval(function() {
    console.log('obj', obj);
}, 1000);

setTimeout(function() {  // 模拟修改文件内容
    console.log('文件修改了')
    fs.writeFile('./js/p1.js', "var obj = {name: 'hot-p222'}; module.exports = obj;");
}, 2000);
setTimeout(function() {  // 模拟修改文件内容
    console.log('文件修改了')
    fs.writeFile('./js/p1.js', "var obj = {name: 'hot-p333'}; module.exports = obj;");
}, 4000);
setTimeout(function() {  // 模拟修改文件内容
    console.log('文件修改了')
    fs.writeFile('./js/p1.js', "var obj = {name: 'hot-p111'}; module.exports = obj;");
}, 6000);

 