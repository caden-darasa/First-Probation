const { ccclass, property } = cc._decorator;

@ccclass
export default class ScrollTest extends cc.Component {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property
    lerpSpeed: number = 5;

    private isLerping: boolean = false;
    private targetContentX: number = 0;

    onLoad() {
        this.scrollView.node.on(cc.Node.EventType.TOUCH_END, this.onDragEnd, this);
        this.scrollView.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onDragEnd, this);
    }

    update(dt: number) {
        if (this.isLerping) {
            let currentX = this.scrollView.content.x;
            let newX = cc.misc.lerp(currentX, this.targetContentX, this.lerpSpeed * dt);
            this.scrollView.content.x = newX;

            if (Math.abs(newX - this.targetContentX) < 1) {
                this.scrollView.content.x = this.targetContentX;
                this.isLerping = false;
            }
        }
    }

    private onDragEnd() {
        const viewportCenter = this.scrollView.node.convertToWorldSpaceAR(cc.v2(this.scrollView.node.width / 2, 0)).x;

        let closestChild: cc.Node = null;
        let minDistance = Number.MAX_VALUE;

        for (let child of this.scrollView.content.children) {
            const childWorldPos = child.convertToWorldSpaceAR(cc.v2(0, 0)).x;
            const distance = Math.abs(childWorldPos - viewportCenter);

            if (distance < minDistance) {
                minDistance = distance;
                closestChild = child;
            }
        }

        if (closestChild) {
            this.snapToChild(closestChild);
        }
    }

    private snapToChild(child: cc.Node) {
        const content = this.scrollView.content;
        const scrollView = this.scrollView.node;

        // Convert child's world position to content's local space
        const childWorldPos = child.convertToWorldSpaceAR(cc.v2(0, 0));
        const childLocalPos = content.convertToNodeSpaceAR(childWorldPos);

        // ScrollView center in local space
        const centerOffset = this.scrollView.node.width / 2;

        // Calculate target content.x so child aligns with center
        const offsetX = childLocalPos.x;
        const targetX = -offsetX + centerOffset;

        // Clamp to scroll bounds
        const maxOffset = this.scrollView.getMaxScrollOffset().x;
        this.targetContentX = cc.misc.clampf(targetX, -maxOffset, 0);

        this.isLerping = true;
    }
}
