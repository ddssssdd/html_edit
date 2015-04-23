var Action = function () {
    this.scence = null;
    this.context = null;
    this.context_top = null;
    this.clientRect = { top: 102400, left: 102400, right: 0, bottom: 0 };
    this.selected = false;
    this.resize_selected = 0;
    this.creating = false;
    this.done = false;
    this.deleted = false;
    this.points = [];
    this.groups = [];
    this.strokeColor = "black";
    this.fillColor = "black";
    this.lineWidth = 1;
    this.isgroup = false;
    this.scale = { x: 1, y: 1 };
    this.SELECT_BORDER = 0;
    this.CORNER_WIDTH = 10;
    Action.prototype.drawOne = function (con) {

    }
    Action.prototype.drawAll = function (con) {

    }
    Action.prototype.Draw = function () {
        if (this.deleted) {
            return;
        }
        if (this.creating) {
            this.context_top.clearRect(0, 0, this.context_top.canvas.width, this.context_top.canvas.height);
            this.drawOne(this.context_top, this.points, this.strokeColor, this.fillColor, this.lineWidth);
            return;
        }
        if (this.done) {
            if (this.selected) {
                this.drawAll(this.context_top);
                this.drawSelect();
                
            } else {
                //this.context.transform(2, 1, 1, 1, 1, 1);
                this.drawAll(this.context);
                
            }
            //console.log(this);
        }
    }
    Action.prototype.execute = function () {
        this.clientRect = { top: 102400, left: 102400, right: 0, bottom: 0 };
        this.selected = false;
        this.creating = false;
        this.done = false;
        this.resize_selected = 0;
        this.points = [];
        this.groups = [];
    }
    Action.prototype.drawSelect = function () {
        if (!this.context_top)
            return;
        if (!this.done)
            return;
        this.context_top.save();
        this.context_top.strokeStyle = "blue";
        this.context_top.lineWidth = 2;
        var x = this.clientRect.left - this.SELECT_BORDER / 2;
        var y = this.clientRect.top - this.SELECT_BORDER / 2;
        var w = this.clientRect.right - this.clientRect.left + this.SELECT_BORDER;
        var h = this.clientRect.bottom - this.clientRect.top + this.SELECT_BORDER;
        this.context_top.setLineDash([5]);
        this.context_top.strokeRect(x, y, w, h);
        this.context_top.restore();
        var r = this.CORNER_WIDTH / 2;
        //clear corner area
        this.context_top.clearRect(x - r, y - r, this.CORNER_WIDTH, this.CORNER_WIDTH); //left
        this.context_top.clearRect(x + w - r, y - r, this.CORNER_WIDTH, this.CORNER_WIDTH); //right
        this.context_top.clearRect(x - r, y + h - r, this.CORNER_WIDTH, this.CORNER_WIDTH); //left -bottom
        this.context_top.clearRect(x + w - r, y + h - r, this.CORNER_WIDTH, this.CORNER_WIDTH); //right-bottom
        //draw rect
        this.context_top.lineWidth = 1;
        this.context_top.strokeStyle = "blue";
        this.context_top.strokeRect(x - r, y - r, this.CORNER_WIDTH, this.CORNER_WIDTH); //left
        this.context_top.strokeRect(x +w- r, y - r, this.CORNER_WIDTH, this.CORNER_WIDTH); //right
        this.context_top.strokeRect(x - r, y +h- r, this.CORNER_WIDTH, this.CORNER_WIDTH); //left -bottom
        this.context_top.strokeRect(x + w - r, y + h - r, this.CORNER_WIDTH, this.CORNER_WIDTH); //right-bottom

        this.context_top.fillStyle = "black";
        this.context_top.textBaseline = "bottom";
        this.context_top.fillText(this.resize_selected + '', x + 20, y + 20);
        
    }
    Action.prototype.endCreate = function (e) {
        this.creating = false;
        this.points.push({ x: e.offsetX, y: e.offsetY });
        if (this.points.length > 5) {
            this.done = true;
            this.processPoint(this.points);
            this.groups.push({
                points: this.points,
                strokeColor: this.strokeColor,
                fillColor: this.fillColor,
                lineWidth: this.lineWidth
            });
            if (!this.isgroup) {
                this.points = [];
                this.scence.clone(this);
            } else {
                if (this.scence.commandList.indexOf(this) < 0) {
                    this.scence.commandList.push(this);
                }
            }
        }
        this.points = [];
    }
    Action.prototype.mouseup = function (e) {
        if (this.creating) { //if creating ,then end;
            this.endCreate(e);
        }
        this.Draw();
    }
    Action.prototype.mousedown = function (e) {
        this.creating = true;
        this.points = [];
        this.points.push({ x: e.offsetX, y: e.offsetY });
        this.Draw();
    }
    Action.prototype.mousemove = function (e) {
        if (this.creating) {
            this.points.push({ x: e.offsetX, y: e.offsetY });
            this.Draw();
        }
    }
    Action.prototype.mouseout = function (e) {
        this.mouseup(e);
    }
    Action.prototype.processPoint = function (points) {
        if (!this.isgroup) {
            var begin = { x: points[0].x, y: points[0].y };
            var end = { x: points[points.length - 1].x, y: points[points.length - 1].y };
            points = [begin, end];
            this.points = points;
        }
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            if (p.x > this.clientRect.right)
                this.clientRect.right = p.x;
            if (p.x < this.clientRect.left)
                this.clientRect.left = p.x;
            if (p.y < this.clientRect.top)
                this.clientRect.top = p.y;
            if (p.y > this.clientRect.bottom)
                this.clientRect.bottom = p.y;
        }
    }

    Action.prototype.inside = function (e) {
        this.selected = false;
        this.resize_selected = 0;
        var r = this.CORNER_WIDTH / 2;
        if ((e.offsetX >= this.clientRect.left-r && e.offsetX <= this.clientRect.right+r) &&
            (e.offsetY >= this.clientRect.top-r && e.offsetY <= this.clientRect.bottom+r)) {
            this.selected = true;
            //left corner
            if ((e.offsetX >= this.clientRect.left - r && e.offsetX <= this.clientRect.left + r) &&
            (e.offsetY >= this.clientRect.top - r && e.offsetY <= this.clientRect.top + r)) {
                this.resize_selected = 4;
            }
            //left - bottom corner
            if ((e.offsetX >= this.clientRect.left - r && e.offsetX <= this.clientRect.left + r) &&
            (e.offsetY >= this.clientRect.bottom - r && e.offsetY <= this.clientRect.bottom + r)) {
                this.resize_selected = 3;
            }
            //right corner
            if ((e.offsetX >= this.clientRect.right - r && e.offsetX <= this.clientRect.right + r) &&
            (e.offsetY >= this.clientRect.top - r && e.offsetY <= this.clientRect.top + r)) {
                this.resize_selected = 1;
            }
            //right -bottom corner
            if ((e.offsetX >= this.clientRect.right - r && e.offsetX <= this.clientRect.right + r) &&
            (e.offsetY >= this.clientRect.bottom - r && e.offsetY <= this.clientRect.bottom + r)) {
                this.resize_selected = 2;
            }

        }
        return this.selected;
    }
    Action.prototype.inRect = function (x1, y1, x2, y2) {
        this.selected = false;
        for (var j = 0; j < this.groups.length; j++) {
            for (var i = 0; i < this.groups[j].points.length; i++) {
                var p = this.groups[j].points[i];
                if (p.x >= Math.min(x1,x2) && p.x <= Math.max(x1,x2) && p.y >= Math.min(y1,y2) && p.y <= Math.max(y1,y2)) {
                    this.selected = true;
                    break;
                }
            }
        }
        return this.selected;
    }
    Action.prototype.move = function (e) {
        if (this.selected) {
            
            if (this.resize_selected == 0) {// select and move
                this.clientRect = { top: 102400, left: 102400, right: 0, bottom: 0 };
                for (var j = 0; j < this.groups.length; j++) {
                    for (var i = 0; i < this.groups[j].points.length; i++) {
                        var p = this.groups[j].points[i];
                        p.x = p.x + e.x;
                        p.y = p.y + e.y;
                    }
                    this.processPoint(this.groups[j].points);
                }
            } else if (this.resize_selected == 1) { //right corner
                this.clientRect.right += e.x;
                this.clientRect.top += e.y;
                this.resize(0, e.y, e.x, 0);
            } else if (this.resize_selected == 2) { //right bottom corner
                this.clientRect.right += e.x;
                this.clientRect.bottom += e.y;
                this.resize(0, 0, e.x, e.y);
            } else if (this.resize_selected == 3) { //left bottom corner
                this.clientRect.left += e.x;
                this.clientRect.bottom += e.y;
                this.resize(e.x, 0,0, e.y);
            } else if (this.resize_selected == 4) { //left corner
                this.clientRect.left += e.x;
                this.clientRect.top += e.y;
                this.resize(e.x, e.y, 0, 0);
            }
        }
    }
    Action.prototype.resize = function (left, top, right, bottom) {
        if (this.groups.length == 1) {
            var points = this.groups[0].points;
            var begin = points[0];
            var end = points[points.length - 1];
            if (begin.y > end.y) {
                begin.y += bottom;
                end.y += top;
            } else {
                begin.y += top;
                end.y += bottom;
            }
            if (begin.x > end.x) {
                begin.x += right;
                end.x += left;
            } else {
                begin.x += left;
                end.x += right;
            }
        }
    }
    Action.prototype.getStyle = function (other) {
        this.strokeColor = other.strokeColor;
        this.lineWidth = other.lineWidth;
        this.fillColor = other.fillColor;
        this.clientRect = { top: 102400, left: 102400, right: 0, bottom: 0 };
    }
    Action.prototype.setStyle=function(style){
        if (!style)
            return;
        for(var i=0;i<this.groups.length;i++){
            this.groups[i].lineWidth = style.lineWidth || this.groups[i].lineWidth;
            this.groups[i].strokeColor = style.strokeColor || this.groups[i].strokeColor;
            this.groups[i].fillColor = style.fillColor || this.groups[i].fillColor;
        }
        this.Draw();
    }

}
var Pen = function (scence) {
    this.scence = scence;
    this.context = scence.context;
    this.context_top = scence.context_top;
    this.isgroup = true;
    this.drawAll = function (con) {
        for (var j = 0; j < this.groups.length; j++) {
            var p = this.groups[j];
            this.drawOne(con, p.points, p.strokeColor, p.fillColor, p.lineWidth);
        }

    }
    this.drawOne = function (con, points, strokeColor, fillColor, lineWidth) {
        con.strokeStyle = strokeColor;
        con.lineWidth = lineWidth;
        con.fillStyle = fillColor;
        con.beginPath();
        con.moveTo(points[0].x, points[0].y);
        for (var i = 1; i < points.length; i++) {
            con.lineTo(points[i].x, points[i].y);
            con.stroke();
        }
        con.closePath();

    }
}
Pen.classname = "pen";
Pen.prototype = new Action();
var Line = function (scence) {
    this.scence = scence;
    this.context = scence.context;
    this.context_top = scence.context_top;
    this.drawAll = function (con) {
        for (var j = 0; j < this.groups.length; j++) {
            var p = this.groups[j];
            this.drawOne(con, p.points, p.strokeColor, p.fillColor, p.lineWidth);
        }

    }
    this.drawOne = function (con, points, strokeColor, fillColor, lineWidth) {
        con.strokeStyle = strokeColor;
        con.lineWidth = lineWidth;
        con.fillStyle = fillColor;
        con.beginPath();
        con.moveTo(points[0].x, points[0].y);
        con.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        con.stroke();
        con.closePath();
    }
    
}
Line.classname = "line";
Line.prototype = new Action();
var Rect = function (scence) {
    this.scence = scence;
    this.context = scence.context;
    this.context_top = scence.context_top;
    this.fillColor = "white";
    this.drawAll = function (con) {
        for (var j = 0; j < this.groups.length; j++) {
            var p = this.groups[j];
            this.drawOne(con, p.points, p.strokeColor, p.fillColor, p.lineWidth);
        }

    }
    this.drawOne = function (con, points, strokeColor, fillColor, lineWidth) {
        con.strokeStyle = strokeColor;
        con.lineWidth = lineWidth;
        con.fillStyle = fillColor;

        con.strokeRect(points[0].x, points[0].y, points[points.length - 1].x - points[0].x, points[points.length - 1].y - points[0].y);
        con.fillRect(points[0].x, points[0].y, points[points.length - 1].x - points[0].x, points[points.length - 1].y - points[0].y);


    }

}

