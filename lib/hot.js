var fs = require('fs');
var tool = require('./tool');

var exportsContent = {}  // 存储所有被监听模块的exports地址

// 保存一个新模块的exports
function newExports(fileName) {
	var currentModule = require.cache[fileName]
	exportsContent[fileName] = currentModule.exports
}

// 获取模块的exports
function getExports(fileName) {
	return exportsContent[fileName] || false
}

// 重新加载模块
function reloadModule(fileName) {
	if (!require.cache[fileName]) {
		delete require.cache[fileName]
		require(fileName)
	}
	return require.cache[fileName]
}

// 编辑新的模块内容
function compileModule(fileName, content) {
	var currentModule = reloadModule(fileName)
	currentModule._compile(content, fileName)
	return currentModule.exports
}

// 更新老模块的exports值
function updateExports(fileName, current) {
	var real = getExports(fileName)
	if (tool.isObject(real)) {
		tool.copyObject(real, current)
	} else if (tool.isArray(real)) {
		tool.copyArray(real, current)
	} else {
		tool.log('warning', fileName + 'exports must be Object or Array')
	}
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
	var states = null
	try {
		states = fs.statSync(path)
	} catch (e) {
		if (e.code === 'ENOENT') {
			states = fs.statSync(path + '.js')
		} else {
			tool.log('error', 'the path [' + fileName + 'is invalid')
		}
	}
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
	if (tool.isString(path)) {
		filesList = readDirs(path)
	} else if (tool.isArray(path)) {
		filesList = path
	} else {
		tool.log('error', 'path must be String or Array')
	}
	filesList.forEach(function(fileName) {
		watchFile(require.resolve(fileName));
	})
}

module.exports = hot