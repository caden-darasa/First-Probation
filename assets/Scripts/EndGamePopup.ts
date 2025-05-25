import AudioManager from "./AudioManager";
import StaticData from "./StaticData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EndGamePopup extends cc.Component {
    @property(cc.Node)
    firework: cc.Node = null;

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    popup: cc.Node = null;

    //#region Public methods

    public onNextClick(): void {
        StaticData.CurrentLevel++;
        AudioManager.instance.playClickButton();
        cc.director.loadScene("Game");
    }

    //#endregion

    //#region Life cycle callbacks

    start() {
        this.firework.active = true;
        this.schedule(() => {
            this.firework.active = false;
            this.bg.active = true;
            cc.tween(this.popup)
                .to(0.5, { position: cc.Vec2.ZERO }, { easing: 'backOut', })
                .start();
        }, 0, 1, 4);
    }

    //#endregion

}
