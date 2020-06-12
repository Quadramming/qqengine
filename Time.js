export class Time {
	
	constructor() {
		this._time = Date.now();
	}
	
	now() {
		return this._time;
	}
	
	update() {
		const previousTime = this._time;
		this._time = Date.now();
		const diff = this._time - previousTime;
		return diff / 1000;
	}
	
}
