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
    private readonly MAX_LEVEL: number = 3;

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

    @property({ type: cc.AudioClip })
    bgClip: cc.AudioClip = null;

    private static _instance: GameManager = null;
    public static get instance(): GameManager {
        return this._instance;
    }

    private _ids: number[] = [];
    private _curPic: Picture = null;
    private _starSpawns: StarPoint[] = [];

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
    }

    public correctTouch(id: number, pos: cc.Vec3): void {
        if (!this._ids.includes(id)) {
            // Show green circle in 2 different points
            const leftFx = cc.instantiate(this.rightEffectPref) as cc.Node;
            const rightFx = cc.instantiate(this.rightEffectPref) as cc.Node;
            this._curPic.showCompletePoint(id, leftFx, rightFx);

            // Play star effect
            const starFx = cc.instantiate(this.starEffectPref) as cc.Node;
            this.effectContainer.addChild(starFx);
            starFx.setPosition(pos);
            let curId = this._ids.length;
            let toPos = ExtentionMethods.toLocalPosition(this._starSpawns[curId].node, this.effectContainer);
            cc.tween(starFx)
                .to(0.5, { position: toPos })
                .call(() => {
                    this._starSpawns[curId].runEffect();
                    starFx.destroy();
                })
                .start();

            // Add complete id
            this._ids.push(id);

            // Check game end
            if (this._ids.length >= this._curPic.leftDifPoints.length) {
                this.endGamePopup.active = true;
                this.endGame = true;
            }
        }
    }

    public onHomeClick(): void {
        AudioManager.instance.playClickButton();
        AudioManager.instance.stopBgm();
        // cc.director.loadScene("Home");
        this.scheduleOnce(() => {
            cc.director.loadScene("Home");
        }, 0.1);
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
        AudioManager.instance.playBgm(this.bgClip);
    }

    //#endregion

    //#region Private methods

    private initGame(): void {
        // Initialize level
        if (StaticData.CurrentLevel >= this.MAX_LEVEL) {
            StaticData.CurrentLevel = 0;
        }
        const level: cc.Node = cc.instantiate(this.pictures[StaticData.CurrentLevel]);
        this.playerController.node.addChild(level);
        level.setPosition(cc.v2(0, 0));
        this._curPic = level.getComponent(Picture);
        this.playerController.setLevel(
            this._curPic.leftPic,
            this._curPic.rightPic,
            this._curPic.leftDifPoints,
            this._curPic.rightDifPoints
        );

        // Initialize stars
        let amount = this._curPic.leftDifPoints.length;
        for (let i = 0; i < amount; i++) {
            let star = cc.instantiate(this.starPref) as cc.Node;
            this.starContainer.addChild(star);
            this._starSpawns.push(star.getComponent(StarPoint));
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
