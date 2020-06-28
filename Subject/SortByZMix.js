import * as QQ from '../QQ.js';

function reset(options = {}) {
	this._isSortByZOnAddSubject = QQ.useDefault(options.isSortByZOnAdd, true);
	this._isSortByZOnTick = QQ.useDefault(options.isSortByZOnTick, false);
}

export function SortByZMix(base) {
	return class SortByZMix extends base {
		
		constructor(options) {
			super(options);
			this._isSortByZOnAddSubject = undefined;
			this._isSortByZOnTick = undefined;
			reset.call(this, options);
		}
		
		reset(options) {
			super.reset(options);
			reset.call(this, options);
		}
		
		tick(delta) {
			if ( this._isSortByZOnTick ) {
				this._sortByZ();
			}
		}
		
		addSubject(subj) {
			super.addSubject(subj);
			if ( this._isSortByZOnAddSubject ) {
				this._sortByZ();
			}
		}
		
		sortByZ() {
			this.forChildren( subj => subj.sortByZ() );
			this._sortByZ();
		}
		
		_sortByZ() {
			const copy = [...this.subjects()];
			this.subjects().sort( (a, b) => {
				if ( a.getZ() === b.getZ() ) {
					return copy.indexOf(a) - copy.indexOf(b);
				}
				return a.getZ() - b.getZ();
			});
		}
		
	}
}
