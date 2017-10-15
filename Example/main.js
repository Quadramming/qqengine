(function() {
	
	const imgs = [
		['castle', 'castle.png'],
		['grass',  'grass.png'],
		['sky',    'sky.png'],
		['man',    'man.png']
	];
	
	const sounds = [
		['town', 'town.ogg']
	];
	
	const appConfig = {
		imgs,
		sounds,
		size: new QQ.Size(800, 600)
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
		super.init();
		this._camera.init(
			new QQ.Point(40, 30),
			new QQ.Point( 3,  3)
		);
		
		const grass = this.makeGrass();
		this._world.addSubject(grass);
		
		const castle = new QQ.Subject.Sprite({
			app:      this._app,
			img:      'castle',
			position: new QQ.Point(0, 2),
			size:     new QQ.Point(10, 10)
		});
		grass.addSubject(castle);
		
		const man = new QQ.Subject.Sprite({
			app:      this._app,
			img:      'man',
			position: new QQ.Point(2, 2),
			size:     new QQ.Point(5, 5),
			anchor:   new QQ.Point(0.5, 0.5)
		});
		man.setSpriteAnimation(3, 5);
		castle.addSubject(man);
		this._world.setBackground('sky');
		
		//this.setGrass();
	}
	
	makeGrass() {
		let grass = QQ.Subject.make({
			app:   this._app,
			tiled: true,
			img:   'grass',
			anchor: new QQ.Point(0.5, 0),
			size: new QQ.Size(30, 20)
		});
		grass.setTileSize(new QQ.Point(4, 4));
		return grass;
	}
	
};

QQ.Seizures.register.set('Main', game.seizures.Main);
