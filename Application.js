// QQDOC

import * as QQ from './QQ.js';
import * as Seizure from './Seizure/index.js';
import {Size} from './primitives/index.js';
import {FpsCounter} from './FpsCounter.js';
import {Time} from './Time.js';
import {Storage} from './Storage.js';
import {ImageManager} from './ImageManager.js';
import {Sound} from './Sound.js';
import {GCanvas} from './GCanvas.js';
import {OnResizeHandler} from './OnResizeHandler.js';

import {InputAvg} from './Input/InputAvg.js';

export class Application {
	
	#fpsCounter = new FpsCounter(); // Fps counter
	#inputQueue = [];
	#time = new Time(); // Time handler
	#startSeizure = 'Main'; // First seizure to start
	#storage = new Storage();
	#onResizeHandler = new OnResizeHandler();
	#seizures = new Seizure.Manager();
	#sound = new Sound();
	#game = null;
	#imageManager;
	#canvas; // Global canvas
	
	constructor(config = {}) {
		QQ.setApp(this);
		this.#canvas = new GCanvas('QQ.APP.Canvas', config.size, config.maximize);
		new InputAvg(this.#canvas.getCanvas(), this.#inputQueue);
		this.#imageManager = new ImageManager(config.images);
		this.#sound.set(config.sounds);
		this.#loadResources(() => this.#init());
		if ( config.game ) this.#game = config.game;
		if ( config.showFps ) this.#fpsCounter.toggleShow();
		if ( config.startSeizure ) this.#startSeizure = config.startSeizure;
	}
	
	#init() {
		window.document.addEventListener(
			'backbutton',
			() => this.onBackButton(),
			false // useCapture
		);
		this.#game?.init?.(this);
		this.#seizures.init();
		this.#seizures.set(this.#startSeizure);
		this.#gameLoop(0);
	} // void
	
	#loadResources(cb) {
		if ( this.#imageManager.isReady() ) {
			cb();
		} else {
			setTimeout(() => this.#loadResources(cb), 100);
		}
	} // void
	
	storage(key, value) { // {F} Proxy to storage
		return this.#storage.store(key, value);
	} // string | null
	
	setSz(...args) {
		this.#seizures.set(...args);
	} // void
	
	pause() {
		this.#seizures.popUp('Pause');
	} // void
	
	popUp(sz, input) {
		this.#seizures.set(sz, input, true);
	} // void
	
	closePopUp() {
		this.#seizures.closePopUp();
	} // void
	
	getActiveSz() {
		return this.#seizures.getActive();
	} // Seizure
	
	getResolution() {
		return new Size(this.#canvas.getWidth(), this.#canvas.getHeight());
	} // new Size
	
	getImageByUrl(imageUrl) {
		return this.#imageManager.getImageByUrl(imageUrl);
	} // HTMLImageElement
	
	getImageById(imageId) {
		return this.#imageManager.getImageById(imageId);
	} // HTMLImageElement
	
	getImageCanvasByUrl(imageUrl) {
		return this.#imageManager.getImageCanvasByUrl(imageUrl);
	} // WCanvas
	
	getImageCanvasById(imageId) {
		return this.#imageManager.getImageCanvasById(imageId);
	} // WCanvas
	
	getImageManager() {
		return this.#imageManager;
	} // ImageManager
	
	getMainCanvas() {
		return this.#canvas.getCanvas();
	} // HTMLCanvasElement
	
	getMainContext() {
		return this.#canvas.getContext();
	} // CanvasRenderingContext2D
	
	showFpsDetails() {
		this.#fpsCounter.showDetails();
	} // void
	
	onBackButton() {
		if ( this.#seizures.countActives() > 0 ) {
			this.#seizures.getActive().onBackButton();
		}
	} // void
	
	addOnResize(fn) {
		this.#onResizeHandler.add(fn);
	} // void
	
	removeOnResize(fn) {
		this.#onResizeHandler.remove(fn);
	} // void
	
	playSound(str, options) {
		this.#sound.play(str);
	} // void
	
	controlSound(str, options) {
		this.#sound.control(str, options);
	} // void
	
	#gameLoop(time) {
		this.#tick();
		this.#draw();
		requestAnimationFrame(time => this.#gameLoop(time));
		//setTimeout(() => this.#gameLoop(1), 1); // Debug
	} // void
	
	#tick() {
		const delta = this.#time.update();
		this.#canvas.tick?.(delta);
		this.#fpsCounter.tick(delta);
		this.#game?.tick?.(delta);
		this.#seizures.getActive().handleInput(this.#inputQueue);
		this.#seizures.tick(delta);
	} // void
	
	#draw() {
		this.#seizures.draw();
		//this.#canvas.drawBorder();
		this.#fpsCounter.show(this.#canvas.getContext());
	} // void
	
}
