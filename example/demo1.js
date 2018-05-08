
var path = require('path')
var hot = require('../lib/hot')
var tool = require('../lib/tool')
var fs = require('fs')
// var p1 = require('./js/p1')
// console.log('p1', p1)

var obj = require('./js/test')

hot(path.join(__dirname, './js/p1.js'))


console.log('obj', obj)

setInterval(function() {
    console.log('obj', obj)
}, 2000)

// setInterval(tool.showMemory, 5000)
 