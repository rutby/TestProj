const { ccclass, property, executeInEditMode } = cc._decorator;
@ccclass
@executeInEditMode
export default class MeshCustom extends cc.Component {
    @property(cc.Boolean) dirty: boolean = false;

    //================================================ cc.Component
    protected onLoad(): void {
        this.sync();
    }

    private _x: number[] = [0, 563, 0, 563];
    private _y: number[] = [387, 387, 0, 0];

    private _pSrc: cc.Vec2 = cc.v2(0, 0);
    private _pDst: cc.Vec2 = cc.v2(563, 387);
    private _duration: number = 1;

    private _time: number = null;
    protected update(dt: number): void {
        if (this.dirty) {
            this.dirty = false;

            this._time = 0;
        }

        if (this._time != null) {
            this._time += dt;
            

            let x = this.lerp(this._time, 0, this._duration, this._pSrc.x, this._pDst.x);
            let y = this.lerp(this._time, 0, this._duration, this._pSrc.y, this._pDst.y);

            this._x[1] = x;
            this._y[1] = y;

            this.sync();

            if (this._time > this._duration) {
                this._time = null;
            }
        }
    }

    //================================================ private
    private sync() {
        let sprite = this.getComponent(cc.Sprite);
        sprite.spriteFrame.vertices = {
            // 左下 右下 左上 右上
            x: this._x,
            y: this._y,
            nu: [0, 1, 0, 1],
            nv: [1, 1, 0, 0],
            triangles: [0, 1, 2, 1, 3, 2],
        };
        sprite.setVertsDirty();
    }

    //================================================ utils
    private newMesh2(indices, verts, uv): cc.Mesh {
        let gfx = cc.gfx;
        let mesh = new cc.Mesh();
        mesh.init(gfx.VertexFormat.XY_UV, verts.length);
        mesh.setVertices(gfx.ATTR_POSITION, verts);
        mesh.setIndices(indices, 0);
        mesh.setVertices(gfx.ATTR_UV0, uv);
        mesh.setPrimitiveType(gfx.PT_TRIANGLES, 0);
        return mesh;
    }

    private lerp(v, a, b, m, n) {
        if (a == b || m == n) {
            return m;
        }

        let min0 = a < b? a: b;
        let max0 = a < b? b: a;
        let min1 = a < b? m: n;
        let max1 = a < b? n: m;

        let ratio = (v - min0) / (max0 - min0);
        ratio = cc.misc.clamp01(ratio);
        return min1 + ratio * (max1 - min1);
    }

    //================================================ prefab
    onBtnClick() {
        this.dirty = true;
    }
}