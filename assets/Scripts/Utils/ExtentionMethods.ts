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
export default class ExtentionMethods {
    private static _curCamera: cc.Camera = null;
    private static _curCanvas: cc.Canvas = null;

    public static initCamera(camera: cc.Camera, canvas: cc.Canvas): void {
        this._curCamera = camera;
        this._curCanvas = canvas;
    }

    public static toLocalPosition(curNode: cc.Node, toParent: cc.Node): cc.Vec3 {
        const worldPos = curNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
        return toParent.convertToNodeSpaceAR(worldPos);
    }

    public static toCanvasPosition(pos: cc.Vec2): cc.Vec3 {
        let outPos: cc.Vec2 = new cc.Vec2();
        const worldPos: cc.Vec3 = this._curCamera.getScreenToWorldPoint(pos, outPos);
        return this._curCanvas.node.convertToNodeSpaceAR(worldPos);
    }

    public static toWorlPoint(pos: cc.Vec2): cc.Vec3 {
        let outPos: cc.Vec2 = new cc.Vec2();
        const worldPos: cc.Vec3 = this._curCamera.getScreenToWorldPoint(pos, outPos);
        return worldPos;
    }
}
