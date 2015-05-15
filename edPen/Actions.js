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
    this.strokeColor = "rgb(0, 0, 0)";
    this.fillColor = "rgba(0, 0, 0)";
    this.lineWidth = 1;
    this.fontName = "Arial";
    this.fontSize = 32;
    this.opacity = 100;
    this.isgroup = false;
    this.scale = { x: 1, y: 1 };
    this.SELECT_BORDER = 0;
    this.CORNER_WIDTH = 10;
    this.ctrlSelect = false;
    this.classname = arguments.callee.classname ? arguments.callee.classname : "action";
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
            this.drawOne(this.context_top, this.points, this.strokeColor, this.fillColor, this.lineWidth,this.opacity);
            return;
        }
        if (this.done) {
            if (this.selected) {
                this.drawAll(this.context_top);
                this.drawSelect();
                
            } else {
                
                //this.context.globalAlpha = 0.2;
                this.drawAll(this.context);
                
            }
            //console.log(this);
        }
    }
    Action.prototype.execute = function (classname) {
        this.clientRect = { top: 102400, left: 102400, right: 0, bottom: 0 };
        this.selected = false;
        this.creating = false;
        this.done = false;
        this.resize_selected = 0;
        this.points = [];
        this.groups = [];
        this.classname = classname;
    }
    Action.prototype.drawSelect = function () {
        if (!this.context_top)
            return;
        if (!this.done)
            return;
        if (this.deleted) {
            return;
        }
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

        
        if (this.scence.debug && this.ctrlSelect) {
            this.drawDebugSelect(x, y, w, h);
        }
        
    }
    Action.prototype.drawDebugSelect = function (x, y, w, h) {
        var con = this.context_top;
        con.save();
        var outputCoords = function (x, y) {
            con.fillStyle = "red";
            var msg = "(" + x + "," + y+")";
            con.fillText(msg, x, y);
        }
        outputCoords(x , y ); //left
        outputCoords(x + w , y ); //right
        outputCoords(x , y + h ); //left -bottom
        outputCoords(x + w , y + h ); //right-bottom
        outputCoords(x + w / 2, y + h / 2); //center
        this.context_top.fillText("width=" + w, x + w / 2, y);
        this.context_top.fillText("height=" + h, x + w , y+h/2);
        this.context_top.strokeStyle = "red";
        this.context_top.setLineDash([2]);
        this.context_top.beginPath();
        this.context_top.moveTo(x, y);
        this.context_top.lineTo(x + w, y + h);
        this.context_top.stroke();
        this.context_top.beginPath();
        this.context_top.moveTo(x+w, y);
        this.context_top.lineTo(x, y + h);
        this.context_top.stroke();
        con.restore();
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
                lineWidth: this.lineWidth,
                opacity:this.opacity
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
        this.clientRect = {
            top: this.clientRect.top - this.lineWidth / 2,
            left: this.clientRect.left - this.lineWidth / 2,
            right: this.clientRect.right + this.lineWidth / 2,
            bottom:this.clientRect.bottom + this.lineWidth /2}
    }

    Action.prototype.inside = function (e) {

        this.selected = false;
        this.resize_selected = 0;
        this.ctrlSelect = false;
        if (this.deleted) {
            return this.selected;
        }
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
            this.ctrlSelect = e.event.ctrlKey;

        }
        return this.selected;
    }
    Action.prototype.inRect = function (x1, y1, x2, y2) {
        this.selected = false;
        if (this.deleted) {
            return this.selected;
        }
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
                this.resize(0, e.y, e.x, 0);
                this.clientRect.right += e.x;
                this.clientRect.top += e.y;
            } else if (this.resize_selected == 2) { //right bottom corner
                this.resize(0, 0, e.x, e.y);
                this.clientRect.right += e.x;
                this.clientRect.bottom += e.y;
                
            } else if (this.resize_selected == 3) { //left bottom corner
                this.resize(e.x, 0, 0, e.y);
                this.clientRect.left += e.x;
                this.clientRect.bottom += e.y;
                
            } else if (this.resize_selected == 4) { //left corner
                this.resize(e.x, e.y, 0, 0);
                this.clientRect.left += e.x;
                this.clientRect.top += e.y;
                
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
           this.lineWidth = this.groups[i].lineWidth = style.lineWidth || this.groups[i].lineWidth;
           this.strokeColro = this.groups[i].strokeColor = style.strokeColor || this.groups[i].strokeColor;
           this.fillColor =  this.groups[i].fillColor = style.fillColor || this.groups[i].fillColor;
           this.opacity =  this.groups[i].opacity = style.opacity || this.groups[i].opacity;
           this.fontName =  this.groups[i].fontName = style.fontName || this.groups[i].fontName;
           this.fontSize = this.groups[i].fontSize = style.fontSize || this.groups[i].fontSize;

           this.lineStart = this.groups[i].lineStart = style.lineStart || this.groups[i].lineStart;
           this.lineEnd = this.groups[i].lineEnd = style.lineEnd || this.groups[i].lineEnd;
        }
        this.Draw();
    }
    Action.prototype.clone = function () {
        return {
            classname: this.classname,
            isgroup: this.isgroup,
            lineWidth: this.lineWidth,
            fillColor: this.fillColor,
            strokeColor: this.strokeColor,
            clientRect: this.clientRect,
            groups: this.groups
        };
    }
    Action.prototype.restore = function (other) {
        this.groups = other.groups;
        this.done = true;
        this.lineWidth = other.lineWidth;
        this.fillColor = other.fillColor;
        this.strokeColor = other.strokeColor;
        this.clientRect = other.clientRect;
    }
    this.nextCommand = null;
    Action.prototype.next = function (action) {
        this.nextCommand = action;
    }
    Action.prototype.distance = function (x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
    }
}
var Pen = function (scence) {
    this.scence = scence;
    if (scence) {
        this.context = scence.context;
        this.context_top = scence.context_top;
    }
    
    this.isgroup = true;
    this.drawAll = function (con) {
        for (var j = 0; j < this.groups.length; j++) {
            var p = this.groups[j];
            this.drawOne(con, p.points, p.strokeColor, p.fillColor, p.lineWidth,p.opacity);
        }

    }
    this.drawOne = function (con, points, strokeColor, fillColor, lineWidth, opacity) {
        con.save();
        con.strokeStyle = strokeColor;
        con.lineWidth = lineWidth;
        con.fillStyle = fillColor;
        con.globalAlpha = opacity/100;
        con.beginPath();
        con.moveTo(points[0].x, points[0].y);
        for (var i = 1; i < points.length; i++) {
            con.lineTo(points[i].x, points[i].y);
            con.stroke();
        }
        con.closePath();
        con.restore();

    }
    this.resize = function (left, top, right, bottom) {        
        var old_width = this.clientRect.right - this.clientRect.left;
        var old_height = this.clientRect.bottom - this.clientRect.top;
        var change_width = right - left;
        var change_height = bottom - top;
        var x_rate = change_width / old_width;
        var y_rate = change_height / old_height;
        var msg = "Resize[" + this.resize_selected + "]: left=" + left + ",top=" + top + ",right=" + right + ",bottom=" + bottom + ",x_rate=" + x_rate + ",y_rate=" + y_rate;
        this.scence.log(msg);
        for (var j = 0; j < this.groups.length; j++) {
            for (var i = 0; i < this.groups[j].points.length; i++) {
                var p = this.groups[j].points[i];
                if (x_rate != 0) {
                    if (this.resize_selected == 3 || this.resize_selected == 4) {
                        var neww = x_rate * (p.x - this.clientRect.right);
                        p.x = p.x + neww;
                    } else {
                        var neww = x_rate * (p.x - this.clientRect.left);
                        p.x = p.x + neww;
                    }
                    
                }
                if (y_rate != 0) {
                    
                    if (this.resize_selected == 1 || this.resize_selected == 4) {
                        var newy = y_rate * (p.y - this.clientRect.bottom);
                        p.y = p.y + newy;
                    } else {
                        var newy = y_rate * (p.y - this.clientRect.top);
                        p.y = p.y + newy;
                    }
                    
                }
                
            }
        }
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
            this.drawOne(con, p.points, p.strokeColor, p.fillColor, p.lineWidth,p.opacity);
        }

    }
    this.drawOne = function (con, points, strokeColor, fillColor, lineWidth, opacity) {
        con.save();
        con.strokeStyle = strokeColor;
        con.lineWidth = lineWidth;
        con.fillStyle = fillColor;
        con.globalAlpha = opacity/100;
        con.beginPath();
        con.moveTo(points[0].x, points[0].y);
        con.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        con.stroke();
        con.closePath();
        con.restore();
    }
    
}
Line.classname = "line";
Line.prototype = new Action();
var Rect = function (scence) {
    this.scence = scence;
    this.context = scence.context;
    this.context_top = scence.context_top;
    this.fillColor = "rgba(0, 0, 0, 0)";
    this.strokeColor = "rgb(0, 0, 0)";
    this.drawAll = function (con) {
        for (var j = 0; j < this.groups.length; j++) {
            var p = this.groups[j];
            this.drawOne(con, p.points, p.strokeColor, p.fillColor, p.lineWidth,p.opacity);
        }

    }
    this.drawOne = function (con, points, strokeColor, fillColor, lineWidth,opacity) {
        con.save();
        con.strokeStyle = strokeColor;
        con.lineWidth = lineWidth;
        con.fillStyle = fillColor;
        con.globalAlpha = opacity/100;
        con.strokeRect(points[0].x, points[0].y, points[points.length - 1].x - points[0].x, points[points.length - 1].y - points[0].y);
        con.fillRect(points[0].x, points[0].y, points[points.length - 1].x - points[0].x, points[points.length - 1].y - points[0].y);
        con.restore();

    }

}

