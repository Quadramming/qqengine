import * as QQ from '../QQ.js';

function reset(options = {}) {
	this._parent = QQ.useDefault(options.parent, null);
	this._subjects = [];
}

export function RelationshipMix(base) {
	return class RelationshipMix extends base {
		
		constructor(options) {
			super(options);
			this._parent = undefined;
			this._subjects = undefined;
			reset.call(this, options);
		}
		
		reset(options) {
			super.reset(options);
			reset.call(this, options);
		}
		
		parent(parent) {
			if ( parent !== undefined ) {
				this._parent = parent;
			}
			return this._parent;
		}
		
		subjects() {
			return this._subjects;
		}
		
		addSubject(subj) {
			subj.parent(this);
			this._subjects.push(subj);
		}
		
		deleteSubjects() {
			this.forSubjects(
				subj => subj.delete()
			);
		}
		
		spliceSubject(subj) {
			const i = this._subjects.indexOf(subj);
			if ( i >= 0 ) {
				this._subjects.splice(i, 1);
			}
		}
		
		cleanRelationships() {
			this.forSubjects(
				subj => subj.cleanRelationships()
			);
			if ( this._parent ) {
				this._parent.spliceSubject(this);
			}
			reset.call(this);
		}
		
		delete() {
			this.cleanRelationships();
			return null; // For subj = subj.delete();
		}
		
		forAllSubjects(fn) {
			this.forSubjects(subj => {
				fn(subj);
				subj.forAllSubjects(fn);
			});
		}
		
		forSubjects(fn) {
			// delete() in fn can change subjects array
			// that why copy first
			for ( const subj of [...this._subjects] ) {
				fn(subj);
			}
		}
		
	}
}
