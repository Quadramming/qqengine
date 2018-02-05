const QQ = {};

QQ.start = function(cfg) {
	const start = () => {QQ.initApp(cfg);};
	if ( window.cordova ) {
		document.addEventListener('deviceready', start, false);
	} else {
		window.addEventListener('load', start);
	}
};

QQ.initApp = function(cfg) {
	while ( document.body.firstChild ) {
		document.body.removeChild( document.body.firstChild );
	}
	new QQ.Application(cfg);
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

QQ.clone = function(obj) {
	return Object.assign({}, obj);
};

QQ.default = function(value, byDefault) {
	if ( value === undefined ) {
		return byDefault;
	}
	return value;
};

QQ.merge = function(...objs) {
		return Object.assign({}, ...objs);
};

QQ.isNumbers = function(...args) {
	for ( const arg of args ) {
		if ( typeof arg !== 'number' ) {
			return false;
		}
	}
	return true;
};

QQ.setTransform = function(ctx, M) {
	ctx.setTransform(M[0][0], M[1][0], M[0][1], M[1][1], M[0][2], M[1][2]);
};

QQ.cleanTransform = function(ctx) {
	ctx.setTransform(1,0,0,1,0,0);
};

QQ.getPixel = function(data, size, point) {
	if ( point.x() >= size.x() || point.y() >= size.y() ) {
		return null;
	}
	const index = (point.y()*size.x() + point.x())*4;
	return {
		r: data[index],
		g: data[index+1],
		b: data[index+2],
		a: data[index+3]
	};
};

QQ.makeCanvas = function(size) {
		const cvs = document.createElement('canvas');
		cvs.width  = size.w();
		cvs.height = size.h(); 
		const ctx = cvs.getContext('2d');
		const getPixels = () => 
			ctx.getImageData(0, 0, size.w(), size.h()).data
		;
		return {cvs, size, ctx, getPixels};
};
