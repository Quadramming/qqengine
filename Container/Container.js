QQ.Container = class Container {
	
	//================================================================
	// Constructor
	//================================================================
	
	constructor(options) {
		this._app         = options.app;
		this._position    = new QQ.Point(0, 0);
		if ( options.position ) {
			this._position.copy(options.position);
		}
		this._size        = new QQ.Point(1, 1);
		if ( options.size ) {
			this._size.copy(options.size);
		}
		this._scale       = new QQ.Scale(1, 1);
		if ( options.scale ) {
			this._scale.copy(options.scale);
		}
		this._anchor      = new QQ.Point(0, 0);
		if ( options.anchor ) {
			this._anchor.copy(options.anchor);
		}
		this._angle       = QQ.default(options.angle, 0);
		this._subjects    = [];
		this._parent      = QQ.default(options.parent, null);
		this._isClickable = QQ.default(options.isClickable, true);
		this._z           = QQ.default(options.z, 0);
		this._world       = QQ.default(options.world, null);
	}
	
	//================================================================
	// On actions
	//================================================================
	
	onClickDown(worldPoint) {
		this.deleteMe();
		const local = this.worldToLocalPoint(worldPoint);
		c(local);
	}
	
	onClickUp(worldPoint) {
	}
	
	onClick(worldPoint) {
	}
	
	//================================================================
	// Matrix and convertations
	//================================================================
	
	getMatrix(withParent = true) {
		let M = QQ.Matrix.getScale(this._scale);
			M = QQ.Matrix.mul(QQ.Matrix.getRotate(this._angle), M);
			M = QQ.Matrix.mul(QQ.Matrix.getMove(this._position), M);
			if ( this._parent && withParent ) {
				M = QQ.Matrix.mul(this._parent.getMatrix(), M);
			}
		return M;
	}
	
	worldToLocalPoint(point) {
		let M = this.getMatrix();
		M = QQ.Matrix.mul(
			QQ.Matrix.inverse(M),
			[[point.x()],[point.y()],[1]]
		);
		return new QQ.Point(M[0][0], M[1][0]);
	}
	
	localToWorldPoint(point) {
		const M = QQ.Matrix.mul(
			this.getMatrix(),
			[[point.x()], [point.y()], [1]]
		);
		return new QQ.Point(M[0][0], M[1][0]);
	}
	
	parentToLocalPoint(point) {
		let M = this.getMatrix(false);
		M = QQ.Matrix.mul(
			QQ.Matrix.inverse(M),
			[[point.x()],[point.y()],[1]]
		);
		return new QQ.Point(M[0][0], M[1][0]);
	}
	
	localToParentPoint(point) {
		const M = QQ.Matrix.mul(
			this.getMatrix(false),
			[[point.x()], [point.y()], [1]]
		);
		return new QQ.Point(M[0][0], M[1][0]);
	}
	
	//================================================================
	// Tick & draw
	//================================================================
	
	tick(delta) {
		this.forChildren( (subj) => subj.tick(delta) );
	}
	
	draw(ctx) {
		ctx.transform(this.getMatrix());
		//this._drawLocalBorder(ctx);
		this.forChildren( (subj) => subj.draw(ctx) );
	}
	
	//================================================================
	// Relationships
	//================================================================
	
	addSubject(subj) {
		subj.setWorld(this._world);
		subj.setParent(this);
		this._subjects.push(subj);
	}
	
	deleteSubject(subj) {
		const i = this._subjects.indexOf(subj);
		if ( i >= 0 ) {
			this._subjects.splice(i, 1);
		}
	}
	
	cleanRelationships() {
		this._parent = null;
		this._world = null;
		this.forChildren((subj) => {
			subj.cleanRelationships();
		});
		this._subjects = [];
	}
	
	deleteMe() {
		if ( this._parent ) {
			this._parent.deleteSubject(this);
			this.cleanRelationships();
		}
	}
	
	forAllSubjects(fn) {
		fn(this);
		this.forChildren(fn);
	}
	
	forChildren(fn) {
		for ( const subject of this._subjects ) {
			subject.forAllSubjects(fn);
		}
	}
	
	setParent(parent) {
		this._parent = parent;
	}
	
	setWorld(world) {
		this._world = world;
		this.forChildren( (subj) => subj.setWorld(world) );
	}
	
	//================================================================
	// Gets
	//================================================================
	
	isClickable() {
		return this._isClickable;
	}
	
	isHit(worldPoint) {
		const local = this.worldToLocalPoint(worldPoint);
		const rect  = this._getLocalRect();
		return rect.isContains(local);
	}
	
	getPosition() {
		return this._position;
	}
	
	getAngle() {
		return this._angle;
	}
	
	getScale() {
		return this._scale;
	}
	
	getSize() {
		return this._size;
	}
	
	getZ() {
		return this._z;
	}
	
	getBounds() {
		const rect = this._getLocalRect();
		return QQ.Rect.fromPoints([
			this.localToWorldPoint(new QQ.Point(rect.left(),  rect.top())),
			this.localToWorldPoint(new QQ.Point(rect.right(), rect.top())),
			this.localToWorldPoint(new QQ.Point(rect.left(),  rect.bottom())),
			this.localToWorldPoint(new QQ.Point(rect.right(), rect.bottom()))
		]);
	}
	
	//================================================================
	// Sets
	//================================================================
	
	addPosition(offset) {
		this._position.add(offset);
	}
	
	movePosition(offset) {
		this.addPosition(offset);
	}
	
	setPosition(point) {
		this._position = point;
	}
	
	setAngle(a) {
		this._angle = a;
	}
	
	setSize(size) {
		this._size.copy(size);
	}
	
	setZ(value) {
		this._z = value;
	}
	
	fitInRect(rect) {
		this._anchor.set(0, 0);
		this.setSize(new QQ.Point(
			rect.right()  - rect.left(),
			rect.bottom() - rect.top()
		));
		this._position.set(rect.left(), rect.top());
		this._angle  = 0;
	}
	
	//================================================================
	// Private
	//================================================================
	
	_getLocalRect() {
		return new QQ.Rect(
			-this._size.w()*this._anchor.x(),
			-this._size.h()*this._anchor.y(),
			this._size.w(),
			this._size.h()
		);
		
	}
	
	_drawLocalBorder(ctx) {
		const rect  = this._getLocalRect();
		const context = ctx.get();
		context.beginPath();
		context.rect(
			rect.x(),
			rect.y(),
			rect.w(),
			rect.h()
		);
		context.lineWidth   = 1;
		context.strokeStyle = '#000000';
		context.stroke();
	}
	
};
