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
