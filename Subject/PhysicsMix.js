export function PhysicsMix(base) {
	return class PhysicsMix extends base {
		
		/* TOFIX
		constructor(options) {
			super(options);
			this._physicsBody = null;
			if ( options.physics ) {
				this.setDefaultPhysics(options.physics);
			}
		}
		
		tick(delta) {
			super.tick(delta);
			this.setPosition(
				this._physicsBody.position.x,
				this._physicsBody.position.y
			);
			this._angle = this._physicsBody.angle;
		}
		
		isPhysics() {
			return true;
		}
		
		setDefaultPhysics(physicsOptions) {
			this._physicsBody = Matter.Bodies.rectangle(
				this._x, this._y,
				this._width, this._height,
				physicsOptions
			);
		}
		
		setPhysics(x, y, w, h, options) {
			this._physicsBody = Matter.Bodies.rectangle(x, y, w, h, options);
		}
		
		getPhysicsBody() {
			return this._physicsBody;
		}
		*/
		
	}
}
