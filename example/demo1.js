
var path = require('path')
var hot = require('../lib/hot')

var obj = require('./js/test')

hot(path.join(__dirname, './js/test'))


console.log('obj', obj)

setInterval(function() {
    console.log('obj', obj)
}, 2000)
 