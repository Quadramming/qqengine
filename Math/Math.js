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
		return new QQ.Point(size.y()*target, size.y());
	} else {
		return new QQ.Point(size.x(), size.x()/target);
	}
};

QQ.Math.reduceToSize = function(w, h, size) {
	const scaleW = 1;
	const scaleH = 1;
	if ( w > size ) {
		scaleW = size / w;
	}
	if ( h > size ) {
		scaleH = size / h;
	}
	return scaleW < scaleH ? scaleW : scaleH;
};

QQ.Math.scaleToSize = function(w, h, size) {
	const scaleW = size / w;
	const scaleH = size / h;
	return scaleW < scaleH ? scaleW : scaleH;
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

QQ.Math.sinBetweenVectors = function(ax, ay, bx, by) {
	const mul  = ax*bx + ay*by;
	const lenA = Math.sqrt(ax*ax + ay*ay);
	const lenB = Math.sqrt(bx*bx + by*by);
	const cos  = mul / (lenA*lenB);
	let   arg  = 1 - cos*cos;
	if ( arg < 0 ) {
		arg = 0;
	} 
	return Math.sqrt(arg);
};

QQ.Math.calcDistance = function(x1, y1, x2, y2) {
	const a = x1 - x2;
	const b = y1 - y2;
	return Math.sqrt( a*a + b*b );
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

QQ.Math.isIntersect = function(box1, box2) {
	if ( box1.top < box2.bottom || box1.bottom > box2.top ) {
		return false;
	}
	if ( box1.right < box2.left || box1.left > box2.right ) {
		return false;
	}
	return true;
};

QQ.Math.isInside = function(box1, x, y) {
	if ( box1.top > y && y > box1.bottom && box1.left < x && x < box1.right ) {
		return true;
	}
	return false;
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
