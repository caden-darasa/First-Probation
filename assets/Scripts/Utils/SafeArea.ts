const { ccclass, property } = cc._decorator;

@ccclass
export default class SafeArea extends cc.Component {
    @property({ tooltip: "Apply top inset" })
    useTop: boolean = false;

    @property({ tooltip: "Apply bottom inset" })
    useBottom: boolean = false;

    @property({ tooltip: "Apply left inset" })
    useLeft: boolean = false;

    @property({ tooltip: "Apply right inset" })
    useRight: boolean = false;

    onLoad() {
        this.applySafeArea();
        cc.view.setResizeCallback(() => this.applySafeArea());
    }

    applySafeArea() {
        const widget = this.getComponent(cc.Widget);
        if (!widget) return;

        const frameSize = cc.view.getFrameSize();
        const isPortrait = frameSize.height > frameSize.width;

        // Approximate insets (based on iPhone X family)
        const insetTop = isPortrait ? 44 : 0;
        const insetBottom = isPortrait ? 34 : 21;
        const insetLeft = isPortrait ? 0 : 44;
        const insetRight = isPortrait ? 0 : 44;

        if (this.useTop) widget.top += insetTop;
        if (this.useBottom) widget.bottom += insetBottom;
        if (this.useLeft) widget.left += insetLeft;
        if (this.useRight) widget.right += insetRight;

        widget.updateAlignment();
    }
}
