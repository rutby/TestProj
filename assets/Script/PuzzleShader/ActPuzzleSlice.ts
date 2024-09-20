const {ccclass, property, executeInEditMode} = cc._decorator;
@ccclass
@executeInEditMode
export default class ActPuzzleSlice extends cc.Component {
    @property(cc.Node) nodeShape: cc.Node = null;
    @property(cc.Node) nodeBorder: cc.Node = null;
    @property(cc.Node) nodeBorderSource: cc.Node = null;
    @property(cc.Integer) type: number = 0;

    private _material: cc.Material = null;

    //================================================ cc.Component
    protected onLoad(): void {
        this._material = this.nodeShape.getComponent(cc.Sprite).getMaterial(0);

        this.sync();
    }

    protected update(dt: number): void {
        if (CC_EDITOR) {
            this.sync();
        }
    }

    //================================================ private
    private sync() {
        /**
         * 1. 形状
         */
        let styleArr = [
            [
                [0, 2, 1, 0], // corner1
                [0, 1, 2, 1], // generated
                [0, 0, 1, 2], // corner2
                [2, 1, 1, 0], // generated
                [1, 2, 1, 2], // generated
                [2, 0, 2, 1], // generated
                [2, 1, 0, 0], // corner4
                [2, 1, 0, 2], // generated
                [1, 0, 0, 2], // corner3
            ],
            // [
            //     [0, 1, 2, 0],
            //     [0, 0, 2, 1],
            //     [2, 0, 0, 1],
            //     [1, 2, 0, 0],
            // ],
            // [
            //     [0, 1, 2, 0],
            //     [0, 0, 1, 2],
            //     [2, 0, 0, 1],
            //     [2, 1, 0, 0],
            // ],
            // [
            //     [0, 2, 1, 0],
            //     [0, 0, 2, 1],
            //     [1, 0, 0, 2],
            //     [1, 2, 0, 0],
            // ],
        ];
        let styleIndex = this.random(0, styleArr.length - 1);
        let styleList = styleArr[styleIndex];
        let sliceCount = Math.sqrt(styleList.length);
        let advance = 1 / sliceCount;
        let width = advance - 0.003;
        let elements = [];
        let cellSize = 528 / sliceCount;
        let half = 528/2;
        for(let row = 0; row < sliceCount; row++) {
            for(let col = 0; col < sliceCount; col++) {
                let element = {
                    uv0: [0, 0],
                    uv1: [0, 0],
                    corner_type: 0,
                    shape_type: styleList[row * sliceCount + col],
                    pos: cc.v2(col * cellSize + cellSize / 2 - half, -(row * cellSize + cellSize / 2 - half)),
                };

                element.uv0[0] = col * advance;
                element.uv1[0] = col * advance + width;
                if (col == sliceCount - 1) {
                    element.uv1[0] = 1;
                }

                element.uv0[1] = row * advance;
                element.uv1[1] = row * advance + width;
                if (row == sliceCount - 1) {
                    element.uv1[1] = 1;
                }

                let corner_type = 0;
                if (row == 0 && col == 0) {
                    corner_type = 1;
                }
                if (row == 0 && col == sliceCount - 1) {
                    corner_type = 2;
                }
                if (row == sliceCount - 1 && col == sliceCount - 1) {
                    corner_type = 3;
                }
                if (row == sliceCount - 1 && col == 0) {
                    corner_type = 4;
                }
                element.corner_type = corner_type;

                elements.push(element);
            }
        }

        let target = elements[this.type];
        this._material.setProperty('c_uv0', target.uv0);
        this._material.setProperty('c_uv1', target.uv1);
        this._material.setProperty('c_corner_type', target.corner_type);
        this._material.setProperty('c_shape_type', target.shape_type);
        this.node.position = target.pos;
        this.nodeShape.position = this.node.position.negate();

        /**
         * 2. 边框
         */
        this.nodeBorder.destroyAllChildren();
        let arr = ['top', 'right', 'btm', 'left'];
        arr.forEach((ele, index) => {
            let shape_type = target.shape_type[index];
            let name = `surround_${ele}${shape_type}`;
            if (shape_type == 0) {
                name += target.corner_type;
            }

            let child = this.nodeBorderSource.getChildByName(name);
            if (child) {
                let node = cc.instantiate(child);
                node.active = true;
                node.parent = this.nodeBorder;
            }

        });
    }

