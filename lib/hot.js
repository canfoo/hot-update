var fs = require('fs');
var tool = require('./tool')
var Module = module.constructor;
var mI = new Module();

function loadFile(fileName) {
    var content = fs.readFileSync(fileName, 'utf8')
    mI._compile(content, fileName);
    var actual = require.cache[fileName].exports
    for (var key in actual) {
		delete actual[key];
    }
    tool.copyObject(actual, mI.exports);
    require.cache[fileName].exports = actual
    watchFile(fileName)
}

function watchFile(fileName) {
    fs.watch(fileName, function () {
        loadFile(fileName)
    })
}

function hot(fileName) {
    watchFile(require.resolve(fileName))
}

module.exports = hot