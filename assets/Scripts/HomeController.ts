// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import StaticData from "./StaticData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HomeController extends cc.Component {

    @property(cc.Canvas)
    canvas: cc.Canvas = null;

    //#region Public methods

    public onPictureClick(event: cc.Event, customEventData: string): void {
        const levelId = parseInt(customEventData, 10);
        StaticData.CurrentLevel = levelId;
        cc.director.loadScene("Game");
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
