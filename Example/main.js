(function() {
	
	const imgs = [
		['castle', 'castle.png'],
		['grass',  'grass.png'],
		['sky',    'sky.png'],
		['box',    'box.png'],
		['man',    'man.png']
	];
	
	const sounds = [
		['town', 'sound.ogg']
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
	
	constructor(options) {
		options.scrolling = true;
		super(options);
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
			size:     new QQ.Point(10, 10),
			z:        1
		});
		grass.addSubject(castle);
		
		const man = new QQ.Subject.Sprite({
			app:      this._app,
			img:      'man',
			position: new QQ.Point(2, 2),
			size:     new QQ.Point(5, 5),
			anchor:   new QQ.Point(0.5, 0.5),
			z:        2
		});
		man.setSpriteAnimation(3, 1);
		castle.addSubject(man);
		this._world.setBackground('sky');
		this._setHud('Hud');
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

game.seizures.Hud = class Hud
	extends QQ.Seizures.Base
{
	
	init() {
		super.init();
		this._camera.init(
			new QQ.Point(40, 30),
			new QQ.Point( 0,  0)
		);
		
		const box = new QQ.Subject.DnD({
			app:      this._app,
			img:      'box',
			position: new QQ.Point(5, 5),
			size:     new QQ.Point(5, 5)
		});
		//this._world.addSubject(box);
		
		const text = new QQ.TextScaled({
			app:       this._app,
			text:      'A',
			position:  new QQ.Point(-6, 3),
			size:      new QQ.Size(5, 5),
			anchor:    new QQ.Point(0.5, 0.5),
			align:     'center',
			valign:    'top',
			fontSize:  2,
			fontSpace: 0
		});
		text.onClick = () => {
			this._app.playSound('town');
		};
		this._world.addSubject(text);
		this._world.addSubject(box);
	}
	
};

QQ.Seizures.register.set('Hud', game.seizures.Hud);