QQ.Container = class Container {
	
	constructor() {
		this._subjects = [];
	}
	
	addSubject(subj) {
		this._subjects.push(subj);
	}
	
	forAllSubjects(fn) {
		for ( let subject of this._subjects ) {
			fn(subject);
		}
	}
	
	setWorld(world) {
		this.forAllSubjects( (subj) => subj.setWorld(world) );
	}
	
	tick() {
		this.forAllSubjects( (subj) => subj.tick() );
	}
	
	draw(ctx) {
		this.forAllSubjects( (subj) => subj.draw(ctx) );
	}
	
	getBoundsRect() {
		return {
			left:   0,
			top:    0,
			right:  0,
			bottom: 0
		};
	}
	
	getZ() {
		return 1;
	}
	
};