Rect.classname = "rect";
Rect.prototype = new Action();

var Circle = function (scence) {
    this.scence = scence;
    this.context = scence.context;
    this.context_top = scence.context_top;
    this.fillColor = "rgba(0, 0, 0, 0)";
    this.drawAll = function (con) {
        for (var j = 0; j < this.groups.length; j++) {
            var p = this.groups[j];
            this.drawOne(con, p.points, p.strokeColor, p.fillColor, p.lineWidth,p.opacity);
        }

    }
    this.drawOne = function (con, points, strokeColor, fillColor, lineWidth, opacity) {
        con.save();
        con.strokeStyle = strokeColor;
        con.lineWidth = lineWidth;
        con.fillStyle = fillColor;
        con.globalAlpha = opacity/100;
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
        con.restore();

    }

}

Circle.classname = "circle";
Circle.prototype = new Action();
var UploadCommand = function (scence) {
    this.classname = "upload";
    this.execute = function () {
        $("#upload_file").trigger("click");
    }
    this.mouseup = function (e) {

    }
    this.mousedown = function (e) {

    }
    this.mouseover = function (e) {

    }
    this.mouseout = function (e) {

    }

}
UploadCommand.classname = "upload";
UploadCommand.prototype = new Action();

var UploadFile = function (scence,f,pos) {
    this.scence = scence;
    this.context = scence.context;
    this.context_top = scence.context_top;
    this.fillColor = "rgba(0, 0, 0, 0)";
    this.upload_file = f;
    this.start_pos = { x: pos?pos.offsetX:0, y:pos?pos.offsetY:0 };
    var instance = this;
    this.classname = "upload";
    this.drawAll = function (con) {
        this.drawOne(con);
    }
    this.drawOne = function (con, points, strokeColor, fillColor, lineWidth, opacity) {
        con.save();
        con.globalAlpha = this.opacity/100;
        con.drawImage(this.image, 0, 0, this.image.width, this.image.height,
            this.clientRect.left, this.clientRect.top, this.clientRect.right - this.clientRect.left, this.clientRect.bottom - this.clientRect.top);
        con.restore();
    }

    this.reader = new FileReader();
    this.image = new Image();
    
    this.reader.onload = (function (theFile) {
        return function (e) {
            instance.image.src = e.target.result;
        }
    })(this.upload_file);
    if (this.upload_file)
        this.reader.readAsDataURL(this.upload_file);
    this.image.onload = function () {
        
        console.log("load complete");
        instance.loadImage();
        
    }
    this.loadImage = function () {
        this.done = true;
        this.groups = [];
        this.points = [];

        this.clientRect = { left: this.start_pos.x, top: this.start_pos.y, right: this.start_pos.x + this.image.width, bottom: this.start_pos.y + this.image.height };
        this.points = [{ x: this.clientRect.left, y: this.clientRect.top }, { x: this.clientRect.right, y: this.clientRect.bottom }];
        this.groups.push({
            points: this.points,
            strokeColor: this.strokeColor,
            fillColor: this.fillColor,
            lineWidth: this.lineWidth,
            opacity:this.opacity
        });
        this.drawOne(this.context);
    }
    this.clone = function () {
        return {
            classname: "uploadfile",
            isgroup: this.isgroup,
            lineWidth: this.lineWidth,
            fillColor: this.fillColor,
            strokeColor: this.strokeColor,
            clientRect: this.clientRect,
            message: this.message,
            image_src : this.image.src,
            groups: this.groups
        };
    }
    this.restore = function (other) {
        this.groups = other.groups;
        this.done = true;
        this.lineWidth = other.lineWidth;
        this.fillColor = other.fillColor;
        this.strokeColor = other.strokeColor;
        this.clientRect = other.clientRect;
        this.message = other.message;
        this.image.src = other.image_src;
    }
    
}

