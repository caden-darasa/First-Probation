const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioManager extends cc.Component {
    private readonly BGM_VOLUME: string = "bgm_volume";
    private readonly SOUND_VOLUME: string = "sound_volume";
    public static instance: AudioManager = null;

    @property(cc.AudioSource)
    bgMusic: cc.AudioSource = null;

    @property([cc.AudioSource])
    soundEffects: cc.AudioSource[] = [];

    @property({ type: cc.AudioClip })
    clickButton: cc.AudioClip = null;

    private _bgmVolume: number = 1;
    private _sfxVolume: number = 1;

    //#region Public methods

    public stopBgm(): void {
        this.bgMusic.stop();
    }

    public playBgm(clip: cc.AudioClip): void {
        this.bgMusic.clip = clip;
        this.bgMusic.volume = this._bgmVolume;
        this.bgMusic.play();
    }

    public playSfx(clip: cc.AudioClip): void {
        for (let i = 0; i < this.soundEffects.length; i++) {
            if (!this.soundEffects[i].isPlaying) {
                this.soundEffects[i].clip = clip;
                this.soundEffects[i].volume = this._sfxVolume;
                this.soundEffects[i].play();
                break;
            }
        }
    }

    public setBgmVolume(volume: number): void {
        this._bgmVolume = volume;
        this.bgMusic.volume = volume;
        cc.sys.localStorage.setItem(this.BGM_VOLUME, volume);
    }

    public setSfxVolume(volume: number): void {
        this._sfxVolume = volume;
        for (let i = 0; i < this.soundEffects.length; i++) {
            this.soundEffects[i].volume = volume;
        }
        cc.sys.localStorage.setItem(this.SOUND_VOLUME, volume);
    }

    public getBgmVolume(): number {
        return this._bgmVolume;
    }

    public getSfxVolume(): number {
        return this._sfxVolume;
    }

    public playClickButton(): void {
        this.playSfx(this.clickButton);
    }

    //#endregion

    //#region Life-cycle callbacks

    onLoad(): void {
        if (AudioManager.instance === null) {
            AudioManager.instance = this;
            cc.game.addPersistRootNode(this.node);
        }
        else {
            this.node.destroy();
        }
    }

    start(): void {
        this._bgmVolume = cc.sys.localStorage.getItem(this.BGM_VOLUME) || 1;
        this._sfxVolume = cc.sys.localStorage.getItem(this.SOUND_VOLUME) || 1;
        this.setBgmVolume(this._bgmVolume);
        this.setSfxVolume(this._sfxVolume);
    }

    //#endregion
}
