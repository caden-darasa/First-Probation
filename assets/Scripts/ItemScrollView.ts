import SnapScrollView from "./SnapScrollView";
import ExtentionMethods from "./Utils/ExtentionMethods";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemScrollView extends cc.Component {
    private readonly MAX_SCALE: number = 1.5;
    private readonly MIN_SCALE: number = 1;

    private initialized: boolean = false;
    private maxDist: number = 0;
    private id: number = 0;
    private scrollView: SnapScrollView = null;
    private button: cc.Button = null;

    //#region Public methods

    public init(maxDist: number, id: number, scrollView: SnapScrollView) {
        this.initialized = true;
        this.maxDist = maxDist;
        this.id = id;
        this.scrollView = scrollView;
        this.button = this.getComponent(cc.Button);
    }

    //#endregion

    //#region Life cycle callbacks

    update(dt: number): void {
        if (!this.initialized)
            return;

        let dist = Math.abs(this.getDistance());

        if (dist >= this.maxDist) {
            this.node.scale = this.MIN_SCALE;
        }
        else {
            let value = (this.maxDist - dist) / this.maxDist;
            this.node.scale = cc.misc.lerp(this.MIN_SCALE, this.MAX_SCALE, value);
        }

        if (this.scrollView.Id !== this.id) {
            if (this.button)
                this.button.interactable = false;
        }

        if (this.scrollView.IsScrolling) {
            if (this.button)
                this.button.interactable = false;
        }
        else if (this.scrollView.Id == this.id) {
            if (this.button)
                this.button.interactable = true;
        }
    }

    //#endregion

    //#region Private methods

    private getDistance(): number {
        return ExtentionMethods.toLocalPosition(this.node, this.scrollView.node).x;
    }

    //#endregion
}
