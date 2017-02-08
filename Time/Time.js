QQ.Time = class Time {
	
	constructor() {
		this._nowTime = Date.now();
	}
	
	now() {
		return this._nowTime;
	}
	
	update() {
		const prevTime = this._nowTime;
		this._nowTime  = Date.now();
		const diff     = this._nowTime - prevTime;
		return diff / 1000;
	}
	
};
