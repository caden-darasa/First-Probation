import GameManager from "./GameManager";
import ExtentionMethods from "./Utils/ExtentionMethods";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerController extends cc.Component {
    private _leftPic: cc.Node = null;
    private _rightPic: cc.Node = null;
    private _leftDifPoints: cc.Node[] = [];
    private _rightDifPoints: cc.Node[] = [];

    //#region Public methods

    setLevel(leftPic: cc.Node, rightPic: cc.Node, leftDifPoints: cc.Node[], rightDifPoints: cc.Node[]): void {
        this._leftPic = leftPic;
        this._rightPic = rightPic;
        this._leftDifPoints = leftDifPoints;
        this._rightDifPoints = rightDifPoints;
        GameManager.instance.endGame = false;
    }

    //#endregion

    //#region Life-cycle callbacks

    onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    //#endregion

    //#region Private methods

    private onTouchStart(event: cc.Event.EventTouch): void {
        if (GameManager.instance.endGame)
            return;

        const touchPos: cc.Vec2 = event.getLocation();

        if (this.isInsideImage(touchPos, this._leftPic)
            || this.isInsideImage(touchPos, this._rightPic)) {
            let difId: number = -1;
            const canvasPos = ExtentionMethods.toCanvasPosition(touchPos);

            for (let i = 0; i < this._leftDifPoints.length; i++) {
                if (this.hitDifference(this._leftDifPoints[i], touchPos)) {
                    difId = i;
                    break;
                }
            }

            if (difId < 0) {
                for (let i = 0; i < this._rightDifPoints.length; i++) {
                    if (this.hitDifference(this._rightDifPoints[i], touchPos)) {
                        difId = i;
                        break;
                    }
                }
            }

            if (difId < 0)
                GameManager.instance.incorrectTouch(canvasPos);
            else
                GameManager.instance.correctTouch(difId, canvasPos);
        }
    }

    private isInsideImage(worldPos: cc.Vec2, imageNode: cc.Node): boolean {
        return imageNode.getBoundingBoxToWorld().contains(worldPos);
    }

    private hitDifference(diffNode: cc.Node, worldPos: cc.Vec2): boolean {
        return diffNode.getBoundingBoxToWorld().contains(worldPos) && diffNode.active;
    }

    //#endregion
}
