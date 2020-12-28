// QQDOC

import * as QQ from '../QQ.js';
import * as World from '../World/index.js';
import * as CONST from '../CONST/index.js';
import {FakeHud} from './FakeHud.js';
import {Point, Size} from '../primitives/index.js';
import {Camera} from '../Camera.js';

import {InputMix} from './InputMix.js';
import {ScrollMix} from './ScrollMix.js';

export class SeizureBase {
	
	camera; // Camera
	
	//================================================================
	// Constructor
	//================================================================
	
	constructor(options) {
		this._szManager = options.szManager;
		this._hud = new FakeHud();
		this._parent = options.parent ?? null;
		this._hudRedirect = false;
		options.isPauseable = QQ.useDefault(options.isPauseable, false);
		const worldInput = {
			maxTicks: options.maxTicks,
			timeStep: options.timeStep,
			seizure: this,
			isSortByZOnTick: options.isSortByZOnTick,
			isSortByZOnAdd: options.isSortByZOnAdd,
			stageConstructor: options.stageConstructor
		};
		if ( QQ.useDefault(options.physicsWorld, false) ) {
			this._world = new World.Physics(worldInput);
		} else {
			this._world = new World.World(worldInput);
		}
		this.camera = new Camera(
			this._world,
			QQ.APP.getHtmlCanvas()
		);
		this._cameraFollow = null;
	}
	
	destructor() {
		this._world.destructor();
		this._world = null;
		this.camera.destructor();
		this.camera = null;
		this._parent = null;
		this._hud.destructor();
		this._hud = null;
	}
	
	init() {
		// Executes after seizure became active
	}
	
	getWorldFromScreen(point) {
		return this.camera.getWorldFromScreen(point);
	}
	
	//================================================================
	// Gets / Sets
	//================================================================
	
	getCamera() {
		return this.camera;
	}
	
	getWorld() {
		return this._world;
	}
	
	//================================================================
	// Ticks & draw
	//================================================================
	
	tick(delta) {
		this._hud.tick(delta);
		this.camera.tick();
		this._world.tick(delta);
		if ( this._cameraFollow ) {
			this.camera.setPosition(
				this._cameraFollow.position()
			);
		}
	}
	
	draw() {
		this.camera.draw();
		this._hud.draw();
	}
	
	restart() {
		this._szManager.reset();
	}
	
	//================================================================
	// Actions
	//================================================================
	
	onClickDown(point, pointer) {
		const isHit = this.#doWithSubjIfHits(point, subj => {
			subj.onClickDown(point, pointer);
		});
		return isHit;
	}
	
	onClickUp(point, pointer) {
		return this.#doWithSubjIfHits(point, subj => {
			subj.onClickUp(point, pointer);
		});
	}
	
	onClick(point, pointer) {
		return this.#doWithSubjIfHits(point, subj => {
			subj.onClick(point, pointer);
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
		const worldPoint = this.camera.getWorldFromScreen(point);
		return this._world.getSubjectAtPoint(worldPoint);
	}
	
	#doWithSubjIfHits(point, fn) {
		const hited = this._world.getSubjectAtPoint(point);
		if ( hited ) {
			fn(hited);
			return true;
		}
		return false;
	}
	
	setCamera(view, eye) {
		this.camera.setView(view);
		if ( eye !== undefined ) {
			this.camera.setPosition(eye);
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
	
	getHud() {
		return this._hud;
	}
	
	setHud(sz, options = {}) {
		options.parent = this;
		this._hud = this._szManager.create(sz, options, false);
	}
	
	getParent() {
		return this._parent;
	}
	
}

export class Seizure extends
	QQ.mixins(ScrollMix, InputMix, SeizureBase)
{
}
