const QQ = {};

QQ.start = function(cfg) {
	window.addEventListener('load', () => {
		
		function main() {
			while ( document.body.firstChild ) {
				document.body.removeChild( document.body.firstChild );
			}
			new QQ.Application(cfg);
		}
		
		if ( window.cordova ) {
			document.addEventListener('deviceready', () => {
				main();
			}, false);
		} else {
			main();
		}
	});
};

QQ.mixins = function(...mixins) {
	let base = mixins[mixins.length-1];
	for ( let i = 0; i < mixins.length-1; ++i ) {
		base = mixins[i](base);
	}
	return base;
};

QQ.changeBaseProto = function(obj, target) {
	if ( obj instanceof Object ) {
		let proto = Object.getPrototypeOf(obj);
		if ( proto === Object.getPrototypeOf({}) ) {
			Object.setPrototypeOf(obj, target);
		} else {
			QQ.changeBaseProto(proto, target);
		}
	}
};

QQ.default = function(value, byDefault) {
	if ( value === undefined ) { 	
		return byDefault;
	}
	return value;
};

