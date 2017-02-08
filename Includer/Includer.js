// ES5 ONLY

QQ.includer = function () {
	
	//================================
	// Public methods
	//================================
	
	function js(file, cb, forced) {
		jsQueue.push(file);
		doInclude(this, file, cb, forced);
	}
	
	function onLoad(cb) {
		isReady() ?
			cb() :
			window.setTimeout(onLoad, 100, cb);
	};
	
	function allowWarnings(isShow) {
		showWarnings = isShow;
	};
	
	//================================
	// Private methods
	//================================
	
	function scriptReady(src, cb) {
		var i = loading.indexOf(src);
		if ( i !== -1 ) {
			loading.splice(i, 1);
		}
		if ( cb ) {
			onLoad(cb);
		}
	}
	
	function doInclude(self, file, cb, forced) {
		if ( loading.length !== 0 || jsQueue.indexOf(file) !== 0 ) {
			window.setTimeout(doInclude, 100, self, file, cb, forced);
			return;
		}
		jsQueue.splice(jsQueue.indexOf(file), 1);
		
		if ( cb === true ) {
			cb     = undefined;
			forced = true;
		}
		
		var script                = document.createElement('script');
		script.src                = file;
		script.type               = 'text/javascript';
		script.defer              = true;
		script.onreadystatechange = scriptReady.bind(null, script.src, cb);
		script.onload             = scriptReady.bind(null, script.src, cb);
		
		var scripts = getScripts();
		for ( var i in scripts ) {
			if ( scripts[i].src === script.src ) {
				if ( loading.indexOf(script.src) !== -1 ) {
					showWarning( 'Warning: File already loading ('+script.src+')' );
					return;
				}
				if ( ! forced ) {
					showWarning(
							'Warning: File already loaded ('+script.src+'). ' +
							'Use "forced" flag to reload file.'
						);
					return;
				} else {
					document.getElementsByTagName('head').item(0).removeChild(scripts[i]);
					break;
				}
			}
		}
		document.getElementsByTagName('head').item(0).appendChild(script);
		loading.push(script.src);
	};
	
	function getScripts() {
		var result  = [];
		var scripts = document.getElementsByTagName('script');
		for ( var i = 0; i < scripts.length; ++i ) {
			if ( scripts[i].src !== '' ) {
				result.push(scripts[i]);
			}
		}
		return result;
	};
	
	function isReady() {
		return loading.length === 0 && jsQueue.length === 0;
	};
	
	function showWarning(text) {
		if ( showWarnings ) {
			console.log(text);
		}
	};
	
	//================================
	// Private vars
	//================================
	
	var jsQueue      = [];
	var loading      = [];
	var showWarnings = true;
	
	//================================
	// Interface
	//================================
	
	return {
		js:            js,
		onLoad:        onLoad,
		allowWarnings: allowWarnings
	};
	
}();
