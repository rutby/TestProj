const {ccclass, property} = cc._decorator;
@ccclass
export default class PuzzleShaderScene extends cc.Component {
    protected start(): void {
        cc.debug.setDisplayStats(false);
    }
}

cc.dynamicAtlasManager.enabled = false;
