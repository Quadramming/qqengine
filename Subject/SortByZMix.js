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
		} // void
		
		#reset(options) {
			this.#isSortByZOnAddSubject = options.isSortByZOnAdd ?? true;
			this.#isSortByZOnTick = options.isSortByZOnTick ?? false;
		} // void
		
		tick(delta) { // {O}
			super.tick?.(delta);
			if ( this.#isSortByZOnTick ) this.sortByZ();
		} // void
		
		addSubject(...subj) { // {O}
			super.addSubject(...subj);
			if ( this.#isSortByZOnAddSubject ) this.#sortByZ();
		} // void
		
		sortByZ() { // {V}
			this.#sortByZ();
			this.forChildren( subj => subj.sortByZ() );
		} // void
		
		#sortByZ() {
			// TODO may be quick way? Not sure if it have sense to do
			const copy = [...this.getSubjects()];
			this.getSubjects().sort( (a, b) => {
				const cmp = a.z() - b.z();
				return cmp !== 0 ? cmp : copy.indexOf(a) - copy.indexOf(b);
			});
		} // void
		
	}
}
