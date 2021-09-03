// QQDOC

class Hold {

	#isActive;
	#time;
	#pointer;
	#holdTime = 1;

	constructor() {
		this.clear();
	}

	clear() {
		this.#isActive = false;
		this.#time = 0;
		this.#pointer = null;
	}

	set(pointer) {
		this.#isActive = true;
		this.#time = 0;
		this.#pointer = pointer;
	}

	getPointer() {
		return this.#pointer;
	}

	tick(delta) {
		if ( ! this.#isActive ) {
			return false;
		}
		if ( ! this.#pointer.isNearStart() ) { 
			this.clear();
			return false;
		}
		this.#time += delta;
		return this.#time > this.#holdTime;
	}

}

export function ClickableMix(base) { // Mix ClickableMix to base
	return class ClickableMix extends base {
		
		#onClickDownFn; // On click down function
		#onClickUpFn; // On click up function
		#onClickFn; // On click function
		#onClickHoldFn; // On click hold function
		#isClickable; // Is clickable
		#pointer; // TODO: Multi click?
		#hold = new Hold();
		
		constructor(options = {}) {
			super(options);
			this.#reset(options);
		}
		
		reset(options = {}) { // {O}
			super.reset(options);
			this.#reset(options);
		} // void
		
		#reset(options) {
			this.#pointer = null;
			this.#onClickDownFn = options.onClickDown ?? null;
			this.#onClickUpFn = options.onClickUp ?? null;
			this.#onClickFn = options.onClick ?? null;
			this.#onClickHoldFn = options.onClickHold ?? null;
			this.#isClickable = Boolean(
				options.isClickable ||
				this.#onClickDownFn ||
				this.#onClickUpFn ||
				this.#onClickFn ||
				this.#onClickHoldFn
			);
		} // void

		tick(delta) {
			super.tick(delta);
			if ( this.#hold.tick(delta) ) {
				this.onClickHold(
					this.#hold.getPointer().getWorldPoint(),
					this.#hold.getPointer()
				);
				this.#hold.clear();
			}
		} // void
		
		onClickDown(worldPoint, pointer) { // {V}
			//this.debugPointConvertings(worldPoint);
			this.#pointer = pointer;
			this.#hold.set(pointer);
			this.#onClickDownFn?.(worldPoint);
		} // void
		
		onClickUp(worldPoint, pointer) { // {V}
			this.#onClickUpFn?.(worldPoint);
		} // void
		
		onClick(worldPoint, pointer) { // {V}
			this.#onClickFn?.(worldPoint);
		} // void
		
		onClickHold(worldPoint, pointer) { // {V}
			this.#onClickHoldFn?.(worldPoint);
		} // void

		isClickable() {
			return this.#isClickable;
		} // boolean
		
		isClickHolding() {
			return this.#pointer?.isNearStart() === true;
		} // boolean
		
		couldClick(worldPoint) {
				return this.#isClickable && this.isContains(worldPoint);
		} // boolean

	}
} // class ClickableMix extends base
