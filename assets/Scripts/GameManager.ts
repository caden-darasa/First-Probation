import AudioManager from "./AudioManager";
import Picture from "./Picture";
import PlayerController from "./PlayerController";
import StarPoint from "./StarPoint";
import StaticData from "./StaticData";
import ExtentionMethods from "./Utils/ExtentionMethods";
import PoolManager from "./Utils/PoolManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
    private readonly KEY_WRONG: string = "wrongEffect";

    @property(cc.Canvas)
    canvas: cc.Canvas = null;

    @property(cc.Camera)
    camera: cc.Camera = null;

    @property(PlayerController)
    playerController: PlayerController = null;

    @property(cc.Node)
    effectContainer: cc.Node = null;

    @property(cc.Node)
    starContainer: cc.Node = null;

    @property(cc.Node)
    endGamePopup: cc.Node = null;

    @property([cc.Prefab])
    pictures: cc.Prefab[] = [];

    @property(cc.Prefab)
    wrongEffectPref: cc.Prefab = null;

    @property(cc.Prefab)
    rightEffectPref: cc.Prefab = null;

    @property(cc.Prefab)
    starEffectPref: cc.Prefab = null;

    @property(cc.Prefab)
    starPref: cc.Prefab = null;

    @property(cc.Node)
    settingsPopup: cc.Node = null;

    @property({ type: cc.AudioClip })
    wrongClip: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    correctClip: cc.AudioClip = null;

    private static _instance: GameManager = null;
    public static get instance(): GameManager {
        return this._instance;
    }

    private ids: number[] = [];
    private curPic: Picture = null;
    private starSpawns: StarPoint[] = [];

    //#region Properties

    public endGame: boolean = false;

    //#endregion

    //#region Public methods

    public incorrectTouch(pos: cc.Vec3): void {
        const wrongFx = this.getWrongEffect();
        wrongFx.setPosition(pos);
        let anim = wrongFx.getComponent(cc.Animation);
        anim.stop();
        anim.play("wrong-fx");
        AudioManager.instance.playSfx(this.wrongClip);
    }

    public correctTouch(id: number, pos: cc.Vec3): void {
        if (!this.ids.includes(id)) {
            // Show green circle in 2 different points
            const leftFx = cc.instantiate(this.rightEffectPref) as cc.Node;
            const rightFx = cc.instantiate(this.rightEffectPref) as cc.Node;
            this.curPic.showCompletePoint(id, leftFx, rightFx);

            // Play star effect
            AudioManager.instance.playSfx(this.correctClip);
            const starFx = cc.instantiate(this.starEffectPref) as cc.Node;
            this.effectContainer.addChild(starFx);
            starFx.setPosition(pos);
            let curId = this.ids.length;
            let toPos = ExtentionMethods.toLocalPosition(this.starSpawns[curId].node, this.effectContainer);
            cc.tween(starFx)
                .to(0.5, { position: toPos })
                .call(() => {
                    this.starSpawns[curId].runEffect();
                    starFx.destroy();
                })
                .start();

            // Add complete id
            this.ids.push(id);

            // Check game end
            if (this.ids.length >= this.curPic.leftDifPoints.length) {
                this.endGamePopup.active = true;
                this.endGame = true;
            }
        }
    }

    public onHomeClick(): void {
        if (this.endGame)
            return;

        AudioManager.instance.playClickButton();
        this.scheduleOnce(() => {
            cc.director.loadScene("Home");
        }, 0.2);
    }

    public onSettingsClick(): void {
        if (this.endGame)
            return;

        this.settingsPopup.active = true;
        AudioManager.instance.playClickButton();
    }

    //#endregion

    //#region Life-cycle callbacks

    onLoad(): void {
        GameManager._instance = this;
        PoolManager.instance.register(this.KEY_WRONG, this.wrongEffectPref);
        ExtentionMethods.initCamera(this.camera, this.canvas);
    }

    start(): void {
        const screenRatio = cc.view.getFrameSize().width / cc.view.getFrameSize().height;
        let fitHeight = screenRatio > 1.5;
        this.canvas.fitWidth = !fitHeight;
        this.canvas.fitHeight = fitHeight;

        this.initGame();
    }

    //#endregion

    //#region Private methods

    private initGame(): void {
        // Initialize level
        if (StaticData.CurrentLevel >= this.pictures.length) {
            StaticData.CurrentLevel = 0;
        }
        const level: cc.Node = cc.instantiate(this.pictures[StaticData.CurrentLevel]);
        this.playerController.node.addChild(level);
        level.setPosition(cc.v2(0, 0));
        this.curPic = level.getComponent(Picture);
        this.playerController.setLevel(
            this.curPic.leftPic,
            this.curPic.rightPic,
            this.curPic.leftDifPoints,
            this.curPic.rightDifPoints
        );

        // Initialize stars
        let amount = this.curPic.leftDifPoints.length;
        for (let i = 0; i < amount; i++) {
            let star = cc.instantiate(this.starPref) as cc.Node;
            this.starContainer.addChild(star);
            this.starSpawns.push(star.getComponent(StarPoint));
        }
    }

    private getWrongEffect(): cc.Node {
        const fx = PoolManager.instance.get(this.KEY_WRONG, this.effectContainer) as cc.Node;
        this.scheduleOnce(() => {
            PoolManager.instance.put(this.KEY_WRONG, fx);
        }, 1);
        return fx;
    }

    //#endregion
}
