var fs = require('fs');
var Module = module.constructor;
var mI = new Module();

function loadFile(fileName) {
    var content = fs.readFileSync(fileName, 'utf8')
    mI._compile(content, fileName);
    var actual = require.cache[fileName].exports
    for (var key in actual) {
		delete actual[key];
    }
    copy_object(actual, mI.exports);
    require.cache[fileName].exports = actual
    watchFile(fileName)
}

function watchFile(fileName) {
    fs.watch(fileName, function () {
        loadFile(fileName)
    })
}

function copy_object(dest, src)
{
	for (var k in src) {
		var getter = src.__lookupGetter__(k);
		var setter = src.__lookupSetter__(k);
	
		if (getter || setter) {
			if (getter)
				dest.__defineGetter__(k, getter);
			if (setter)
				dest.__defineSetter__(k, setter);
		} else {
			dest[k] = src[k];
		}
	}
	if (src.prototype != undefined) {
		dest.prototype = src.prototype;
	} else {
		delete dest.prototype;
	}
}


function hot(fileName) {
    watchFile(require.resolve(fileName))
}

module.exports = hot