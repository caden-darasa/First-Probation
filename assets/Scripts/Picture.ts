// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Picture extends cc.Component {

    @property(cc.Node)
    leftPic: cc.Node = null;

    @property(cc.Node)
    rightPic: cc.Node = null;

    @property([cc.Node])
    leftDifPoints: cc.Node[] = [];

    @property([cc.Node])
    rightDifPoints: cc.Node[] = [];

    //#region Public methods

    public showCompletePoint(id: number, leftFx: cc.Node, rightFx: cc.Node): void {
        this.leftPic.addChild(leftFx);
        this.rightPic.addChild(rightFx);
        leftFx.setPosition(this.leftDifPoints[id].position);
        rightFx.setPosition(this.rightDifPoints[id].position);
        this.leftDifPoints[id].active = false;
        this.rightDifPoints[id].active = false;
    }

    //#endregion
}
