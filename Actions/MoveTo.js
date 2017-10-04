QQ.Actions.MoveTo = class MoveTo extends QQ.Actions.Move {
	
	constructor(input) {
		options.from = options.subj.getPosition();
		super(input);
	}
	
};
