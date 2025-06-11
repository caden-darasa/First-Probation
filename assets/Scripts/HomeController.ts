import AudioManager from "./AudioManager";
import StaticData from "./StaticData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HomeController extends cc.Component {

    @property(cc.Canvas)
    canvas: cc.Canvas = null;

    //#region Public methods

    public onPictureClick(event: cc.Event, customEventData: string): void {
        console.log(cc.director.getScene());
        cc.director.loadScene("Game");
        // const levelId = parseInt(customEventData, 10);
        // StaticData.CurrentLevel = levelId;
        // AudioManager.instance.playClickButton();
        // this.scheduleOnce(() => {
        //     cc.director.loadScene("Game");
        // }, 0.2);
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
