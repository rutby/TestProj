const {ccclass, property, executeInEditMode} = cc._decorator;
@ccclass
@executeInEditMode
export default class ActPuzzleSlice extends cc.Component {
    @property(cc.Integer) type: number = 0;

    private _material: cc.Material = null;

    //================================================ cc.Component
    protected onLoad(): void {
        this._material = this.getComponent(cc.Sprite).getMaterial(0);

        this.sync();
    }

    protected update(dt: number): void {
        // if (CC_EDITOR) {
        //     this.sync();
        // }
    }

    //================================================ private
    private sync() {
        let level0 = 0.333;
        let level1 = 0.666;
        let arr = [
            // 0
            {
                uv0: [0, 0],
                uv1: [level0, level0],
                corner_type: 1,
                shape_type0: 0,
                shape_type1: 2,
                shape_type2: 1,
                shape_type3: 0,
            },
            {
                uv0: [level0, 0],
                uv1: [level1, level0],
                corner_type: 0,
                shape_type0: 0,
                shape_type1: 1,
                shape_type2: 2,
                shape_type3: 1,
            },
            {
                uv0: [level1, 0],
                uv1: [1, level0],
                corner_type: 2,
                shape_type0: 0,
                shape_type1: 0,
                shape_type2: 1,
                shape_type3: 2,
            },

            // 1
            {
                uv0: [0, level0],
                uv1: [level0, level1],
                corner_type: 0,
                shape_type0: 2,
                shape_type1: 1,
                shape_type2: 2,
                shape_type3: 0,
            },
            {
                uv0: [level0, level0],
                uv1: [level1, level1],
                corner_type: 0,
                shape_type0: 1,
                shape_type1: 2,
                shape_type2: 1,
                shape_type3: 2,
            },
            {
                uv0: [level1, level0],
                uv1: [1, level1],
                corner_type: 0,
                shape_type0: 2,
                shape_type1: 0,
                shape_type2: 2,
                shape_type3: 1,
            },

            // 2
            {
                uv0: [0, level1],
                uv1: [level0, 1],
                corner_type: 4,
                shape_type0: 1,
                shape_type1: 2,
                shape_type2: 0,
                shape_type3: 0,
            },
            {
                uv0: [level0, level1],
                uv1: [level1, 1],
                corner_type: 0,
                shape_type0: 2,
                shape_type1: 1,
                shape_type2: 0,
                shape_type3: 1,
            },
            {
                uv0: [level1, level1],
                uv1: [1, 1],
                corner_type: 3,
                shape_type0: 1,
                shape_type1: 0,
                shape_type2: 0,
                shape_type3: 2,
            },
        ]
        this._material.setProperty('c_uv0', arr[this.type].uv0);
        this._material.setProperty('c_uv1', arr[this.type].uv1);
        this._material.setProperty('c_corner_type', arr[this.type].corner_type);

        this._material.setProperty('c_shape_type0', arr[this.type].shape_type0);
        this._material.setProperty('c_shape_type1', arr[this.type].shape_type1);
        this._material.setProperty('c_shape_type2', arr[this.type].shape_type2);
        this._material.setProperty('c_shape_type3', arr[this.type].shape_type3);
    }
}
