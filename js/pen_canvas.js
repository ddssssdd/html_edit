
var Canvas = function (div)
{
    this.divName = div;
    this.penColor = "rgb(0,0,0)";
    this.penWidth = 3;
    this.width = 0;
    this.height = 0;
    this.context = null;
    this.context_top = null;
    this.canvas = null;
    this.canvas_top = null;
    this.command_list = Array();
    this.cmd_index = -1;
    this.cmd_current = null;
    this.command = null;
    this.isaction = false;
    this.initCavnas = function ()
    {
        var div = $(this.divName);
        if (!div)
            return;
        this.width = div.width();
        this.height = div.height();
        $("<canvas id='canvas_top' style='position:absolute;z-index:1;'></canvas>").appendTo(div);
        $("<canvas id='canvas'></canvas>").appendTo(div);
        
        this.canvas = document.getElementById("canvas");
        this.canvas_top = document.getElementById("canvas_top");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas_top.width = this.width;
        this.canvas_top.height = this.height;
        this.context = this.canvas.getContext("2d");
        this.context_top = this.canvas_top.getContext("2d");
        var instance = this;
        $(this.canvas_top).bind("mouseup", mouseup);
        $(this.canvas_top).bind("mousedown", mousedown);
        $(this.canvas_top).bind("mousemove", mousemove);
        $(this.canvas_top).bind("mouseout", mouseout);
        function mouseup(e) {
            instance.mouseup(e);
        }
        function mousedown(e) {
            instance.mousedown(e);
        }
        function mouseout(e) {
            instance.mouseout(e);
        }
        function mousemove(e) {
            instance.mousemove(e);
        }
        
    }
    this.draw_border = function ()
    {
        this.context_top.strokeRect(0, 0, this.canvas_top.width, this.canvas_top.height);
    }
    this.draw_test = function ()
    {
        this.context.strokeRect(10, 10, 100, 100);
        this.context_top.strokeRect(110, 110, 200, 200);
    }
    this.clear_context = function(isBoth)
    {
        this.context_top.clearRect(0, 0, this.canvas_top.width, this.canvas_top.height);
        if (isBoth)
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.do = function (cmd)
    {
        this.command = cmd;
        //execute command;
    }
    this.settings_change = function (pencolor, brushcolor, penwidth, opacity)
    {
        if (!this.command)
        {
            return;
        }
        this.command.pencolor = pencolor;
        this.command.penwidth = penwidth;
        this.command.brushcolor = brushcolor;
        this.command.opacity = opacity;
    }
    this.debug = function (s) {
        console.log(s);
    }
    this.mousedown = function (e) {
        if (!this.command)
        {
            //not set current command, so exit;
            return;
        }
        //this.debug("MouseDown:x=" + e.offsetX + ",y=" + e.offsetY);
        this.cmd_current = this.command.clone();
        if (this.cmd_current == "action") {

        } else {

            this.cmd_current.begin_draw(this.context_top, e.offsetX, e.offsetY);
            this.isaction = true;
        }
        
    }
    this.mousemove = function (e) {
        if (!this.isaction)
        {
            return;
        }
        //this.debug("MouseMove:x=" + e.offsetX + ",y=" + e.offsetY);
        if (this.cmd_current == "action") {

        } else {
            
            this.cmd_current.drawing(e.offsetX, e.offsetY);
        }
        
    }
    this.mouseup = function (e)
    {
        if (!this.isaction) {
            return;
        }
        //this.debug("MouseUp:x=" + e.offsetX + ",y=" + e.offsetY);
        if (this.cmd_current == "action") {

        } else {

            this.cmd_current.end_draw(e.offsetX, e.offsetY);
        }
        this.isaction = false;
        
        this.command_list.push(this.cmd_current);
    }
    
    this.mouseout = function (e) {
        //this.debug("MouseOut:x=" + e.offsetX + ",y=" + e.offsetY);
    }
    
    
}