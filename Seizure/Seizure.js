import * as QQ from '../QQ.js';
import * as World from '../World/index.js';
import {FakeHud} from './FakeHud.js';
import {Point, Size} from '../primitives/index.js';
import {Camera} from '../Camera.js';
import {WorldPointer} from '../WorldPointer.js';

export class Seizure {
	
	//================================================================
	// Constructor
	//================================================================
	
	constructor(options) {
		this._app = options.app;
		this._szManager = options.szManager;
		this._input = new WorldPointer();
		this._hud = new FakeHud();
		this._parent = QQ.useDefault(options.parent, null);
		this._hudRedirect = false;
		options.isPauseable = QQ.useDefault(options.isPauseable, false);
		const worldInput = {
			app: this._app,
			maxTicks: options.maxTicks,
			timeStep: options.timeStep,
			seizure: this,
			isPauseable: options.isPauseable,
			isSortOnTick: options.isSortOnTick,
			stageConstructor: options.stageConstructor
		};
		if ( QQ.useDefault(options.physicsWorld, false) ) {
			this._world = new World.Physics(worldInput);
		} else {
			this._world = new World.World(worldInput);
		}
		this._camera = new Camera(
			this._app.getHtmlCanvas(),
			this._world
		);
		this._isScrollable = QQ.useDefault(options.scrolling, false);
		this._epsilon = QQ.useDefault(options.epsilon, 1);
		this._epsilon = this._camera.widthPercentsToPx(this._epsilon);
		this._scroll = {
			isActive: false,
			isClicked: false,
			start: new Point(NaN),
			world: new Point(NaN),
			screen: new Point(NaN)
		};
		this._cameraFollow = null;
	}
	
	release() {
		this._world.release();
		this._world = null;
		this._camera.destructor();
		this._camera = null;
		this._parent = null;
		this._hud.release();
		this._hud = null;
		this._input = null;
	}
	
	init() {
		// Executes after seizure became active
		this._input.setActions(
			point => this.clickDown(point),
			point => this.clickUp(point),
			point => this.click(point)
		);
		this._input.setConverterToWorldFromScreen(
			point => this._camera.convertToWorldFromScreen(point)
		);
	}
	
	//================================================================
	// Gets / Sets
	//================================================================
	
	getInput() {
		return this._input;
	}
	
	getCamera() {
		return this._camera;
	}
	
	getWorld() {
		return this._world;
	}
	
	//================================================================
	// Ticks & draw
	//================================================================
	
	tick(delta) {
		this._hud.tick(delta);
		this._input.update();
		this._camera.tick();
		if ( this._isScrollable ) {
			this.tickScroll(delta);
		}
		this._world.tick(delta);
		if ( this._cameraFollow ) {
			this._camera.setPosition(
				this._cameraFollow.getPosition()
			);
		}
	}
	
	draw() {
		this._camera.draw();
		this._hud.draw();
	}
	
	//================================================================
	// Scroll
	//================================================================
	
	isScrolling() {
		return this._scroll.isActive;
	}
	
	tickScroll() {
		const scroll    = this._scroll;
		const isClicked = this._input.isClicked();
		const screen    = this._input.getScreenPoint();
		const world     = this._input.getWorldPoint();
		if ( screen ) {
			if ( ! scroll.isClicked && isClicked ) {
				scroll.isClicked = true;
				scroll.isActive  = false;
				scroll.start.copy(screen);
				return;
			}
			if ( scroll.isClicked && ! isClicked ) {
				scroll.isClicked = false;
				scroll.isActive  = false;
				return;
			}
			const isClose = screen.isNear(scroll.start, this._epsilon);
			if ( isClicked && ! scroll.isActive && ! isClose ) {
				scroll.isActive = true;
				scroll.world.copy(world);
				return;
			}
			if ( scroll.isActive ) {
				const offset = new Point(
					scroll.world.x() - world.x(),
					scroll.world.y() - world.y()
				);
				this._camera.addPosition(offset);
			}
		} else {
			scroll.isClicked = false;
			scroll.isActive  = false;
			scroll.screen.set(NaN);
			scroll.world.set(NaN);
		}
	}
	
	//================================================================
	// Input
	//================================================================
	
	blockInput(value = true) {
		this._input.block(value);
		this._hud.blockInput(value);
	}
	
	resetInput() {
		this._input.reset();
		this._hud.resetInput();
	}
	
	pointerDown(point) {
		this._hudRedirect = this._hud.isHitSomething(point);
		if ( this._hudRedirect ) {
			this._hud.pointerDown(point);
		} else {
			this._input.down(point);
		}
	}
	
	pointerUp(point) {
		if ( this._hudRedirect ) {
			this._hud.pointerUp(point);
			this._hudRedirect = false;
		} else {
			this._input.up(point);
		}
	}
	
	pointerMove(point) {
		if ( this._hudRedirect ) {
			this._hud.pointerMove(point);
		} else {
			this._input.move(point);
		}
	}
	
	//================================================================
	// Actions
	//================================================================
	
	clickDown(point) {
		return this._doWithSubjIfHits(point, (subj, p) => {
			subj.onClickDown(p);
		});
	}
	
	clickUp(point) {
		if ( this.isScrolling() ) {
			return false;
		}
		return this._doWithSubjIfHits(point, (subj, p) => {
			subj.onClickUp(p);
		});
	}
	
	click(point) {
		if ( this.isScrolling() ) {
			return false;
		}
		return this._doWithSubjIfHits(point, (subj, p) => {
			subj.onClick(p);
		});
	}
	
	//================================================================
	// Common
	//================================================================
	
	onBackButton() {
	}
	
	isHitSomething(point) {
		if ( point === false ) {
			return false;
		}
		const worldPoint = this._camera.getWorldFromScreen(point);
		return this._world.getSubjectAtPoint(worldPoint);
	}
	
	_doWithSubjIfHits(point, fn) {
		const hited = this._world.getSubjectAtPoint(point);
		if ( hited ) {
			fn(hited, point);
			return true;
		}
		return false;
	}
	
	setCamera(view, eye) {
		this._camera.setView(view);
		if ( eye !== undefined ) {
			this._camera.setPosition(eye);
		}
	}
	
	setBackground(...args) {
		this._world.background(...args);
	}
	
	makeSubject(...args) {
		return this._world.makeSubject(...args);
	}
	
	addSubject(...args) {
		this._world.addSubject(...args);
	}
	
	cameraFollow(subj) {
		this._cameraFollow = subj;
	}
	
	//================================================================
	// Hud
	//================================================================
	
	_setHud(sz, input = {}) {
		input.parent = this;
		this._hud = this._szManager.create(sz, input, false);
	}
	
	getParent() {
		return this._parent;
	}
	
}
