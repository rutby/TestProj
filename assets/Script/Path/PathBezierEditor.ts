import PathUtils from "./PathUtils";

let STEP = 0.0001;
//================================================ 
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

    @property(cc.Graphics) graphicsBorder: cc.Graphics = null;
    @property(cc.Float) borderWidth: number = 10;
    @property(cc.Sprite) spBorder: cc.Sprite = null;

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
        this.viewBorder();
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
        let distance = this.getDistance();
        let percent = (this._dis % distance) / distance;

        if (this.nodeGhost) {
            this.nodeGhost.setPosition(PathUtils.lerpBezierPos(this.getPoints(), percent));
        }
    }

    private viewBorder() {
        if (!this.graphicsBorder) {
            return;
        }

        let percents = [];
        let points = [];
        let advance = 1 / this.splitCount;
        let p0 = null;
        for(let i = 0; i <= this.splitCount; i++) {
            let percent = i * advance;
            let p1 = PathUtils.lerpBezierPos(this.getPoints(), i * advance);
            if (p0) {
                let dir = p1.sub(p0).normalizeSelf();
                let pv0 = cc.v2(-dir.y, dir.x).multiplyScalar(this.borderWidth);
                let pv1 = cc.v2(dir.y, -dir.x).multiplyScalar(this.borderWidth);
                points.push(pv0.add(p0));
                points.push(pv1.add(p0));

                percents.push(percent);
                percents.push(percent);
            }
            p0 = p1;
        }

        this.graphicsBorder.clear();
        points.forEach((ele, index) => {
            if (index == 0) {
                this.graphicsBorder.moveTo(ele.x, ele.y);
            } else {
                this.graphicsBorder.lineTo(ele.x, ele.y);
            }
        });
        this.graphicsBorder.stroke();

        if (this.spBorder) {
            let tw = this.spBorder.spriteFrame.getTexture().width;
            let th = this.spBorder.spriteFrame.getTexture().height;
            let ow = 2;
            let oh = 20;

            let pBase = cc.v2(tw/2, tw/2);
            let x = [];
            let y = [];
            let nu = [];
            let nv = [];
            let triangles = [];

            let _x = [];
            let _y = [];
            // let _nu = [0, 0, 1, 1];
            let _nv = [0, 1, 0, 1];
            let _nu = [];
            let _triangles = [0, 1, 2, 2, 1, 3];
            points.forEach((ele, index) => {
                // if (index < 8) {
                    let index4 = index % 4;

                    _x.push(pBase.x + ele.x / ow * tw);
                    _y.push(pBase.y - ele.y / oh * th);
                    _nu.push(percents[index]);

                    if (index > 2 && (index4 == 1 || index4 == 3)) {
                        x = x.concat(_x);
                        y = y.concat(_y);
                        nu = nu.concat(_nu);
                        nv = nv.concat(_nv);
                        triangles = triangles.concat(_triangles.map(ele => ele + index - 3));

                        _x.length = 0;
                        _y.length = 0;
                        _nu.length = 0;
                    }
                // }
            });
            this.spBorder.spriteFrame.vertices = {
                x: x, // 左上 左下 右上 右下
                y: y,
                nu: nu,
                nv: nv,
                triangles: triangles,
            };
            this.spBorder.setVertsDirty();
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
