// QQDOC

export class Time {
	
	#time; // Time value
	
	constructor() {
		this.#time = Date.now();
	}
	
	now() {
		return this.#time;
	} // number
	
	update() {
		const previousTime = this.#time;
		this.#time = Date.now();
		const diff = this.#time - previousTime;
		return diff / 1000;
	} // number
	
}
