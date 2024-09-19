const {ccclass, property} = cc._decorator;

@ccclass
export default class TestSpineCacheModeScene extends cc.Component {
    @property(sp.Skeleton) spine: sp.Skeleton = null;
    start () {
        cc.debug.setDisplayStats(false);
    }

    //================================================ prefab
    private onBtnSwitch() {
        this.spine.setAnimation(0, "cat_level3_act5", false);
        this.spine.addAnimation(0, "cat_level3_idle6", true);
    }

    private onBtnReset() {
        this.spine.setAnimation(0, "cat_level3_idle7", true);
    }
}
