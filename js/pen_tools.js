var Action = function (x, y, command, pen_color, pen_width)
{

    this.drawEllipseByCenter=function(context,cx, cy, w, h) {
        drawEllipse(cx - w / 2.0, cy - h / 2.0, w, h);
    }

    this.drawEllipse=function(context,x, y, w, h, fill) {
        var kappa = .5522848,
            ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = x + w,           // x-end
            ye = y + h,           // y-end
            xm = x + w / 2,       // x-middle
            ym = y + h / 2;       // y-middle

        context.beginPath();
        context.moveTo(x, ym);
        context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        //ctx.closePath(); // not used correctly, see comments (use to close off open path)
        if (fill) {
            context.fill();
        } else {
            context.stroke();
        }
    }
    
}

var ActionList = function ()
{
    this.list = Array();
    this.add = function (action)
    {
        this.list.push(action);
    }

}

var Command = function (type, command, pencolor, penwidth, brushcolor, opacity) {
    this.type = type;
    this.command = command;
    this.pencolor = pencolor;
    this.penwidth = penwidth;
    this.brushcolor = brushcolor;
    this.opacity = opacity;
    this.points = Array();
    this.path = Array();
    this.context;
    this.start;
    this.end;
    this.series = false;
    this.is_select = false;
    this.move_point = { x: 0, y: 0 };
    this.moving = false;
    this.min = { x: 10000, y: 10000 };
    this.max = { x: 0, y: 0 };
    this.cornor = -1;
    this.move = function (x, y) {
        if (this.points.length == 0) {
            this.start = { x: x, y: y };
        } else {
            this.end = { x: x, y: y };
        }
        this.points.push({ x: x, y: y });
        if (x < this.min.x) {
            this.min.x = x;
        }
        if (x > this.max.x) {
            this.max.x = x;
        }
        if (y < this.min.y) {
            this.min.y = y;
        }
        if (y > this.max.y) {
            this.max.y = y;
        }

    }
    this.drawEllipseByCenter = function (context, cx, cy, w, h) {
        this.drawEllipse(context,cx - w / 2.0, cy - h / 2.0, w, h);
    }

    this.drawEllipse = function (context, x, y, w, h, fill) {
        var kappa = .5522848,
            ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = x + w,           // x-end
            ye = y + h,           // y-end
            xm = x + w / 2,       // x-middle
            ym = y + h / 2;       // y-middle

        context.beginPath();
        context.moveTo(x, ym);
        context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        //ctx.closePath(); // not used correctly, see comments (use to close off open path)
        if (fill) {
            context.fill();
        } else {
            context.stroke();
        }
    }
    this.clone = function () {
        var cmd = new Command(this.type, this.command, this.pencolor, this.penwidth, this.brushcolor, this.opacity);
        return cmd;
    }
    this.samecommand = function (cmd)
    {
        return this.type == cmd.type && this.command == cmd.command;
    }
    this.isseries = function (cmd)
    {
        this.series = this.samecommand(cmd) && (cmd.command == "pencil" || cmd.command == "brush") &&(this.pencolor==cmd.pencolor && this.penwidth== this.penwidth && this.opacity == cmd.opacity);
        return this.series;
    }
    this.contains = function (x, y)
    {
        this.is_select = (x > this.min.x) && (x < this.max.x) && (y > this.min.y) && (y < this.max.y);
        return this.is_select;
    }
    this.move_begin = function (x, y)
    {
        this.move_point.x = x;
        this.move_point.y = y;
        this.moving = true;
        //this.iscorner(x, y);
        
    }
    this.iscorner = function (x, y)
    {
        /*  
            1----------2----------3
            -                     - 
            8                     4
            -                     -
            7----------6----------5

        */
        var result = -1;
        if (this.distance(x, y, this.min.x, this.min.y)<=10) {
            result = 1;
        } else if (this.distance(x, y, this.min.x+ (this.max.x-this.min.x)/2, this.min.y) <= 10) {
            result = 2;
        } else if (this.distance(x, y, this.max.x, this.min.y) <= 10) {
            result = 3;
        } else if (this.distance(x, y, this.max.x, this.min.y+(this.max.y-this.min.y)/2) <= 10) {
            result = 4;
        } else if (this.distance(x, y, this.max.x, this.max.y) <= 10) {
            result = 5;
        } else if (this.distance(x, y, this.min.x+(this.max.x-this.min.x)/2, this.max.y) <= 10) {
            result = 6;
        } else if (this.distance(x, y, this.min.x, this.max.y) <= 10) {
            result = 7;
        } else if (this.distance(x, y, this.min.x, this.min.y+(this.max.y-this.min.y)/2) <= 10) {
            result = 8;
        }
        this.cornor = result;

    }
    this.distance = function (x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }
    this.move_to = function (x, y)
    {
        var deltax = x - this.move_point.x;
        var deltay = y - this.move_point.y;
        var calc_point = function (p,x,y,min,max) {
            return { x: p.x + deltax, y: p.y + deltay };
        }
        if (this.cornor > 0)//click on cornor, resize not moving;
        {
            calc_point = function (p, x, y, min, max)
            {
                console.log("calc begin:(x0,y0)=(" + p.x + "," + p.y + "), (x1,y1)=(" + min.x + "," + min.y + "), (x2,y2)=(" + max.x + "," + max.y + "), target:(x,y)=(" + x + "," + y + ")");
                var x3 = p.x;
                var y3 = p.y;
                if (p.y == max.y) {
                    x3 = x - (max.y - p.y) / ((max.y - min.y) / (p.x - min.x));
                    y3 = min.y;
                } else if (p.x == min.x) {
                    x3 = min.x;
                    y3 = y - (max.x - p.x) / ((max.x - min.x) / (p.y - min.y));
                } else {
                    x3 = x - (max.y - p.y) / ((max.y - min.y) / (p.x - min.x));
                    y3 = y - (max.x - p.x) / ((max.x - min.x) / (p.y - min.y));
                }
                
                console.log("x=" + x3 + ",y=" + y3);
                return { x: x3, y: y3 };
            }
        } 
        this.move_point.x = x;
        this.move_point.y = y;
        for (var i = 0; i < this.path.length; i++) {
            for (var j = 0; j < this.path[i].length; j++) {
                
                this.path[i][j] = calc_point(this.path[i][j],x,y,this.min,this.max);
            }
            
        }
        this.min = calc_point(this.min, x, y, this.min, this.max);
        this.max = calc_point(this.max, x, y, this.min, this.max);
        this.start = calc_point(this.start, x, y, this.min, this.max);
        this.end = calc_point(this.end, x, y, this.min, this.max);
                
    }
    this.move_end = function (x, y)
    {
        this.moving = false;
    }
    this.draw = function (context)
    {
        context.strokeStyle = this.pencolor;
        context.fillStyle = this.brushcolor;
        context.lineWidth = this.penwidth;
        if (this.command == "pencil") {
            for (var i = 0; i < this.path.length; i++) {
                var points = this.path[i];
                if (points.length > 0) {
                    context.beginPath();
                    context.moveTo(points[0].x, points[0].y);
                    for (var j = 1; j < points.length; j++) {
                        context.lineTo(points[j].x, points[j].y);
                        context.stroke();
                    }
                    context.closePath();
                }

            }
        } else if (this.command == "Square") {
            var tempx = this.start.x >= this.end.x ? this.end.x : this.start.x;
            var tempy = this.start.y >= this.end.y ? this.end.y : this.start.y;
            context.strokeRect(tempx, tempy, Math.abs(this.end.x - this.start.x), Math.abs(this.end.y - this.start.y));
        } else if (this.command == "Circle") {
            var w = (this.end.x - this.start.x);
            var h = (this.end.y - this.start.y);
            this.drawEllipse(context,this.start.x, this.start.y, w, h, false);
        } else if (this.command = "Lice") {
            context.beginPath();
            context.moveTo(this.start.x, this.start.y);
            context.lineTo(this.end.x, this.end.y);
            context.stroke();
        }
        
    }
    this.draw_select = function (context)
    {
        var p_width = this.penwidth / 2;
        context.strokeStyle = "#0000ff";
        context.fillStyle = "#000";
        context.lineWidth = 1;
        context.strokeRect(this.min.x - 5 - p_width, this.min.y - 5 - p_width, 10, 10);
        context.strokeRect(this.max.x - 5 + p_width, this.max.y - 5 + p_width, 10, 10);
        context.strokeRect(this.min.x - 5 - p_width, this.max.y - 5 + p_width, 10, 10);
        context.strokeRect(this.max.x - 5 + p_width, this.min.y - 5 - p_width, 10, 10);
        context.beginPath();
        context.moveTo(this.min.x - p_width, this.min.y - p_width);
        context.lineTo(this.min.x - p_width, this.max.y + p_width);
        context.lineTo(this.max.x + p_width, this.max.y + p_width);
        context.lineTo(this.max.x + p_width, this.min.y - p_width);
        context.lineTo(this.min.x - p_width, this.min.y - p_width);
        context.stroke();
        context.closePath();
        
    }
    this.begin_draw = function (context,x,y)
    {
        this.context = context;
        this.move(x, y);
        this.context.strokeStyle = this.pencolor;
        this.context.fillStyle = this.brushcolor;
        this.context.lineWidth = this.penwidth;
        //should have opacity setup

        if (this.command == "pencil") {
            this.context.beginPath();
            this.context.moveTo(x, y);
        } else if (this.command == "Square") {
            this.context.moveTo(x, y);
        }
        
    }
    this.drawing = function (x,y)
    {
        if (this.command == "pencil") {
            this.move(x, y);
            this.context.lineTo(x, y);
            this.context.stroke();
        } else if (this.command == "Square") {
           
            var tempx = this.start.x >= x ? x : this.start.x;
            var tempy = this.start.y >= y ? y : this.start.y;
            this.context.strokeRect(tempx, tempy, Math.abs(x - this.start.x), Math.abs(y - this.start.y));
        } else if (this.command == "Circle") {
            var w = (x - this.start.x);
            var h = (y - this.start.y);
            this.drawEllipse(this.context, this.start.x, this.start.y, w,h,false);
        } else if (this.command == "Lice") {
            this.context.beginPath();
            this.context.moveTo(this.start.x, this.start.y);
            this.context.lineTo(x, y);
            this.context.stroke();
        }
        
    }
    this.end_draw = function (x,y)
    {
        this.move(x, y);

        //this.context.closePath();
        this.path.push(this.points);
        this.points = Array();
    }
}