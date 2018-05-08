var fs = require('fs');
var tool = require('./tool');

var exportsContent = {}

function newExports(fileName) {
	var currentModule = require.cache[fileName]
	exportsContent[fileName] = currentModule.exports
}

function getExports(fileName) {
	return exportsContent[fileName] || false
}

function compileModule(fileName, content) {
	var currentModule = require.cache[fileName]
	currentModule._compile(content, fileName)
	return currentModule.exports
}

function updateExports(fileName, current) {
	var real = getExports(fileName)
	Object.keys(real).forEach(function(key) {
		delete real[key];
	})
	tool.copyObject(real, current)
}

function loadFile(fileName) {
	if (!getExports(fileName)) {
		newExports(fileName)
	}
	getFileContent(fileName, function(content) {
		updateExports(fileName, compileModule(fileName, content))
	})
}

function getFileContent(fileName, cb) {
	fs.readFile(fileName, {encoding:"utf-8"}, function(err, content) {
		cb(tool.stripBOM(content))
	})
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