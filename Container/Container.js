QQ.Container = class Container {
	
	//================================================================
	// Constructor & initialize
	//================================================================
	
	constructor(options = {}) {
		this._app = undefined;
		this._position = new QQ.Point();
		this._size = new QQ.Point();
		this._scale = new QQ.Point();
		this._anchor = new QQ.Point();
		this._subjects = [];
		this._angle = undefined;
		this._parent = undefined;
		this._isClickable = undefined;
		this._z = undefined;
		this._world = undefined;
		this._updateOnTick = undefined;
		this._onContainerClick = undefined;
		this._isSortOnAddSubject = undefined;
		this._isSortOnTick = undefined;
		this._matrix = {
			cached: QQ.Matrix.getIdentity(),
			position: new QQ.Point(),
			scale: new QQ.Scale(),
			angle: undefined
		};
		Container.prototype.initialize.call(this, options, false);
	}
	
	initialize(options, initializeSuper = true) {
		this._app = QQ.default(options.app, null);
		if ( options.position ) {
			this._position.copy(options.position);
		} else {
			this._position.set(0, 0);
		}
		if ( options.size ) {
			this._size.copy(options.size);
		} else {
			this._size.set(1, 1);
		}
		if ( options.scale ) {
			this._scale.copy(options.scale);
		} else {
			this._scale.set(1, 1);
		}
		if ( options.anchor ) {
			this._anchor.copy(options.anchor);
		} else {
			this._anchor.set(0, 0);
		}
		this._subjects.length = 0;
		this._angle = QQ.default(options.angle, 0);
		this._parent = QQ.default(options.parent, null);
		this._isClickable = QQ.default(options.isClickable, true);
		this._z = QQ.default(options.z, 0);
		this._world = QQ.default(options.world, null);
		this._updateOnTick = QQ.default(options.updateOnTick, null);
		QQ.Matrix.setIdentity(this._matrix.cached);
		this._matrix.position.set(0, 0);
		this._matrix.scale.set(0, 0);
		this._matrix.angle = null;
		if ( options.init ) {
			options.init.call(this);
		}
		if ( options.onClick ) {
			this._onContainerClick = options.onClick;
		} else {
			this._onContainerClick = () => {};
		}
		this._isSortOnAddSubject = QQ.default(options.isSortOnAdd, true);
		this._isSortOnTick = QQ.default(options.isSortOnTick, false);
	}
	
	//================================================================
	// On actions
	//================================================================
	
	onClickDown(worldPoint) {
		const local = this.worldToLocalPoint(worldPoint);
	}
	
	onClickUp(worldPoint) {
	}
	
	onClick(worldPoint) {
		this._onContainerClick(worldPoint);
	}
	
	//================================================================
	// Matrix and convertations
	//================================================================
	
	calcMatrix() {
		let M;
		M = QQ.Matrix.getScale(this._scale);
		M = QQ.Matrix.mul(QQ.Matrix.getRotate(this._angle), M);
		M = QQ.Matrix.mul(QQ.Matrix.getMove(this._position), M);
		QQ.Matrix.copy(M, this._matrix.cached);
		this._matrix.position.copy(this._position);
		this._matrix.scale.copy(this._scale);
		this._matrix.angle = this._angle;
		return M;
	}
	
	getMatrix(withParent = true) {
		let M = null;
		if ( this._matrix.cached ) {
			const position = this._matrix.position.isEquals(this._position);
			const angle    = this._matrix.angle === this._angle;
			const scale    = this._matrix.scale.isEquals(this._scale);
			if ( position && angle && scale ) {
				M = this._matrix.cached;
			}
		}
		if ( M === null ) {
			M = this.calcMatrix();
		}
		if ( withParent && this._parent ) {
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
		if ( this._updateOnTick ) {
			this._updateOnTick(delta);
		}
		this.forChildren( (subj) => subj.tick(delta) );
	}
	
	draw(ctx) {
		//ctx.transform(this.getMatrix());
		//this._drawLocalBorder(ctx);
		this.forChildren( (subj) => subj.draw(ctx) );
	}
	
	tickSortByZ() {
		this.forChildren( (subj) => subj.tickSortByZ() );
		if ( this._isSortOnTick ) {
			this._sortSubjectsByZ();
		}
	}
	
	sortByZ() {
		this.forChildren( (subj) => subj.sortByZ() );
		this._sortSubjectsByZ();
	}
	
	//================================================================
	// Relationships
	//================================================================
	
	addSubject(subj) {
		subj.setWorld(this._world);
		subj.setParent(this);
		subj.setApp(this._app);
		this._subjects.push(subj);
		if ( this._isSortOnAddSubject ) {
			this._sortSubjectsByZ();
		}
	}
	
	deleteSubjects() {
		this.forChildren( (subj) => {
			subj.deleteMe();
		});
	}
	
	spliceSubject(subj) {
		const i = this._subjects.indexOf(subj);
		if ( i >= 0 ) {
			this._subjects.splice(i, 1);
		}
	}
	
	cleanRelationships() {
		if ( this._parent ) {
			this._parent.spliceSubject(this);
		}
		this._parent = null;
		this._world = null;
		this.forChildren((subj) => {
			subj.cleanRelationships();
		});
		this._subjects.length = 0; // Clean array
	}
	
	deleteMe() {
		this.cleanRelationships();
	}
	
	forAllSubjects(fn) {
		this.forChildren((child) => {
			fn(child);
			child.forAllSubjects(fn);
		});
	}
	
	forChildren(fn) {
		// deleteMe() in fn can change _subjects
		for ( const subject of [...this._subjects] ) {
			fn(subject);
		}
	}
	
	setParent(parent) {
		this._parent = parent;
	}
	
	setWorld(world) {
		this._world = world;
		this.forChildren( (subj) => subj.setWorld(world) );
	}
	
	setApp(app) {
		this._app = app;
		this.forChildren( (subj) => subj.setApp(app) );
	}
	
	//================================================================
	// Gets
	//================================================================
	
	isClickable() {
		return this._isClickable;
	}
	
	isHit(worldPoint) {
		if ( ! this._isClickable ) {
			return false;
		}
		const local = this.worldToLocalPoint(worldPoint);
		const rect  = this._getLocalRect();
		return rect.isContains(local);
	}
	
	getPosition() {
		return this._position.clone();
	}
	
	getWorldPosition() {
		return this.localToWorldPoint(new QQ.Point(0, 0));
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
	
	getAnchor() {
		return this._anchor;
	}
	
	getApp() {
		return this._app;
	}
	
	getWorld() {
		return this._world;
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
		this.setPosition( new QQ.Point(
			this._position.x() + offset.x(),
			this._position.y() + offset.y(),
		));
	}
	
	setAnchor(point) {
			this._anchor.copy(point);
	}
	
	movePosition(offset) {
		this.addPosition(offset);
	}
	
	setPosition(point) {
		this._position.copy(point);
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
	
	_sortSubjectsByZ() {
		const copy = this._subjects.slice();
		this._subjects.sort((a, b) => {
			if ( a.getZ() === b.getZ() ) {
				return copy.indexOf(a) - copy.indexOf(b);
			}
			return a.getZ() - b.getZ();
		});
	}
	
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
