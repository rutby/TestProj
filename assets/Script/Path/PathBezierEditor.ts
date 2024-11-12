import PathUtils from "./PathUtils";

const {ccclass, property, menu, executeInEditMode} = cc._decorator;

@ccclass
@executeInEditMode
export default class RouteEditorCurveBezier extends cc.Component {
    @property(cc.PolygonCollider) collider: cc.PolygonCollider = null;
    @property(cc.Graphics) graphicsCurve: cc.Graphics = null;
    @property(cc.Graphics) graphicsLength: cc.Graphics = null;
    @property(cc.Node) nodeGhost: cc.Node = null;
    @property(cc.Float) speed: number = 200;
    @property(cc.Integer) splitCount: number = 20;
    @property(cc.Boolean) showSplitSegments: boolean = false;

    _dis: number = 0;

    //================================================ cc.Component
    update(dt) {
        if (!this.collider) {
            return;
        }
        this._dis += this.speed * dt;

        this.viewCurve(this.collider);
        this.viewPos();
        this.viewDistance(this.splitCount);
    }

    //================================================ 
    public getPoints(): cc.Vec2[] {
        return this.collider.points;
    }

    public getDistance(): number {
        var posArr = this.collider.points;
        var step = this.splitCount;
        var dis = 0;
        var lastOne = posArr[0];
        for (var i = 1; i < step; i++) {
            var pos = PathUtils.lerpBezierPos(posArr, i / step);
            dis += pos.sub(lastOne).mag();
            lastOne = pos;
        }
        return dis;
    }

    //================================================ private
    private viewCurve(collider: cc.PolygonCollider) {
        if (!this.graphicsCurve) {
            return;
        }

        var p1 = collider.points[0] as cc.Vec2;
        var p2 = collider.points[1] as cc.Vec2;
        var p3 = collider.points[2] as cc.Vec2;
        var p4 = collider.points[3] as cc.Vec2;
        this.graphicsCurve.clear();
        this.graphicsCurve.moveTo(p1.x, p1.y);
        var isCubic = p4 != null;
        isCubic? this.graphicsCurve.bezierCurveTo(p2.x, p2.y, p3.x, p3.y, p4.x, p4.y): this.graphicsCurve.quadraticCurveTo(p2.x, p2.y, p3.x, p3.y);
        this.graphicsCurve.stroke();
    }

    private viewPos() {
        let points = this.getPoints();
        let distance = this.getDistance();
        let percent = (this._dis % distance) / distance;

        if (this.nodeGhost) {
            this.nodeGhost.setPosition(PathUtils.lerpBezierPos(points, percent));
        }
    }

    private viewDistance(step: number) {
        if (!this.graphicsLength) {
            return;
        }

        if (!this.showSplitSegments) {
            this.graphicsLength.clear();
            return;
        }

        var posArr = this.collider.points;
        this.graphicsLength.clear();
        this.graphicsLength.moveTo(posArr[0].x, posArr[0].y);
        for (var i = 0; i < step; i++) {
            var pos = PathUtils.lerpBezierPos(posArr, i / step);
            this.graphicsLength.lineTo(pos.x, pos.y);
        }
        this.graphicsLength.lineTo(posArr[posArr.length - 1].x, posArr[posArr.length - 1].y);
        this.graphicsLength.stroke();
    }
}
