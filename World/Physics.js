QQ.World.Physics = class Physics extends QQ.World.Base {
	//================================================================
	// RECONSTRUCTION
	//================================================================
	/*
	constructor(settings) {
		super(settings);
		this._collisions                 = [];
		this._physics                    = Matter.Engine.create();
		this._physics.velocityIterations =  4;
		this._physics.positionIterations =  4;
		this._physics.world.gravity.y    = -1;
		this._physics.timing.timeScale   =  1;
		
		const fillCollisions = (collisions) => {
			for ( const pair of collisions.pairs ) {
				this._collisions.push(pair);
			}
		};
		Matter.Events.on(this._physics, 'collisionStart',  fillCollisions);
		Matter.Events.on(this._physics, 'collisionActive', fillCollisions);
	}
	
	tick(delta) {
		this._collisions = [];
		Matter.Engine.update(
				this._physics,
				QQ.Math.secToMs(delta)
			);
	}
	
	addSubject(subj) {
		super.addSubject(subj);
		if ( subj.isPhysics ) {
			Matter.World.add(this._physics.world, [subj.getPhysicsBody()]);
		}
	}
	
	getSubjectByPhysics(body) {
		for ( const subj of this._subjects ) {
			if ( subj.isPhysics && subj.getPhysicsBody() === body ) {
				return subj;
			}
		}
	}
	
	getPhysics() {
		return this._physics;
	}
	
	getCollisions() {
		return this._collisions;
	}
	
	deleteSubject(subj) {
		const i = this._subjects.indexOf(subj);
		if ( this._subjects[i].isPhysics ) {
			Matter.Composite.remove(
					this._physics.world,
					this._subjects[i].getPhysicsBody()
				);
		}
		super.deleteSubject(subj);
	}
	*/
};
