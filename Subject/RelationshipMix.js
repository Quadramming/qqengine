// QQDOC

import * as QQ from '../QQ.js';
import * as Seizure from '../Seizure/index.js';

function reset(options = {}) { // Reset
	this.parent(QQ.useDefault(options.parent, null));
	this._subjects = [];
} // void

export function RelationshipMix(base) { // Mix Relationship to base
	return class RelationshipMix extends base {
		
		constructor(options) {
			super(options);
			this._parent = undefined;
			this._subjects = undefined;
			reset.call(this, options);
		}
		
		destructor() {
			super.destructor();
			this.cleanRelationships();
		}
		
		reset(options) {
			super.reset(options);
			reset.call(this, options);
		}
		
		parent(parent) {
			if ( parent !== undefined ) {
				if ( parent instanceof Seizure.Seizure ) {
					parent = parent.getWorld().getStage();
				}
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
				subj => subj.destructor()
			);
		}
		
		stealSubject(subj) {
			const i = this._subjects.indexOf(subj);
			if ( i >= 0 ) {
				let what = this._subjects.splice(i, 1).pop();
				what.parent(null);
				return what;
			}
			throw Error('stealSubject() problem');
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
		
		forAllSubjects(fn) {
			this.forSubjects(subj => {
				fn(subj);
				subj.forAllSubjects(fn);
			});
		}
		
		forSubjects(fn) {
			// destructor() in fn can change subjects array
			// that why copy first
			for ( const subj of [...this._subjects] ) {
				fn(subj);
			}
		}
		
	}
} // class RelationshipMix extends base
