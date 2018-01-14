QQ.BubbleText = class BubbleText extends
	QQ.mixins(QQ.Subject.ActionableMix, QQ.Text)
{
	constructor(options) {
		super(options);
		this._alpha = 1;
		this._upHeight = 2.5;
		this._durationUp = 0.5;
		this._durationDisapper = 0.5;
		this.up();
	}
	
	up() {
		const thisPos = this.getPosition();
		this.setAction(
			new QQ.Actions.MoveTo({
				subj: this,
				to: new QQ.Point(thisPos.x(), thisPos.y() - this._upHeight),
				duration: this._durationUp,
				onEnd: () => {
					this.disappear();
				}
			})
		);
	}
	
	disappear() {
		this.setAction(
			new QQ.Actions.Disappear({
				duration: this._durationDisapper,
				onEnd: () => {
					this.deleteMe();
				}
			})
		);
	}
	
	static make(options) {
		const bubble = new BubbleText({
			align: 'center',
			valign: 'middle',
			position: options.position,
			anchor: new QQ.Point(0.5, 0.5),
			size: new QQ.Size(30, 1.5),
			baseLine: 'middle',
			fontSize: 5,
			font: 'KenFuture',
			text: options.text,
			isClickable: false,
			color: QQ.default(options.color, '#FF0000'),
			z: 20
		});
		if ( options.world ) {
			options.world.addSubject(bubble);
		}
		return bubble;
	}
	
};
