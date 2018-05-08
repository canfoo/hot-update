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

function reloadModule(fileName) {
	if (!require.cache[fileName]) {
		delete require.cache[fileName]
		require(fileName)
	}
	return require.cache[fileName]
}

function compileModule(fileName, content) {
	var currentModule = reloadModule(fileName)
	currentModule._compile(content, fileName)
	return currentModule.exports
}

function updateExports(fileName, current) {
	var real = getExports(fileName)
	Object.keys(real).forEach(function(key) {
		delete real[key];
	})
	tool.copyObject(real, current)
	require.cache[fileName].exports = real
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
        loadFile(fileName);
    });
}

function readDirs(path) {
	var filesList = []
	var files = null;
	var states = fs.statSync(path)
	if (states.isDirectory()) {
		files = fs.readdirSync(path);
		files.forEach(function(file) {
			var states = null;
			states = fs.statSync(path + '/' + file);
			if(states.isDirectory()) {
				readDirs(path + '/' + file, filesList);
			}
			else {
				filesList.push(path + '/' + file);
			}
		});
	} else {
		filesList.push(path)
	}
	return filesList
}

function hot(path) {
	var filesList = []
	filesList = readDirs(path)
	filesList.forEach(function(fileName) {
		watchFile(require.resolve(fileName));
	})
}

module.exports = hot