    //================================================ utils
    private random(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
}

// let styleArr = [
//     [
//         [0, 2, 1, 0],
//         [0, 0, 1, 2],
//         [1, 0, 0, 2],
//         [2, 1, 0, 0],
//     ],
//     [
//         [0, 1, 2, 0],
//         [0, 0, 2, 1],
//         [2, 0, 0, 1],
//         [1, 2, 0, 0],
//     ],
//     [
//         [0, 1, 2, 0],
//         [0, 0, 1, 2],
//         [2, 0, 0, 1],
//         [2, 1, 0, 0],
//     ],
//     [
//         [0, 2, 1, 0],
//         [0, 0, 2, 1],
//         [1, 0, 0, 2],
//         [1, 2, 0, 0],
//     ],
// ];

// let styleArr = [
//     // 0
//     [
//         [0, 2, 1, 0],
//         [0, 0, 1, 2],
//         [1, 0, 0, 2],
//         [2, 1, 0, 0],
//     ],
//     [
//         [0, 2, 1, 0],
//         [0, 0, 1, 2],
//         [1, 0, 0, 2],
//         [1, 2, 0, 0],
//     ],
//     [
//         [0, 2, 1, 0],
//         [0, 0, 1, 2],
//         [2, 0, 0, 1],
//         [2, 1, 0, 0],
//     ],
//     [
//         [0, 2, 1, 0],
//         [0, 0, 1, 2],
//         [2, 0, 0, 1],
//         [1, 2, 0, 0],
//     ],

//     // 1
//     [
//         [0, 2, 1, 0],
//         [0, 0, 2, 1],
//         [1, 0, 0, 2],
//         [2, 1, 0, 0],
//     ],
//     [
//         [0, 2, 1, 0],
//         [0, 0, 2, 1],
//         [1, 0, 0, 2],
//         [1, 2, 0, 0],
//     ],
//     [
//         [0, 2, 1, 0],
//         [0, 0, 2, 1],
//         [2, 0, 0, 1],
//         [2, 1, 0, 0],
//     ],
//     [
//         [0, 2, 1, 0],
//         [0, 0, 2, 1],
//         [2, 0, 0, 1],
//         [1, 2, 0, 0],
//     ],

//      // 2
//      [
//         [0, 1, 2, 0],
//         [0, 0, 2, 1],
//         [1, 0, 0, 2],
//         [2, 1, 0, 0],
//     ],
//     [
//         [0, 1, 2, 0],
//         [0, 0, 2, 1],
//         [1, 0, 0, 2],
//         [1, 2, 0, 0],
//     ],
//     [
//         [0, 1, 2, 0],
//         [0, 0, 2, 1],
//         [2, 0, 0, 1],
//         [2, 1, 0, 0],
//     ],
//     [
//         [0, 1, 2, 0],
//         [0, 0, 2, 1],
//         [2, 0, 0, 1],
//         [1, 2, 0, 0],
//     ],

//     // 3
//     [
//         [0, 1, 2, 0],
//         [0, 0, 1, 2],
//         [1, 0, 0, 2],
//         [2, 1, 0, 0],
//     ],
//     [
//         [0, 1, 2, 0],
//         [0, 0, 1, 2],
//         [1, 0, 0, 2],
//         [1, 2, 0, 0],
//     ],
//     [
//         [0, 1, 2, 0],
//         [0, 0, 1, 2],
//         [2, 0, 0, 1],
//         [2, 1, 0, 0],
//     ],
//     [
//         [0, 1, 2, 0],
//         [0, 0, 1, 2],
//         [2, 0, 0, 1],
//         [1, 2, 0, 0],
//     ],
// ];