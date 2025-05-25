const { ccclass, property } = cc._decorator;

@ccclass
export default class StarPoint extends cc.Component {
    @property(cc.Node)
    star: cc.Node = null;
    @property(cc.Animation)
    effect: cc.Animation = null;

    //#region Public methods

    public runEffect() {
        this.star.active = true;
        this.effect.node.active = true;
        this.effect.play("star-fade");
    }

    //#endregion
}