UploadFile.classname = "uploadfile";
UploadFile.prototype = new Action();


var Text = function (scence) {
    this.scence = scence;
    this.context = scence.context;
    this.context_top = scence.context_top;
    this.input = null;
    this.fontName = "Arial";
    this.fontSize = 32;
    this.start_pos = { x: 0, y: 0 };
    this.fillColor = "rgb(0, 0, 0)";
    this.alignment = "left";
    this.message = "";
    var instance = this;
    this.font = function () {
        return this.fontSize + "px " + this.fontName;
    }
    this.mouseup = function (e) {

    }
    this.endCreate = function (e) {
        this.message = this.input.val();
        this.input.remove();
        this.groups = [];
        this.points = [];
        this.done = true;        
        
        this.lineWidth = 1;
        this.context.save();
        this.context.font = this.font();
        var w = parseInt(this.context.measureText(this.message).width);
        var h = parseInt(this.context.measureText('W').width)
        this.clientRect = { left: this.start_pos.x, top: this.start_pos.y, right: this.start_pos.x + w, bottom: this.start_pos.y+h};
        this.points = [{ x: this.clientRect.left, y: this.clientRect.top }, { x: this.clientRect.right, y: this.clientRect.bottom }];
        this.groups.push({
            points: this.points,
            strokeColor: this.strokeColor,
            fillColor: this.fillColor,
            lineWidth: this.lineWidth,
            opacity: this.opacity,
            fontName: this.fontName,
            fontSize:this.fontSize
        });
        this.context.restore();
        this.scence.commandList.push(instance);
        this.drawOne(this.context);

    }
    this.mousedown = function (e) {
        if (this.input == null) {
            this.start_pos.x = e.offsetX;
            this.start_pos.y = e.offsetY;
            var inputElement = "<input type='text' style='position:absolute;width:300px;left:"+e.offsetX+"px;top:"+e.offsetY+"px;z-index:5;' />";
            this.input = $(inputElement).appendTo(this.scence.div);
            this.input.bind("blur", function () {
                instance.endCreate(e);
            })
        }
    }
    this.mousemove = function (e) {

    }
    this.mouseout = function (e) {

    }
    this.drawAll = function (con) {
        this.drawOne(con);
    }
    this.drawOne = function (con, points, strokeColor, fillColor, lineWidth,opacity) {
        con = this.context;
        con.save();
        con.globalAlpha = opacity/100;
        con.strokeStyle = this.strokeColor;
        con.fillStyle = this.fillColor;
        con.lineWidth = this.lineWidth;
        //con.textAlign = this.alignment;
        con.font = this.font();
        con.fillText(this.message, this.clientRect.left, this.clientRect.bottom);
        con.restore();
        
    }
    this.resize = function (left, top, right, bottom) {
        this.__proto__.resize.call(this, left, top, right, bottom);
        this.context.save();
        var w = this.clientRect.right - this.clientRect.left;
        for (var i = 6; i < 1200; i++) {
            this.fontSize = i;
            this.context.font = this.font();
            var realw = parseInt(this.context.measureText(this.message).width);
            if (w - realw < 5) {
                break;
            }
        }
        this.context.restore();
        /*
        var old_width = this.clientRect.right - this.clientRect.left;
        var old_height = this.clientRect.bottom - this.clientRect.top;
        var change_width = right - left;
        var change_height = bottom - top;
        var x_rate = change_width / old_width;
        var y_rate = change_height / old_height;
        var rate = 0;// Math.max(Math.abs(x_rate), Math.abs(y_rate));
        if (Math.abs(x_rate) >= Math.abs(y_rate)) {
            rate = x_rate;
        } else {
            rate = y_rate;
        }
        if (rate > 0) {
            var old = this.fontSize;
            this.fontSize += this.fontSize * rate;
            console.log("Old size=" + old + ",new size=" + this.fontSize);
        }
        */

    }
    this.clone = function () {
        return {
            classname: this.classname,
            isgroup: this.isgroup,
            lineWidth: this.lineWidth,
            fillColor: this.fillColor,
            strokeColor: this.strokeColor,
            clientRect: this.clientRect,
            message:this.message,
            groups: this.groups
        };
    }
    this.restore = function (other) {
        this.groups = other.groups;
        this.done = true;
        this.lineWidth = other.lineWidth;
        this.fillColor = other.fillColor;
        this.strokeColor = other.strokeColor;
        this.clientRect = other.clientRect;
        this.message = other.message;
    }
    this.setStyle = function (style) {
        if (!style)
            return;
        
        this.lineWidth = style.lineWidth || this.lineWidth;
        this.strokeColor = style.strokeColor || this.strokeColor;   
        this.fillColor = style.fillColor || this.fillColor;
        this.opacity = style.opacity || this.opacity;
        this.fontName = style.fontName || this.fontName;
        this.fontSize = style.fontSize || this.fontSize;
        this.alignment = style.alignment || this.alignment;
        this.Draw();
    }
}
Text.classname = "text";
Text.prototype = new Action();


