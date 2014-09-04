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
    this.context;
    this.start;
    this.end;
    this.min = { x: 0, y: 0 };
    this.max = { x: 0, y: 0 };
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
    this.clone = function () {
        var cmd = new Command(this.type, this.command, this.pencolor, this.penwidth, this.brushcolor, this.opacity);
        return cmd;
    }
    this.begin_draw = function (context,x,y)
    {
        this.context = context;
        this.move(x, y);
        this.context.strokeStyle = this.pencolor;
        this.context.fillStyle = this.brushcolor;
        this.context.lineWidth = this.penwidth;
        //should have opacity setup
        this.context.beginPath();
        this.context.moveTo(x, y);
    }
    this.drawing = function (x,y)
    {
        this.move(x, y);
        this.context.lineTo(x, y);
        this.context.stroke();
    }
    this.end_draw = function (x,y)
    {
        this.move(x, y);
        this.context.closePath();
    }
}