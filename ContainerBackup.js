import * as QQ from './QQ.js';
import * as CONST from './CONST/index.js';
import * as Matrix from './matrix.js';
import {Point, Scale, Size, Rect, Offset} from './primitives/index.js';

// To Pack

export class Container {
	
	//================================================================
	// Constructor & initialize
	//================================================================
	
	constructor(options = {}) {
		this._parent = undefined;
		this._subjects = [];
		this._world = undefined;
		this._seizure = undefined;
		
		this._position = new Point(0, 0);
		this._z = undefined;
		this._size = new Size(1, 1);
		this._scale = new Scale(1, 1);
		this._anchor = new Point(0.5, 0.5);
		this._angle = undefined;
		
		this._updateOnTick = undefined;
		
		this._onContainerClick = undefined;
		this._isClickable = undefined;
		
		this._isSortOnAddSubject = undefined;
		this._isSortOnTick = undefined;
		
		// add anchor
		this._matrix = {
			cached: Matrix.getIdentity(),
			position: new Point(),
			scale: new Scale(),
			angle: undefined
		};
		
		this._initializeContainer(options);
	}
	
	initialize(options) {
		this._initializeContainer(options);
	}
	
	_initializeContainer(options) {
		this._parent = QQ.useDefault(options.parent, null);
		this._subjects.length = 0;
		this._world = QQ.useDefault(options.world, null);
		this._seizure = QQ.useDefault(options.seizure, null);
		
		if ( options.position ) {
			this._position.copy(options.position);
		} else {
			this._position.set(0, 0);
		}
		this._z = QQ.useDefault(options.z, 0);
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
			this._anchor.set(0.5, 0.5);
		}
		this._angle = QQ.useDefault(options.angle, 0);
		
		this._updateOnTick = QQ.useDefault(options.updateOnTick, null);
		
		if ( options.onClick ) {
			this._onContainerClick = options.onClick;
			this._isClickable = true;
		} else {
			this._onContainerClick = CONST.FN.IDLE;
			this._isClickable = QQ.useDefault(options.isClickable, false);
		}
		
		this._isSortOnAddSubject = QQ.useDefault(options.isSortOnAdd, true);
		this._isSortOnTick = QQ.useDefault(options.isSortOnTick, false);
		
		Matrix.setIdentity(this._matrix.cached);
		this._matrix.position.set(0, 0);
		this._matrix.scale.set(0, 0);
		this._matrix.angle = null;
		if ( options.init ) {
			options.init.call(this);
		}
		if ( options.selfAdd === true ) {
			this._seizure.addSubject(this);
		}
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
		const position = this._position.clone();
		const offset = new Offset(
			-this._size.x()*this._anchor.x(),
			-this._size.y()*this._anchor.y()
		);
		let M;
		M = Matrix.getMove(offset);
		M = Matrix.mul(Matrix.getScale(this._scale), M);
		M = Matrix.mul(Matrix.getRotate(this._angle), M);
		M = Matrix.mul(Matrix.getMove(this._position), M);
		Matrix.copy(M, this._matrix.cached);
		this._matrix.position.copy(this._position);
		this._matrix.scale.copy(this._scale);
		this._matrix.angle = this._angle;
		return M;
	}
	
	getMatrix(withParent = true) {
		let M = null;
		if ( M === null ) {
			M = this.calcMatrix();
		}
		if ( withParent && this._parent ) {
			M = Matrix.mul(this._parent.getMatrix(), M);
		}
		return M;
		// TOFIX need cache + Pack
		M = null;
		if ( this._matrix.cached ) {
			const position = this._matrix.position.isEquals(this._position);
			const angle = this._matrix.angle === this._angle;
			const scale = this._matrix.scale.isEquals(this._scale);
			if ( position && angle && scale ) {
				M = this._matrix.cached;
			}
		}
		return M;
	}
	
	worldToLocalPoint(point) {
		const M = Matrix.mul(
			Matrix.inverse( this.getMatrix() ),
			[[point.x()], [point.y()], [1]]
		);
		return new Point(M[0][0], M[1][0]);
	}
	
	localToWorldPoint(point) {
		const M = Matrix.mul(
			this.getMatrix(),
			[[point.x()], [point.y()], [1]]
		);
		return new Point(M[0][0], M[1][0]);
	}
	
	parentToLocalPoint(point) {
		const M = Matrix.mul(
			Matrix.inverse(this.getMatrix(false)),
			[[point.x()],[point.y()],[1]]
		);
		return new Point(M[0][0], M[1][0]);
	}
	
	localToParentPoint(point) {
		const M = Matrix.mul(
			this.getMatrix(false),
			[[point.x()], [point.y()], [1]]
		);
		return new Point(M[0][0], M[1][0]);
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
	
	draw(context) {
		//this._drawWorldBorder(context);
		//this._drawLocalBorder(context);
		this.forChildren( (subj) => subj.draw(context) );
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
		return null;
	}
	
	forAllSubjects(fn) {
		this.forChildren((child) => {
			fn(child);
			child.forAllSubjects(fn);
		});
	}
	
	forChildren(fn) {
		// deleteMe() in fn can change _subjects
		// that why copy first
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
	
	//================================================================
	// Gets
	//================================================================
	
	getSubjects() {
		return this._subjects;
	}
	
	isClickable() {
		return this._isClickable;
	}
	
	isHit(worldPoint) {
		if ( ! this._isClickable ) {
			return false;
		}
		const local = this.worldToLocalPoint(worldPoint);
		const rect = this._getLocalRect();
		return rect.isContains(local);
	}
	
	getPosition() {
		return this._position.clone();
	}
	
	getWorldPosition() {
		return this.localToWorldPoint(new Point(0, 0));
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
	
	getWorld() {
		return this._world;
	}
	
	getBounds() {
		const rect = this._getLocalRect();
		return Rect.fromPoints(
			this.localToWorldPoint(new Point(rect.left(), rect.top())),
			this.localToWorldPoint(new Point(rect.right(), rect.top())),
			this.localToWorldPoint(new Point(rect.left(), rect.bottom())),
			this.localToWorldPoint(new Point(rect.right(), rect.bottom()))
		);
	}
	
	//================================================================
	// Sets
	//================================================================
	
	addPosition(offset) {
		this.setPosition( new Point(
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
		this.setSize(new Point(
			rect.right() - rect.left(),
			rect.bottom() - rect.top()
		));
		this._position.set(rect.left(), rect.top());
		this._angle = 0;
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
		return new Rect(0, 0, this._size.w(), this._size.h());
	}
	
	_drawWorldBorder(context) {
		context.cleanTransform();
		const rect = this.getBounds();
		const ctx = context.get();
		ctx.beginPath();
		ctx.rect(
			rect.x(),
			rect.y(),
			rect.w(),
			rect.h()
		);
		ctx.lineWidth = 0.1;
		ctx.strokeStyle = '#FF00FF';
		ctx.stroke();
	}
	
	_drawLocalBorder(context) {
		context.transform(this.getMatrix());
		const rect = this._getLocalRect();
		const ctx = context.get();
		ctx.beginPath();
		ctx.rect(
			rect.x(),
			rect.y(),
			rect.w(),
			rect.h()
		);
		ctx.lineWidth = 0.1;
		ctx.strokeStyle = '#0000FF';
		ctx.stroke();
	}
	
}
