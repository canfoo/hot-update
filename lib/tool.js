
var heapdump = require('heapdump');

function copyObject(dest, src) {
    Object.keys(src).forEach(function(k) {
        var getter = src.__lookupGetter__(k);
		var setter = src.__lookupSetter__(k);
        if (!getter && !setter) {
            dest[k] = src[k];
        } else {
            getter && dest.__defineGetter__(k, getter);
            setter && dest.__defineSetter__(k, setter);
        }
    })
	if (src.prototype != undefined) {
		dest.prototype = src.prototype;
	} else {
		delete dest.prototype;
	}
}

/* 检测内存泄露工具 */
function showMemory() {  
    function f(v) {  
        if (v < 1024) return v.toString(10);  
        else if (v < 1048576) {   //1M  
            return (v / 1024).toFixed(2) + "KB";  
        }  
        else if (v < 1073741824) //1M  
        {  
            return (v / 1048576).toFixed(2) + "MB";  
        }  
        else {  
            return (v / 1073741824).toFixed(2) + "GB";  //1G  
        }  
    }  
    {  
        //打印并显示当前堆的情况 可以去掉这个部分  
        let d = process.memoryUsage();  
        let strRss = f(d.rss);  
        let strheapTotal = f(d.heapTotal);  
        let strheapUsed = f(d.heapUsed);  
        let strDate = new Date().toLocaleString();  
        console.log(`memory: ${strDate}: rss:${strRss}, heapTotal:${strheapTotal}, heapUsed:${strheapUsed}`);  
    }  
    /* 生成快照的路径，path填写本机的目录地址 */
    // heapdump.writeSnapshot('path' + Date.now() + '.heapsnapshot');   
}  
  
module.exports = {
    copyObject: copyObject,
    heapdump: heapdump
}
