// QQDOC

import * as Seizure from '../Seizure/index.js';
import {FN} from '../CONST/FN.js';

export function RelationshipMix(base) { // Mix RelationshipMix to base
	return class RelationshipMix extends base {
		
		#subjects = [];
		#parent;
		
		constructor(options = {}) {
			super(options);
			this.#reset(options);
		}
		
		destructor() {
			super.destructor?.();
			this.deleteSubjects();
			this.cleanRelationships();
		}
		
		reset(options = {}) { // {O}
			super.reset(options);
			this.#reset(options);
		} // void
		
		#reset(options) {
			this.parent(options.parent ?? null);
			this.#subjects = [];
			if ( options.selfAdd === true ) {
				this.#parent.addSubject(this);
			}
			if ( options.addTo ) {
				this.parent(options.addTo);
				this.#parent.addSubject(this);
			}
		} // void
		
		getWorld() {
			return this.#parent.getWorld();
		} // World
		
		getFilteredSubjects(condition) {
			return this.#subjects.filter(condition);
		} // new array
		
		getAllSubjects(predicate = FN.TRUE) {
			const subjs = [];
			this.forAllSubjects( subj => {
				if ( predicate(subj) ) subjs.push(subj);
			});
			return subjs;
		} // new array
		
		getSubject(predicate = FN.TRUE) {
			this.sortByZ?.();
			for ( const subj of this.#subjects ) {
				if ( predicate(subj) ) return subj;
				const found = subj.getSubject(predicate);
				if ( found ) return found;
			}
			return null;
		} // null | Subject
		
		getSubjects() {
			return this.#subjects;
		} // array
		
		addSubject(...subjs) {
			for ( const subj of subjs ) {
				subj.parent(this);
				this.#subjects.push(subj);
			}
		} // void
		
		cleanRelationships() {
			this.#parent?.stealSubject(this);
			this.#reset({})
		} // void
		
		deleteSubjects() { // Destruct all my subjects
			this.forSubjects(
				subj => subj.destructor()
			);
		} // void
		
		forAllSubjects(fn) { // For all subjects down in hierarchy
			this.forSubjects(subj => {
				subj.forAllSubjects(fn);
				fn(subj);
			});
		} // void
		
		forSubjects(fn) { // For my subjects
			// fn() can change subjects array, so copy first
			for ( const subj of [...this.#subjects] ) {
				fn(subj);
			}
		} // void
		
		stealSubject(subj) { // Steal subj from my subjects
			const i = this.#subjects.indexOf(subj);
			if ( i >= 0 ) {
				let what = this.#subjects.splice(i, 1)[0];
				what.parent(null);
				return what;
			}
			throw Error('stealSubject() problem');
		} // void
		
		deattach() { // Detach me from parent
			this.#parent.stealSubject(this);
		} // void
		
		parent(parent) { // {F}
			if ( parent !== undefined ) {
				if ( parent instanceof Seizure.Seizure ) {
					parent = parent.getWorld().getStage();
				}
				this.#parent = parent;
			}
			return this.#parent;
		} // Subject
		
	}
} // class RelationshipMix extends base
