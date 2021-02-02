// QQDOC

export function ClickableMix(base) { // Mix ClickableMix to base
	return class ClickableMix extends base {
		
		#onClickDownFn; // On click down function
		#onClickUpFn; // On click up function
		#onClickFn; // On click function
		#isClickable; // Is clickable
		
		constructor(options = {}) {
			super(options);
			this.#reset(options);
		}
		
		reset(options = {}) { // {O}
			super.reset(options);
			this.#reset(options);
		} // void
		
		#reset(options) {
			this.#onClickDownFn = options.onClickDown ?? null;
			this.#onClickUpFn = options.onClickUp ?? null;
			this.#onClickFn = options.onClick ?? null;
			this.#isClickable = Boolean(
				options.isClickable ||
				options.onClickDown ||
				options.onClickUp ||
				options.onClick
			);
		} // void
		
		onClickDown(worldPoint, pointer) { // {V}
			//this.debugPointConvertings(worldPoint);
			this.#onClickDownFn?.(worldPoint);
		} // void
		
		onClickUp(worldPoint, pointer) { // {V}
			this.#onClickUpFn?.(worldPoint);
		} // void
		
		onClick(worldPoint, pointer) { // {V}
			this.#onClickFn?.(worldPoint);
		} // void
		
		isClickable() {
			return this.#isClickable;
		} // boolean
		
		couldClick(worldPoint) {
				return this.#isClickable && this.isContains(worldPoint);
		} // boolean
	
	}
} // class ClickableMix extends base
