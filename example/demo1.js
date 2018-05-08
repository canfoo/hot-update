
var path = require('path')
var hot = require('../lib/hot')
var tool = require('../lib/tool')

var obj = require('./js/test')

console.log('val', require('./js/test').val)

hot(path.join(__dirname, './js/test'))


console.log('obj', obj)

setInterval(function() {
    console.log('obj', obj)
}, 2000)

// setInterval(tool.showMemory, 5000)
 