var Brush = function (scence) {
    this.scence = scence;
    if (scence) {
        this.context = scence.context;
        this.context_top = scence.context_top;
    }
    this.strokeColor = "brown";
    this.isgroup = true;
    this.lineWidth = 40;
    this.opacity = 20;
    
    this.drawOne = function (con, points, strokeColor, fillColor, lineWidth,opacity) {
        con.save();
        con.strokeStyle = strokeColor;
        con.lineWidth = lineWidth;
        con.fillStyle = fillColor;
        con.globalAlpha = this.opacity/100;
        //con.globalCompositeOperation = "source-over";//"lighter";
        con.lineCap = "round";
        
        for (var i = 1; i < points.length; i++) {
            con.beginPath();
            con.moveTo(points[i-1].x, points[i-1].y);
            con.lineTo(points[i].x, points[i].y);
            con.stroke();
            con.closePath();
        }
        
        con.restore();

    }
    
}
Brush.classname = "brush";
Brush.prototype = new Pen(null);

var Erase = function (scence) {
    this.scence = scence;
    if (scence) {
        this.context = scence.context;
        this.context_top = scence.context_top;
    }
    this.isgroup = true;
    this.strokeColor = "rgb(0, 0, 0)";    
    this.lineWidth = 1;
    this.r = 20;
    this.start_pos = { x: 0, y: 0 };
    this.drawAll = function (con) {
        for (var j = 0; j < this.groups.length; j++) {
            var p = this.groups[j];
            this.drawOne(con, p.points, p.strokeColor, p.fillColor, p.lineWidth);
        }

    }
    this.drawOne = function (con, points, strokeColor, fillColor, lineWidth) {
        if (!points || points.length < 1)
            return;
        if (this.creating) {//creating
            var p = points[points.length - 1];
            //con.strokeRect(p.x - this.r / 2, p.y - this.r / 2, this.r, this.r);
            con.strokeStyle = "black";
            con.beginPath();
            con.arc(p.x - this.r / 2, p.y - this.r / 2, this.r, 0, Math.PI * 2, false);
            con.closePath();
            con.stroke();
            this.context.clearRect(p.x - this.r / 2, p.y - this.r / 2, this.r, this.r);
        } else {
            for (var i = 0; i < points.length; i++) {
                var p = points[i];
                con.clearRect(p.x - this.r / 2, p.y - this.r / 2, this.r, this.r);

            }
        }
        
    }
    
}
Erase.classname = "erase";
Erase.prototype = new Action();


