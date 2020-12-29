// QQDOC

export function SortByZMix(base) {
	return class SortByZMix extends base {
	
		#isSortByZOnAddSubject;
		#isSortByZOnTick;
		
		constructor(options = {}) {
			super(options);
			this.#reset(options);
		}
		
		reset(options = {}) {
			super.reset(options);
			this.#reset(options);
		} // Void
		
		#reset(options) {
			this.#isSortByZOnAddSubject = options.isSortByZOnAdd ?? true;
			this.#isSortByZOnTick = options.isSortByZOnTick ?? false;
		} // Void
		
		tick(delta) { // {O}
			super.tick(delta);
			if ( this.#isSortByZOnTick ) this.sortByZ();
		}
		
		addSubject(subj) { // {O}
			super.addSubject(subj);
			if ( this.#isSortByZOnAddSubject ) this.#sortByZ();
		} // Void
		
		sortByZ() { // {V}
			this.forChildren( subj => subj.sortByZ() );
			this.#sortByZ();
		} // Void
		
		#sortByZ() {
			const copy = [...this.subjects()];
			this.subjects().sort( (a, b) => {
				const cmp = a.z() - b.z();
				return cmp !== 0 ? cmp : copy.indexOf(a) - copy.indexOf(b);
			});
		} // Void
		
	}
}
