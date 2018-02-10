QQ.Actions.MoveTo = class MoveTo extends QQ.Actions.Move {
	
	constructor(options) {
		options.from = options.subj.getPosition();
		super(options);
	}
	
};