var Polygon = function (scence) {
    this.scence = scence;
    if (scence) {
        this.context = scence.context;
        this.context_top = scence.context_top;
    }
    
    this.fillColor = "rgb(233, 20, 37)";
    this.SELECT_BORDER = 6;
    
    this.next = function (action) {
        this.nextCommand = action;
        if (!this.done && this.points.length > 2) {
            this.endCreate();
        }
    }
    this.mousedown = function (e) {

    }
    this.endCreate = function (e) {
        this.creating = false;
        this.done = true;
        
        this.processPoint(this.points);
        this.groups = [{ points: this.points, lineWidth: this.lineWidth, fillColor: this.fillColor, strokeColor: this.strokeColor }];
        if (e) {
            this.scence.clone(this);
        } else {
            this.scence.commandList.push(this);
        }
        this.Draw();
    }
    this.mouseup = function (e) {
        if (this.done) {
            return;
        }
        this.creating = true;
        this.points.push({ x: e.offsetX, y: e.offsetY });        
        if (e.event && e.event.button != 0) {
            this.endCreate(e);
        }
        this.Draw();
    }
    this.mousemove = function (e) {
        
    }
    this.mouseout = function (e) {

    }
    this.drawJointSelect = function (con, x, y) {
        if (this.selected) {
            con.save();
            con.strokeStyle = "green";
            con.fillStyle = "green";
            con.beginPath();
            con.arc(x, y, this.SELECT_BORDER, 0, Math.PI * 2, false);
            con.closePath();
            con.stroke();
            con.fill();
            con.restore();
        }
    }
    this.drawOne = function (con) {
        var points = this.points;
        if (points.length > 0) {
            
            con.save();
            con.fillStyle = this.fillColor;
            con.lineWidth = this.lineWidth;
            con.strokeStyle = this.strokeColor;
            con.globalAlpha = this.opacity/100;
            con.beginPath();
            con.moveTo(points[0].x, points[0].y);
            for (var i = 1; i < points.length; i++) {
                con.lineTo(points[i].x, points[i].y);
                
            }
            con.lineTo(points[0].x, points[0].y);
            con.closePath();
            con.stroke();
            con.fill();
            con.restore();
            for (var i = 0; i < points.length; i++) {             
                this.drawJointSelect(con, points[i].x, points[i].y);
            }
        }
        
    }
    this.drawAll = function (con) {
        this.drawOne(con);
    }
    this.processPoint = function (points) {
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
    this.selected_point = null;

    this.inside = function (e) {
        this.selected_point = null;
        var result = this.__proto__.inside.call(this, e);
        if (result) {
            for (var j = 0; j < this.groups.length; j++) {
                for (var i = 0; i < this.groups[j].points.length; i++) {
                    var p = this.groups[j].points[i];
                    var distance = this.distance(p.x, p.y, e.offsetX, e.offsetY);
                    if (distance < 6) {
                        this.selected_point = p;
                        break;
                    }
                }
            }
        }
        return result;

    }

    this.move = function (e) {
        if (this.selected) {
            if (this.selected_point) {
                this.selected_point.x += e.x;
                this.selected_point.y += e.y;
                this.clientRect = { top: 102400, left: 102400, right: 0, bottom: 0 };
                for (var j = 0; j < this.groups.length; j++) {
                    this.processPoint(this.groups[j].points);
                }
                return;
            }
            this.__proto__.move.call(this, e);
        }

    }

}
Polygon.classname = "polygon";
Polygon.prototype = new Pen(null);




//Multiple Line
var PolyLine = function (scence) {
    this.scence = scence;
    
    this.context = scence.context;
    this.context_top = scence.context_top;
    this.isgroup = false;
    this.lineWidth = 1;
    this.fillColor = "rgba(0, 0, 0, 0)";
    this.SELECT_BORDER = 6;
    this.lineStart = 2;
    this.lineEnd = 2;
    this.next = function (action) {
        this.nextCommand = action;
        if (!this.done && this.points.length>2) {
            this.endCreate();
        }
    }
    this.mousedown = function (e) {

    }
    this.endCreate = function (e) {
        this.creating = false;
        this.done = true;

        this.processPoint(this.points);
        this.groups = [{ points: this.points, lineWidth: this.lineWidth, fillColor: this.fillColor, strokeColor: this.strokeColor,lineStart:this.lineStart,lineEnd:this.lineEnd }];
        if (e) {
            this.scence.clone(this);
        } else {
            this.scence.commandList.push(this);
        }
        this.Draw();
    }
    this.processPoint = function (points) {
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
    this.mouseup = function (e) {
        if (this.done) {
            return;
        }
        this.creating = true;
        this.points.push({ x: e.offsetX, y: e.offsetY });
        if (e.event && e.event.button != 0) {
            this.endCreate(e);
        }
        this.Draw();
    }
    this.mousemove = function (e) {

    }
    this.mouseout = function (e) {

    }
    this.drawAll = function (con) {
        this.drawOne(con);

    }
    this.drawJointSelect = function (con, x, y) {
        if (this.selected) {
            con.save();
            con.strokeStyle = "green";
            con.beginPath();

            con.arc(x, y, this.SELECT_BORDER, 0, Math.PI * 2, false);
            con.closePath();
            con.stroke();
            con.restore();
        }
    }
    this.drawOne = function (con, points, strokeColor, fillColor, lineWidth, opacity) {
        var points = this.points;
        if (points.length > 0) {

            con.save();
            con.fillStyle = this.fillColor;
            con.lineWidth = this.lineWidth;
            con.strokeStyle = this.strokeColor;
            con.globalAlpha = this.opacity / 100;
            con.beginPath();
            con.moveTo(points[0].x, points[0].y);
            for (var i = 1; i < points.length; i++) {
                con.lineTo(points[i].x, points[i].y);

            }
            //con.lineTo(points[0].x, points[0].y);
            //con.closePath();
            con.stroke();
            
            con.restore();
            for (var i = 0; i < points.length; i++) {
                this.drawJointSelect(con, points[i].x, points[i].y);
            }
        }
    }
    this.selected_point = null;

    this.inside = function (e) {
        this.selected_point = null;
        var result = this.__proto__.inside.call(this, e);
        if (result) {
            for (var j = 0; j < this.groups.length; j++) {
                for (var i = 0; i < this.groups[j].points.length; i++) {
                    var p = this.groups[j].points[i];
                    var distance = this.distance(p.x, p.y, e.offsetX, e.offsetY);
                    if (distance < 6) {
                        this.selected_point = p;
                        break;
                    }
                }
            }
        }
        return result;

    }

    this.move = function (e) {
        if (this.selected) {
            if (this.selected_point) {
                this.selected_point.x += e.x;
                this.selected_point.y += e.y;
                this.clientRect = { top: 102400, left: 102400, right: 0, bottom: 0 };
                for (var j = 0; j < this.groups.length; j++) {
                    this.processPoint(this.groups[j].points);
                }
                return;
            }
            this.__proto__.move.call(this, e);
        }

    }

}
PolyLine.classname = "polyline";
PolyLine.prototype = new Pen(null);
PolyLine.prototype.drawLineDirBegin = function (context, x, y, x2, y2, no, strokeColor, fillColor) {
    var degree = Math.atan((y2 - y) / (x2 - x))*(180/Math.PI);
    this.drawLineSet(context, x, y, no, degree, strokeColor, fillColor);
}
PolyLine.prototype.drawLineDirEnd = function (context, x, y, x2, y2, no, strokeColor, fillColor) {
    var degree = Math.atan((y2 - y) / (x2 - x)) * (180 / Math.PI)+180;
    this.drawLineSet(context, x, y, no, degree, strokeColor, fillColor);
}
PolyLine.prototype.drawLineSet = function (context, x, y, no, degree, strokeColor, fillColor) {
    context.save();
    context.strokeStyle = strokeColor || "black";
    context.fillStyle = fillColor || "red";
    context.translate(x, y);
    var index = no * 1;
    //degree = index * 30;
    context.rotate(degree * Math.PI / 180);
    var r = 12;
    var tr = Math.sqrt(r * r * 2);
    
    var tr2 = Math.sqrt(r / 2 * r / 2 / 2);
    switch (index) {
        case 1:
            context.beginPath();
            context.moveTo(-r, 0);
            context.lineTo(r, 0);
            context.closePath();
            context.stroke();
            break;
        case 2:
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(r, 0);
            context.closePath();
            context.stroke();
            context.fillRect(-r, -r / 2, r, r);
            context.strokeRect(-r, -r / 2, r, r);
            
            break;
        case 3:
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(r, 0);
            context.closePath();
            context.stroke();
            context.beginPath();
            context.arc(-r / 2, 0, r / 2, 0, Math.PI * 2, false);
            context.closePath();
            context.fill();
            context.stroke();
            break;
        case 4:
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(r, 0);
            context.closePath();
            context.stroke();
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(-tr / 2, -tr / 2);
            context.lineTo(-tr, 0);
            context.lineTo(-tr / 2, tr / 2);
            context.closePath();
            context.fill();
            context.stroke();
            break;
        case 5:
            context.beginPath();
            context.moveTo(-r, 0);
            context.lineTo(r, 0);
            context.closePath();
            context.stroke();
            context.beginPath();
            context.moveTo(-r, 0);
            context.lineTo(0, -r / 2);
            context.moveTo(-r, 0);
            context.lineTo(0, r / 2);
            context.closePath();

            context.stroke();
            break;
        case 6:
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(r, 0);
            context.closePath();
            context.stroke();
            context.beginPath();
            context.moveTo(-r, 0);
            context.lineTo(0, -r / 2);
            context.lineTo(0, r / 2);
            context.closePath();
            context.stroke();
            context.fill();
            break;
        case 7:
            context.beginPath();
            context.moveTo(-r, 0);
            context.lineTo(r, 0);
            context.moveTo(-r, -r / 2);
            context.lineTo(-r, r / 2);

            context.closePath();
            context.stroke();
            break;
        case 8:
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(r, 0);
            context.moveTo(0, 0);
            context.lineTo(-r, -r / 2);
            context.moveTo(0, 0);
            context.lineTo(-r, r / 2);
            context.closePath();
            context.stroke();
            break;
        case 9:
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(r, 0);
            context.moveTo(0, 0);
            context.lineTo(-r, -r / 2);

            context.lineTo(-r, r / 2);
            context.closePath();
            context.stroke();
            context.fill();
            break;
        case 10:
            context.beginPath();
            context.moveTo(-r, 0);
            context.lineTo(r, 0);
            context.moveTo(-r + tr2, -tr2);
            context.lineTo(-r - tr2, tr2);
            context.closePath();
            context.stroke();
            break;
    }
    context.restore();
}