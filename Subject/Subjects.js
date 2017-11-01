QQ.Subject.TileSprite = class extends
	QQ.mixins(QQ.Subject.TileSpriteMix, QQ.Subject.Base)
{
};

QQ.Subject.Sprite = class extends
	QQ.mixins(QQ.Subject.SpriteMix, QQ.Subject.Base)
{
};

QQ.Subject.Physics = class extends
	QQ.mixins(QQ.Subject.PhysicsMix, QQ.Subject.Sprite)
{
};

QQ.Subject.Actionable = class extends
	QQ.mixins(QQ.Subject.ActionableMix, QQ.Subject.Sprite)
{
};

QQ.Subject.DnD = class extends
	QQ.mixins(QQ.Subject.DragAndDropMix, QQ.Subject.Sprite)
{
};