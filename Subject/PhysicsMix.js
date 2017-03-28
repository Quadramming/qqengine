QQ.Subject.PhysicsMix = base => class PhysicsMix extends base {
	
	constructor(app, width, height) {
		super(app, width, height);
		this._physicsBody = null;
	}
	
	tick(delta) {
		super.tick();
		this.setPosition(
			this._physicsBody.position.x,
			this._physicsBody.position.y
		);
		this._angle = this._physicsBody.angle;
	}
	
	isPhysics() {
		return true;
	}
	
	setDefaultPhysics(options) {
		this._physicsBody = Matter.Bodies.rectangle(
			this._x,     this._y,
			this._width, this._height,
			options
		);
	}
	
	setPhysics(x, y, w, h, options) {
		this._physicsBody = Matter.Bodies.rectangle(x, y, w, h, options);
	}
	
	getPhysicsBody() {
		return this._physicsBody;
	}
	
};
