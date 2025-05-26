import ItemScrollView from "./ItemScrollView";
import ExtentionMethods from "./Utils/ExtentionMethods";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SnapScrollView extends cc.Component {
    private readonly CANVAS_WIDTH: number = 1920; // Width of the canvas
    private readonly FAST_SCROLL_DISTANCE: number = 400;
    private readonly FAST_SCROLL_TIME: number = 20;
    private readonly SPEED_LERP: number = 10; // Speed of the lerp effect

    @property(cc.Canvas)
    canvas: cc.Canvas = null;
    @property(cc.Node)
    camera: cc.Camera = null;
    @property(Boolean)
    changeScale: boolean = false;

    private scrollView: cc.ScrollView = null;
    private items: cc.Node[] = [];
    private isLerping: boolean = false;
    private isDragging: boolean = false;
    private initPos: number = -1;
    private countFrame: number = 0;
    private widthItem: number = 0;
    private startDragPos: number = 0;
    private itemIndex: number = 0;
    private spacing: number = 0;
    private scrollCounter: number = 0;
    private targetX: number = 0;
    private _isScrolling: boolean = false;   // TODO: useful for handle event end scroll

    //#region Public methods

    public get IsScrolling(): boolean {
        return this._isScrolling;
    }

    public get Id(): number {
        return this.itemIndex;
    }

    //#endregion

    //#region Life cycle callbacks

    onLoad() {
        ExtentionMethods.initCamera(this.camera, this.canvas);

        this.scrollView = this.getComponent(cc.ScrollView);
        this.scrollView.node.on('scroll-began', this.onBeginDrag, this);
        this.scrollView.node.on("touch-up", this.onEndDrag, this);
        this.items = this.scrollView.content.children;
        this.widthItem = this.items[0].width;

        // Setup content
        const width = cc.winSize.width;
        let scaleFactor = width >= this.CANVAS_WIDTH ? 1 : this.CANVAS_WIDTH / width;
        let padding = (width - this.items[0].width) * scaleFactor / 2;
        this.scrollView.content.getComponent(cc.Layout).paddingLeft = padding;
        this.scrollView.content.getComponent(cc.Layout).paddingRight = padding;
        this.spacing = this.scrollView.content.getComponent(cc.Layout).spacingX;
    }

    update(dt: number): void {
        if (this.isDragging) {
            this.scrollCounter++;
        }

        if (this.isLerping) {
            const content = this.scrollView.content;
            let curPos = content.position.x;
            let newPos = cc.misc.lerp(curPos, this.targetX, this.SPEED_LERP * dt);

            if (Math.abs(newPos - this.targetX) < 1) {
                this._isScrolling = false;
                this.isLerping = false;
                newPos = this.targetX;
            }

            content.position = new cc.Vec2(newPos, content.position.y);
        }
    }

    lateUpdate(): void {
        if (this.countFrame < 2) {
            this.countFrame++;

            if (this.countFrame == 2) {
                this.initPos = this.scrollView.content.getPosition().x;
                let maxDist = Math.abs(this.items[0].x - this.items[1].x);

                for (let i = 0; i < this.items.length; i++) {
                    let item = this.items[i].getComponent(ItemScrollView);
                    item.init(maxDist, i, this);
                }
            }
        }
    }

    //#endregion

    //#region Private methods

    private getClosestItemId(): number {
        let closestDistance = Number.MAX_VALUE;
        let closestId = 0;

        for (let i = 0; i < this.items.length; i++) {
            let posInScroll = this.getScrollPosition(i);
            let distance = Math.abs(posInScroll.x);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestId = i;
            }
        }

        return closestId;
    }

    private scrollToItem(id: number) {
        if (id < 0)
            id = 0;
        else if (id == this.items.length)
            id = this.items.length - 1;

        this.isLerping = true;
        this.itemIndex = id;
        this.targetX = this.initPos - id * (this.widthItem + this.spacing);
    }

    private onBeginDrag(event: cc.Event.EventTouch) {
        this.scrollCounter = 0;
        this.isDragging = true;
        this.startDragPos = this.getContentPosition(this.itemIndex);
        this._isScrolling = true;
    }

    private onEndDrag(event: cc.Event.EventTouch) {
        if (!this.isDragging)
            return;

        this.isDragging = false;
        const content = this.scrollView.content;
        let curDragPos = content.getPosition().x;
        let distance = Math.abs(curDragPos - this.startDragPos);

        if (this.scrollCounter < this.FAST_SCROLL_TIME && distance < this.FAST_SCROLL_DISTANCE) {
            if (curDragPos > this.startDragPos)
                this.scrollToItem(--this.itemIndex);
            else
                this.scrollToItem(++this.itemIndex);
        }
        else {
            this.scrollToItem(this.getClosestItemId());
        }
    }

    private getContentPosition(id: number): number {
        return this.initPos - id * (this.widthItem + this.spacing);
    }

    private getScrollPosition(id: number): cc.Vec3 {
        return ExtentionMethods.toLocalPosition(this.items[id], this.scrollView.node);
    }

    //#endregion
}
