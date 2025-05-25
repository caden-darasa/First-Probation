const { ccclass, property } = cc._decorator;

@ccclass
export default class SmoothSnapScrollView extends cc.Component {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property({ tooltip: "Snap speed (0.05 - 0.3 for smooth motion)." })
    lerpSpeed: number = 0.2;

    public onCenterItemChanged: (centeredItem: cc.Node) => void = null;
    public onSnapComplete: (centeredItem: cc.Node) => void = null;

    private itemWidth: number = 0;
    private spacing: number = 0;
    private targetOffsetX: number = 0;
    private currentCenterItem: cc.Node = null;
    private snapping: boolean = false;

    onLoad() {
        const items = this.content.children;
        if (items.length > 0) {
            this.itemWidth = items[0].width;
            const layout = this.content.getComponent(cc.Layout);
            this.spacing = layout ? layout.spacingX : 0;
        }

        this.scrollView.inertia = false; // ✅ Disable inertia for controlled motion
    }

    update(dt: number) {
        const closestItem = this.getClosestToCenterItem();
        if (!closestItem) return;

        const itemCenterX = closestItem.x + closestItem.width / 2;
        const viewCenterX = this.scrollView.node.width / 2;
        const idealOffsetX = itemCenterX - viewCenterX;

        const maxOffset = this.content.width - this.scrollView.node.width;
        const clampedTarget = cc.misc.clampf(idealOffsetX, 0, maxOffset);

        const currentOffsetX = this.scrollView.getScrollOffset().x;

        // Smoothly interpolate scroll offset toward target
        const newOffsetX = cc.misc.lerp(currentOffsetX, clampedTarget, this.lerpSpeed);
        this.scrollView.scrollToOffset(cc.v2(newOffsetX, 0), 0);

        // Notify if center item changed
        if (closestItem !== this.currentCenterItem) {
            this.currentCenterItem = closestItem;
            if (this.onCenterItemChanged) {
                this.onCenterItemChanged(closestItem);
            }
        }

        // Snap complete detection (optional)
        const delta = Math.abs(newOffsetX - clampedTarget);
        if (!this.snapping && delta > 1) {
            this.snapping = true;
        } else if (this.snapping && delta <= 1) {
            this.snapping = false;
            if (this.onSnapComplete) {
                this.onSnapComplete(closestItem);
            }
        }
    }

    private getClosestToCenterItem(): cc.Node {
        const offsetX = this.scrollView.getScrollOffset().x;
        const centerX = offsetX + this.scrollView.node.width / 2;

        const items = this.content.children;
        let closestItem: cc.Node = null;
        let closestDistance = Number.MAX_VALUE;

        for (let item of items) {
            const itemCenter = item.x + item.width / 2;
            const distance = Math.abs(centerX - itemCenter);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestItem = item;
            }
        }

        return closestItem;
    }

    public recalculateLayout() {
        const items = this.content.children;
        if (items.length > 0) {
            this.itemWidth = items[0].width;
            const layout = this.content.getComponent(cc.Layout);
            this.spacing = layout ? layout.spacingX : 0;
        }
    }
}
