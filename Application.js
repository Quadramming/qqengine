// QQDOC

import * as Seizure from './Seizure/index.js';
import * as style from './style/style.js';
import * as i18n from './i18n.js';
import {Size} from './primitives/index.js';
import {FpsCounter} from './FpsCounter.js';
import {Time} from './Time.js';
import {Storage} from './Storage.js';
import {ImageManager} from './ImageManager.js';
import {Html5Sound as Sound} from './Sound/html5.js';
import {GCanvas} from './GCanvas.js';
import {OnResizeHandler} from './OnResizeHandler.js';
import {InputTouch as Input} from './Input/InputTouch.js';
import {FontLoader} from './FontLoader.js';

export class Application {
	
	#fpsCounter = new FpsCounter(); // Fps counter
	#time = new Time(); // Time handler
	#startSeizure = 'Main'; // First seizure to start
	#storage = new Storage();
	#onResizeHandler = new OnResizeHandler();
	#onBackButtonFn = () => this.onBackButton();
	#seizures = new Seizure.Manager();
	#fontLoader = new FontLoader();
	#imageManager = new ImageManager();
	#debugDraw = false;
	#game = null;
	#canvas; // Global canvas
	#sound;
	#input;
	
	init(config = {}) {
		this.#fontLoader.cleanUp();
		this.#canvas = new GCanvas('QQ.APP.Canvas', config.size, config.maximize);
		this.#input = new Input(this.#canvas.getCanvas());
		this.#sound = new Sound(config.sounds);
		if ( config.dictionary ) i18n.set(config.dictionary);
		if ( config.styles ) {
			for ( const [name, styleObj] of Object.entries(config.styles) ) {
				style.set(name, styleObj);
			}
		}
		if ( config.game ) this.#game = config.game;
		if ( config.showFps ) this.#fpsCounter.toggleShow();
		if ( config.startSeizure ) this.#startSeizure = config.startSeizure;
		document.addEventListener('backbutton', this.#onBackButtonFn, false);
		this.#imageManager.addImageId(config.images);
		this.#imageManager.preload(config.imagesPreload, () => this.#init());
	}
	
	destructor() {
		this.#onResizeHandler.destructor();
		document.removeEventListener('backbutton', this.#onBackButtonFn, false); }
	
	#init() {
		this.#game?.init?.(this);
		this.#seizures.init();
		this.#seizures.set(this.#startSeizure);
		this.#gameLoop(0);
	} // void
	
	initFonts(fonts) {
		this.#fontLoader.add(fonts);
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
	
	popUp(szName, options) {
		this.#seizures.popUp(szName, options);
	} // void
	
	closePopUp() {
		this.#seizures.closePopUp();
	} // void
	
	resetSz() {
		this.#seizures.reset();
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
		this.#seizures.getActive().onBackButton?.();
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
		this.#imageManager.tick(delta);
		this.#canvas.tick?.(delta);
		this.#fpsCounter.tick(delta);
		this.#game?.tick?.(delta);
		this.#seizures.getActive().handleInput(this.#input);
		this.#seizures.tick(delta);
	} // void
	
	#draw() {
		this.#seizures.draw();
		if ( this.#debugDraw ) this.#canvas.drawBorder();
		this.#fpsCounter.show(this.#canvas.getContext());
	} // void
	
}
