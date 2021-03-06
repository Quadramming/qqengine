// QQDOC

export function SortByZMix(base) { // Mix SortByZMix to base
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
			if ( this.#isSortByZOnTick ) this.sortAllByZ();
		} // void
		
		addSubject(...subj) { // {O}
			super.addSubject(...subj);
			if ( this.#isSortByZOnAddSubject ) this.sortByZ();
		} // void
		
		sortAllByZ() { // {V} Sort whole hierarchy
			this.sortByZ();
			this.forSubjects( subj => subj.sortAllByZ() );
		} // void
		
		sortByZ() { // {V} No sort for children
			const subjs = this.getSubjects();
			let counter = 0;
			for ( const subj of subjs ) {
				subj.__SortByZMix_helper = counter++;
			}
			subjs.sort( (a, b) => {
				return a.z() - b.z() || a.__SortByZMix_helper - b.__SortByZMix_helper;
			});
		} // void
		
	}
} // class SortByZMix extends base
