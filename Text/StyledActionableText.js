QQ.StyledActionableText = class StyledActionableText extends QQ.mixins(QQ.Subject.ActionableMix, QQ.Text){
	
	constructor(text, ...styles) {
		super(QQ.Style.use({text: text}, styles));
	}
	
};