Rect.classname = "rect";
Rect.prototype = new Action();

var Circle = function (scence) {
    this.scence = scence;
    this.context = scence.context;
    this.context_top = scence.context_top;
    this.fillColor = "white";
    this.drawAll = function (con) {
        for (var j = 0; j < this.groups.length; j++) {
            var p = this.groups[j];
            this.drawOne(con, p.points, p.strokeColor, p.fillColor, p.lineWidth);
        }

    }
    this.drawOne = function (con, points, strokeColor, fillColor, lineWidth) {
        con.strokeStyle = strokeColor;
        con.lineWidth = lineWidth;
        con.fillStyle = fillColor;
        var x = points[0].x;
        var y = points[0].y;
        var w = points[points.length - 1].x - points[0].x;
        var h = points[points.length - 1].y - points[0].y;
        var fill = false;

        var kappa = .5522848,
            ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = x + w,           // x-end
            ye = y + h,           // y-end
            xm = x + w / 2,       // x-middle
            ym = y + h / 2;       // y-middle

        con.beginPath();
        con.moveTo(x, ym);
        con.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        con.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        con.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        con.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        //ctx.closePath(); // not used correctly, see comments (use to close off open path)
        /*if (fill) {
            con.fill();
        } else {
            con.stroke();
        }*/
        con.stroke();
        con.fill();

    }

}

Circle.classname = "circle";
Circle.prototype = new Action();
