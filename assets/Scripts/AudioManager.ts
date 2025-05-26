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

    private bgmVolume: number = 1;
    private sfxVolume: number = 1;
    private sfxId: number = 0;

    //#region Public methods

    public playBgm(clip: cc.AudioClip): void {
        this.bgMusic.clip = clip;
        this.bgMusic.volume = this.bgmVolume;
        this.bgMusic.play();
    }

    public playSfx(clip: cc.AudioClip): void {
        if (this.sfxId >= this.soundEffects.length)
            this.sfxId = 0;

        const source = this.soundEffects[this.sfxId];

        if (source.isPlaying)
            source.stop();

        source.clip = clip;
        source.volume = this.sfxVolume;
        source.play();
        this.sfxId++;
    }

    public setBgmVolume(volume: number): void {
        this.bgmVolume = volume;
        this.bgMusic.volume = volume;
        cc.sys.localStorage.setItem(this.BGM_VOLUME, volume);
    }

    public setSfxVolume(volume: number): void {
        this.sfxVolume = volume;
        for (let i = 0; i < this.soundEffects.length; i++) {
            this.soundEffects[i].volume = volume;
        }
        cc.sys.localStorage.setItem(this.SOUND_VOLUME, volume);
    }

    public getBgmVolume(): number {
        return this.bgmVolume;
    }

    public getSfxVolume(): number {
        return this.sfxVolume;
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
        this.bgmVolume = cc.sys.localStorage.getItem(this.BGM_VOLUME) || 1;
        this.sfxVolume = cc.sys.localStorage.getItem(this.SOUND_VOLUME) || 1;
        this.setBgmVolume(this.bgmVolume);
        this.setSfxVolume(this.sfxVolume);
        // this.bgMusic.play();
    }

    //#endregion
}
