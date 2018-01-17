QQ.StyledText = class StyledText extends QQ.Text {
	
	constructor(text, ...styles) {
		super(QQ.Style.use({text: text}, styles));
	}
	
};
