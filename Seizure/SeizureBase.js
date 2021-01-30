// QQDOC

import * as QQ from '../QQ.js';
import * as World from '../World/index.js';
import {Camera} from '../Camera.js';

export class SeizureBase {
	
	_hud = null;
	_world;
	_camera;
	#parent;
	#szManager;
	
	// Can be overridden:
	// init() - Executes after seizure became active
	// onBackButton()
	
	constructor(options = {}) {
		this._world = options.world?.physics ?
			new World.Physics(options.world):
			new World.World(options.world);
		this.#parent = options.parent ?? null;
		this.#szManager = options.szManager;
		this._camera = new Camera(this._world, QQ.APP.getMainCanvas());
	}
	
	destructor() {
		this._world.destructor();
		this._camera.destructor();
		this._hud?.destructor();
	}
	
	restart() {
		this.#szManager.reset();
	} // void
	
	tick(delta) {
		this._hud?.tick(delta);
		this._world.tick(delta);
		this._camera.tick(delta);
	} // void
	
	draw() {
		this._camera.draw();
		this._hud?.draw();
	} // void
	
	addSubject(...args) {
		this._world.addSubject(...args);
	} // void
	
	isHitSomething(point) {
		const worldPoint = this._camera.getWorldFromScreen(point);
		return Boolean( this._world.clickableAtPoint(worldPoint) );
	} // boolean
	
	getWorldFromScreen(point) {
		return this._camera.getWorldFromScreen(point);
	} // new Point
	
	getCamera() {
		return this._camera;
	} // Camera
	
	getWorld() {
		return this._world;
	} // World
	
	getParent() {
		return this.#parent;
	} // Seizure | null
	
	getHud() {
		return this._hud;
	} // Seizure | null
	
	setHud(szName, options = {}) {
		options.parent = this;
		this._hud = this.#szManager.create(szName, options);
	} // void
	
	setCamera(view, eye) {
		this._camera.viewSize(view);
		if ( eye ) {
			this._camera.position(eye);
		}
	} // void
	
	setBackground(...args) {
		this._world.background(...args);
	} // void
	
	makeSubject(...args) { // Proxy to World.makeSubject()
		return this._world.makeSubject(...args);
	} // new Subject
	
	cameraFollow(subj) {
		this._camera.setFollow(subj);
	} // void
	
}
