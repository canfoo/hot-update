


var p1 = require('./p1')

function test () {
    return '1'
}

var obj = {v: '1', p1: test()};

module.exports = obj;