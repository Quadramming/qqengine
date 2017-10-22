QQ.Subject.TileSprite = class extends
	QQ.mixins(QQ.Subject.TileSpriteMix, QQ.Subject.Base)
{
};

QQ.Subject.Physics = class extends
	QQ.mixins(QQ.Subject.SpriteMix, QQ.Subject.PhysicsMix, QQ.Subject.Base)
{
};

QQ.Subject.Actionable = class extends
	QQ.mixins(QQ.Subject.SpriteMix, QQ.Subject.ActionableMix, QQ.Subject.Base)
{
};

QQ.Subject.Sprite = class extends
	QQ.mixins(QQ.Subject.SpriteMix, QQ.Subject.Base)
{
};

QQ.Subject.DnD = class extends
	QQ.mixins(QQ.Subject.DragAndDropMix, QQ.Subject.SpriteMix, QQ.Subject.Base)
{
};