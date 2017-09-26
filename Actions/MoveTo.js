QQ.Actions.MoveTo = class MoveTo extends QQ.Actions.Move {
	
	constructor(app, options) {
		options.from = options.subj.getPosition();
		super(app, options);
	}
	
};
