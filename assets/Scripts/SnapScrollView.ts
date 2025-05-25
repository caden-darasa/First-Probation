import ExtentionMethods from "./Utils/ExtentionMethods";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SnapScrollView extends cc.Component {
    private readonly CANVAS_WIDTH: number = 1920; // Width of the canvas
    private readonly FAST_SCROLL_DISTANCE = 400;
    private readonly FAST_SCROLL_TIME = 20;
    private readonly SPEED_LERP: number = 0.00001; // Speed of the lerp effect
    private readonly SPEED_LERP_2: number = 10; // Speed of the lerp effect

    @property(cc.Canvas)
    canvas: cc.Canvas = null;
    @property(cc.Node)
    camera: cc.Camera = null;

    private scrollView: cc.ScrollView = null;
    private _items: cc.Node[] = [];
    private isLerping: boolean = false;
    private isDragging: boolean = false;

    private _initPos: number = -1;
    private _countFrame: number = 0;
    private _widthItem: number = 0;
    private startDragPos: number = 0;
    private isScrolling: boolean = false;   // TODO: useful for handle event end scroll
    private itemIndex: number = 0;
    private spacing: number = 0;
    private scrollCounter: number = 0;
    private targetX: number = 0;

    public test() {
        this.scrollToItem(2);
    }

    //#region Life cycle callbacks

    onLoad() {
        ExtentionMethods.initCamera(this.camera, this.canvas);

        this.scrollView = this.getComponent(cc.ScrollView);
        this.scrollView.node.on('scroll-began', this.onBeginDrag, this);
        this.scrollView.node.on("touch-up", this.onEndDrag, this);
        this._items = this.scrollView.content.children;
        this._widthItem = this._items[0].width;

        // Setup content
        const width = cc.winSize.width;
        let scaleFactor = width >= this.CANVAS_WIDTH ? 1 : this.CANVAS_WIDTH / width;
        let padding = (width - this._items[0].width) * scaleFactor / 2;
        this.scrollView.content.getComponent(cc.Layout).paddingLeft = padding;
        this.scrollView.content.getComponent(cc.Layout).paddingRight = padding;
        this.spacing = this.scrollView.content.getComponent(cc.Layout).spacingX;
        console.log("padding: ", padding);
    }

    update(dt: number): void {
        if (this.isDragging) {
            this.scrollCounter++;
        }

        if (this.isLerping) {
            const content = this.scrollView.content;
            let curPos = content.position.x;
            // offset += this.SPEED_LERP;
            let newPos = cc.misc.lerp(curPos, this.targetX, this.SPEED_LERP_2 * dt);

            if (Math.abs(newPos - this.targetX) < 1) {
                this.isScrolling = false;
                this.isLerping = false;
                newPos = this.targetX;
            }

            content.position = new cc.Vec2(newPos, content.position.y);
        }
    }

    lateUpdate(): void {
        if (this._countFrame < 2) {
            this._countFrame++;

            if (this._countFrame == 2) {
                this._initPos = this.scrollView.content.getPosition().x;
                console.log("lateUpdate pos: ", this._initPos);
            }
        }
    }

    //#endregion

    //#region Private methods

    private getClosestItemId(): number {
        let closestDistance = Number.MAX_VALUE;
        let closestId = 0;

        for (let i = 0; i < this._items.length; i++) {
            let item = this._items[i];
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
        else if (id == this._items.length)
            id = this._items.length - 1;

        // let target = this._initPos - id * (this._widthItem + this.spacing);
        this.isLerping = true;
        // const content = this.scrollView.content;
        // let curPos = content.position.x;
        // let offset = 0;
        // console.log(id);

        // while (true) {
        //     offset += this.SPEED_LERP;
        //     let newPos = cc.misc.lerp(curPos, target, offset);
        //     content.position = new cc.Vec2(newPos, content.position.y);

        //     if (Math.abs(newPos - target) < 1)
        //         break;
        // }

        // content.position = new cc.Vec2(target, content.position.y);
        // this.isScrolling = false;
        this.itemIndex = id;
        this.targetX = this._initPos - id * (this._widthItem + this.spacing);
    }

    private onBeginDrag(event: cc.Event.EventTouch) {
        this.scrollCounter = 0;
        this.isDragging = true;
        this.startDragPos = this.getContentPosition(this.itemIndex);
        this.isScrolling = true;
    }

    private onEndDrag(event: cc.Event.EventTouch) {
        if (!this.isDragging)
            return;

        this.isDragging = false;
        const content = this.scrollView.content;
        let curDragPos = content.getPosition().x;
        let distance = Math.abs(curDragPos - this.startDragPos);
        console.log(this.scrollCounter);

        if (this.scrollCounter < this.FAST_SCROLL_TIME && distance < this.FAST_SCROLL_DISTANCE) {
            console.log(curDragPos - this.startDragPos);
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
        return this._initPos - id * (this._widthItem + this.spacing);
    }

    private getScrollPosition(id: number): cc.Vec3 {
        return ExtentionMethods.toLocalPosition(this._items[id], this.scrollView.node);
    }

    //#endregion
}
