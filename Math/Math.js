QQ.Math = {};

QQ.Math.rand = function(min, max, round = true) {
	if ( round ) {
		return Math.round(Math.random() * (max - min)) + min;
	} else {
		return Math.random() * (max - min) + min;
	}
};

QQ.Math.any = function(a, b) {
	return Math.random() < 0.5 ? a : b;
};

QQ.Math.randDispersion = function(x) {
	return x * Math.random() * QQ.Math.any(1,-1);
};

QQ.Math.increaseToRatio = function(size, target) {
	if ( size.getRatio() < target ) {
		return new QQ.Point(size.height()*target, size.height());
	} else {
		return new QQ.Point(size.width(), size.width()/target);
	}
};

QQ.Math.reduceToSize = function(size, value) {
	const scale = new QQ.Scale(1, 1);
	const scaleW = 1;
	const scaleH = 1;
	if ( size.width() > value ) {
		scale.width(value / size.width());
	}
	if ( size.height() > value ) {
		scale.height(value / size.height());
	}
	return Math.min(scale.w(), scale.h());
};

QQ.Math.scaleToSize = function(size, value) {
	const scale = new QQ.Scale(
		value / size.width(),
		value / size.height()
	);
	return Math.min(scale.w(), scale.h());
};

QQ.Math.devidePeriod = function(v, period) {
	if ( v > period ) {
		v %= period;
	}
	return v;
};

QQ.Math.devideAngle = function(angle) {
	if ( angle > Math.PI ) {
		angle -= Math.PI*2;
	}
	if ( angle < -Math.PI ) {
		angle += Math.PI*2;
	}
	return angle;
};

QQ.Math.sinBetweenVectors = function(A, B) {
	const mul  = A.x()*B.x() + A.y()*B.y();
	const cos  = mul / (A.getLength() * B.getLength());
	let   arg  = 1 - cos*cos;
	if ( arg < 0 ) {
		arg = 0;
	} 
	return Math.sqrt(arg);
};

QQ.Math.calcProgress = function(start, duration) {
	const passed   = Date.now() - start;
	const progress = passed / duration;
	return progress < 1 ? progress : 1;
};

QQ.Math.getSign = function(x) { 
	 return x >= 0 ? 1 : -1;
 };
 
QQ.Math.secToMs = function(x) { 
	 return x * 1000;
 };

QQ.Math.calcPivotX = function(p, x, w) {
	const pivot = QQ.Math.pivot;
	if ( p === pivot.CENTERTOP ) {
		return x;
	} else if ( p === pivot.CENTERBOTTOM ) {
		return x;
	} else if ( p === pivot.CENTER ) {
		return x;
	} else if ( p === pivot.LEFTTOP ) {
		return x + w/2;
	}
};

QQ.Math.calcPivotY = function(p, y, h, yAxis = 1) {
	const pivot = QQ.Math.pivot;
	if ( p === pivot.CENTERTOP ) {
		return y - (yAxis)*(h/2);
	} else if ( p === pivot.CENTERBOTTOM ) {
		return y + (yAxis)*(h/2);
	} else if ( p === pivot.CENTER ) {
		return y;
	} else if ( p === pivot.LEFTTOP ) {
		return y - (yAxis)*(h/2);
	}
};

QQ.Math.isEqual = function(a, b, epsilon) {
	return a < b+epsilon && a > b-epsilon;
};

QQ.Math.PIx2 = Math.PI * 2;

QQ.Math.pivot = {
	NONE         : 1,
	CENTER       : 2,
	LEFTTOP      : 3,
	CENTERBOTTOM : 4,
	CENTERTOP    : 5
};
