const QQ = {};

QQ.initApp = function(cfg) {
	while ( document.body.firstChild ) {
		document.body.removeChild( document.body.firstChild );
	}
	new QQ.Application(cfg);
};

QQ.start = function(cfg) {
	window.addEventListener('load', () => {
		if ( window.cordova ) {
			document.addEventListener('deviceready', () => {
				QQ.initApp(cfg);
			}, false);
		} else {
			QQ.initApp(cfg);
		}
	});
};

QQ.isObject = function(obj) {
	return obj === Object(obj);
};

QQ.mixins = function(...mixins) {
	let base = mixins[mixins.length-1];
	for ( let i = 0; i < mixins.length-1; ++i ) {
		base = mixins[i](base);
	}
	return base;
};

QQ.changeBasePrototype = function(obj, target) {
	if ( obj instanceof Object ) {
		const proto = Object.getPrototypeOf(obj);
		if ( proto === Object.getPrototypeOf({}) ) {
			Object.setPrototypeOf(obj, target);
		} else {
			QQ.changeBasePrototype(proto, target);
		}
	}
};

QQ.default = function(value, byDefault) {
	if ( value === undefined ) {
		return byDefault;
	}
	return value;
};


QQ.isNumbers = function(...args) {
	for ( let arg of args ) {
		if ( typeof arg !== 'number' ) {
			return false;
		}
	}
	return true;
};