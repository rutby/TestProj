export default class PathUtils{
    /**
     * 获取贝塞尔曲线的差值坐标点(0-1)
     */
    static lerpBezierPos(posArr: cc.Vec2[], percent: number) {
        while(posArr.length > 3) {
            var newPosArr = [];
            var lastOne = posArr[0];
            for (var i = 1; i < posArr.length; i++) {
                var currOne = posArr[i];
                var vec = currOne.sub(lastOne);
                var newPos = lastOne.add(vec.multiplyScalar(percent))
                newPosArr.push(newPos);
                lastOne = currOne;
            }
            posArr = newPosArr;
        }

        var p1 = posArr[0];
        var p2 = posArr[1];
        var p3 = posArr[2];
        var v1 = p2.sub(p1);
        var v2 = p3.sub(p2);
        var vp1 = p1.add(v1.multiplyScalar(percent));
        var vp2 = p2.add(v2.multiplyScalar(percent));

        let o = cc.Vec2.ZERO;
        return cc.Vec2.lerp(o, vp1, vp2, percent);
    }

    /**
     * 获取直线的差值坐标点(0-1)
     */
    static lerpLinePos(posArr: cc.Vec2[], percent: number): cc.Vec2 {
        var p1 = posArr[0];
        var p2 = posArr[1];
        return p1.lerp(p2, percent);
    }

    /**
     * 获取组合曲线的差值坐标点
     */
    static lerpCurves(curveArr: any, disCur: number) {
        var pos = null;
        var base = 0;
        
        for (var curveIndex = 0; curveIndex < curveArr.length; curveIndex++) {
            var curve = curveArr[curveIndex];
            var {dis, points, type} = curve;
            var percent = (disCur - base) / dis;
            if (percent < 1) {
                switch(type) {
                    case 0: 
                        pos = this.lerpLinePos(points, percent);
                        break;
                    case 1: 
                        pos = this.lerpBezierPos(points, percent);
                        break;
                }
                break;
            }
            base += dis;
        }

        if (pos == null) {
            var lastCurve = curveArr[curveArr.length - 1];
            pos = lastCurve.points[lastCurve.points.length - 1];
        }
        return pos;
    }
}
