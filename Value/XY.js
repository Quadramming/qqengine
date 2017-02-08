QQ.XY = class XY {
	
	constructor(x=0, y=0) {
		this._x = new QQ.Value(x);
		this._y = new QQ.Value(y);
	}
	
	clear() {
		this._x.clear();
		this._y.clear();
	}
	
	set(inX, inY) {
		this._x.v(inX);
		this._y.v(inY);
	}
	
	isClear() {
		return this._x.isClear() && this._y.isClear();
	}
	
	x(v)      { return this.width(v);  }
	X(v)      { return this.width(v);  }
	w(v)      { return this.width(v);  }
	W(v)      { return this.width(v);  }
	Width(v)  { return this.width(v);  }
	width(v)  { return this._x.v(v);   }
	
	y(v)      { return this.height(v); }
	Y(v)      { return this.height(v); }
	h(v)      { return this.height(v); }
	H(v)      { return this.height(v); }
	Height(v) { return this.height(v); }
	height(v) { return this._y.v(v);   }
	
	clearX()  { this._x.clear();       }
	clearY()  { this._y.clear();       }
	invertX() { this._x.invert();      }
	invertY() { this._y.invert();      }
	
};
