(function() {
	
	const imgs = [
		['castle', 'castle.png']
	];
	
	const sounds = [
		['town', 'town.ogg']
	];
	
	const appConfig = {
		imgs,
		sounds,
		width:  500,
		height: 400
	};
	
	QQ.start(appConfig);
	
})();

let game = {
	seizures: {}
};

game.seizures.Main = class Main
	extends QQ.Seizures.Base
{
	
	constructor(input) {
		super(input);
	}
	
	init() {
		this.setCamera();
	}
	
	setCamera() {
		let viewW = 30;
		let viewH = 40;
		let initX = 0;
		let initY = 0;
		this._camera.init(viewW, viewH, initX, initY);
		let resizeCamera = () => {
			let cameraView = this._camera.getView();
			let cameraY    = (cameraView.height-viewH)/2;
			this._camera.setPos(initX, cameraY);

		};
		resizeCamera();
		window.addEventListener('resize', resizeCamera);
	}
	
};

QQ.Seizures.register.set('Main', game.seizures.Main);
