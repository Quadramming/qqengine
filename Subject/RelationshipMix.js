// QQDOC
// TD

import * as Seizure from '../Seizure/index.js';

// TOFIX think destructor reset clean etc

export function RelationshipMix(base) { // Mix Relationship to base
	return class RelationshipMix extends base {
		
		#parent;
		#subjects = [];
		
		constructor(options = {}) {
			super(options);
			this.#reset(options);
		}
		
		destructor() {
			c('destructor');
			super.destructor?.();
			this.cleanRelationships();
			// TODO destruct All ?
		}
		
		reset(options = {}) {
			super.reset(options);
			this.#reset(options);
		}
		
		#reset(options) {
			this.parent(options.parent ?? null);
			this.#subjects.length = 0;
			if ( options.selfAdd === true ) {
				this.parent().addSubject(this);
			}
			if ( options.addTo ) {
				this.parent(options.addTo);
				this.parent().addSubject(this);
			}
		}
		
		getWorld() {
			return this.parent().getWorld();
		}
		
		parent(parent) { // {F}
			if ( parent !== undefined ) {
				if ( parent instanceof Seizure.Seizure ) {
					parent = parent.getWorld().getStage();
				}
				this.#parent = parent;
			}
			return this.#parent;
		}
	
		getFilteredSubjects(condition) {
			return this.#subjects.filter(condition);
		}
		
		addSubject(...subjs) {
			for ( const subj of subjs ) {
				subj.parent(this);
				this.#subjects.push(subj);
			}
		}
		
		deleteSubjects() {
			this.forSubjects(
				subj => subj.destructor()
			);
		} // Void
		
		stealSubject(subj) {
			const i = this.#subjects.indexOf(subj);
			if ( i >= 0 ) {
				let what = this.#subjects.splice(i, 1).pop();
				what.parent(null);
				return what;
			}
			throw Error('stealSubject() problem');
		}
		
		spliceSubject(subj) {
			const i = this.#subjects.indexOf(subj);
			if ( i >= 0 ) {
				this.#subjects.splice(i, 1);
			}
		}
		
		cleanRelationships() {
			this.#parent?.spliceSubject(this);
			this.#reset({})
		}
		
		cleanRelationshipsHierarchy() {
			this.forSubjects(
				subj => subj.cleanRelationships()
			);
			this.#parent?.spliceSubject(this);
			this.#reset({})
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
			for ( const subj of [...this.#subjects] ) {
				fn(subj);
			}
		}
		
		getAllSubjects(predicate = () => true) {
			const subjs = [];
			this.forAllSubjects( subj => {
				if ( predicate(subj) ) subjs.push(subj);
			});
			return subjs;
		} // new array
		
		getSubject(predicate = () => true) {
			// TODO FIX z order
			for ( const subj of this.#subjects ) {
				if ( predicate(subj) ) return subj;
				const found = subj.getSubject(predicate);
				if ( found ) return found;
			}
			return null;
		} // null | Subject
		
		getSubjects() {
			return this.#subjects;
		}
		
	}
} // class RelationshipMix extends base
