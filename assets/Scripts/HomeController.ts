import AudioManager from "./AudioManager";
import StaticData from "./StaticData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HomeController extends cc.Component {

    @property(cc.Canvas)
    canvas: cc.Canvas = null;

    @property(cc.Node)
    settingsPopup: cc.Node = null;

    //#region Public methods

    public onPictureClick(event: cc.Event, customEventData: string): void {
        const levelId = parseInt(customEventData, 10);
        StaticData.CurrentLevel = levelId;
        AudioManager.instance.playClickButton();
        // cc.director.loadScene("Game");
        this.scheduleOnce(() => {
            cc.director.loadScene("Game");
        }, 0.1);
    }

    public onSettingsClick(): void {
        this.settingsPopup.active = true;
        AudioManager.instance.playClickButton();
    }

    //#endregion

    //#region Life cycle callbacks

    onLoad(): void {
        const screenRatio = cc.view.getFrameSize().width / cc.view.getFrameSize().height;
        let fitHeight = screenRatio > 1.5;
        this.canvas.fitWidth = !fitHeight;
        this.canvas.fitHeight = fitHeight;
    }

    //#endregion

}
