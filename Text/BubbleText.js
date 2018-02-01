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
		const bubble = new BubbleText(
			QQ.Style.use('bubbles', {
				text: options.text,
				position: options.position,
				color: QQ.default(options.color, '#FF0000')
			})
		);

		if ( options.world ) {
			options.world.addSubject(bubble);
		}
		return bubble;
	}
	
};
