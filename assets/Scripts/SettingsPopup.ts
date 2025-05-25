import AudioManager from "./AudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SettingsPopup extends cc.Component {

    @property(cc.Slider)
    music: cc.Slider = null;

    @property(cc.Slider)
    sound: cc.Slider = null;

    //#region Public methods

    public onMusicVolumeChange() {
        AudioManager.instance.setBgmVolume(this.music.progress);
    }

    public onSoundVolumeChange() {
        AudioManager.instance.setSfxVolume(this.sound.progress);
    }

    public onOkClick() {
        this.node.active = false;
        AudioManager.instance.playClickButton();
    }

    //#endregion

    //#region Life-cycle callbacks

    onEnable() {
        this.music.progress = AudioManager.instance.getBgmVolume();
        this.sound.progress = AudioManager.instance.getSfxVolume();
    }

    //#endregion

}
