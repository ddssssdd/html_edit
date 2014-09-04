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
        
    }
    this.move_to = function (x, y)
    {
        

        var deltax = x - this.move_point.x;
        var deltay = y - this.move_point.y;
        this.move_point.x = x;
        this.move_point.y = y;
        for (var i = 0; i < this.path.length; i++) {
            for (var j = 0; j < this.path[i].length; j++) {
                this.path[i][j] = { x: this.path[i][j].x + deltax, y: this.path[i][j].y + deltay };
            }
            
        }
        this.min.x = this.min.x + deltax;
        this.min.y = this.min.y + deltay;
        this.max.x = this.max.x + deltax;
        this.max.y = this.max.y + deltay;

        /*
        var temp_path = this.path.slice(0);
        this.path = Array();
        for (var i = 0; i < temp_path.length; i++)
        {
            var temp_points = temp_path[i];
            this.points = Array();
            for (var j = 0; j < temp_points.length; j++) {
                this.move(temp_points[j].x + deltax, temp_points[j].y + deltay);
            }
            this.path.push(this.points);
        }*/
        
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
        for (var i = 0; i < this.path.length; i++)
        {
            var points = this.path[i];
            if (points.length > 0)
            {
                context.beginPath();
                context.moveTo(points[0].x, points[0].y);
                for (var j = 1; j < points.length; j++) {
                    context.lineTo(points[j].x, points[j].y);
                    context.stroke();
                }
                context.closePath();
            }
            
        }
    }
    this.draw_select = function (context)
    {
        context.strokeStyle = "#0000ff";
        context.fillStyle = "#000";
        context.lineWidth = 0.5;
        context.strokeRect(this.min.x - 5, this.min.y - 5, 10, 10);
        context.strokeRect(this.max.x - 5, this.max.y - 5, 10, 10);
        context.strokeRect(this.min.x - 5, this.max.y - 5, 10, 10);
        context.strokeRect(this.max.x - 5, this.min.y - 5, 10, 10);
        context.beginPath();
        context.moveTo(this.min.x, this.min.y);
        context.lineTo(this.min.x, this.max.y);
        context.lineTo(this.max.x, this.max.y);
        context.lineTo(this.max.x, this.min.y);
        context.lineTo(this.min.x, this.min.y);
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
        this.path.push(this.points);
        this.points = Array();
    }
}