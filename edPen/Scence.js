﻿var Debugger = function (context) {
    this.context = context;
    this.canvas = this.context.canvas;
    this.POS_WIDTH = 6;
    this.drawCoords = function () {
        this.context.strokeStyle = "red";
        this.context.lineWidth = 0.2;
        this.context.beginPath();
        this.context.moveTo(0, 10);
        this.context.lineTo(this.canvas.width, 10);
        this.context.closePath();
        this.context.stroke();
       
        for (var i = 0; i < this.canvas.width / 10; i++) {
            this.context.beginPath();
            this.context.moveTo(0+i*10, 10);
            this.context.lineTo(0+i*10, (i*10%100==0)?0:5);
            this.context.closePath();
            this.context.stroke();
        }

        this.context.beginPath();
        this.context.moveTo(10, 0);
        this.context.lineTo(10, this.canvas.height);
        this.context.closePath();
        this.context.stroke();
        for (var i = 0; i < this.canvas.width / 10; i++) {
            this.context.beginPath();
            this.context.moveTo(10,0 + i * 10);
            this.context.lineTo((i * 10 % 100 == 0) ? 0 : 5,0 + i * 10);
            this.context.closePath();
            this.context.stroke();
        }
    }
    this.drawPos = function (offset) {
        this.context.fillStyle = "blue";
        this.context.fillRect(offset.offsetX - this.POS_WIDTH / 2, 10-this.POS_WIDTH, this.POS_WIDTH, this.POS_WIDTH);
        this.context.fillRect(10 - this.POS_WIDTH, offset.offsetY - this.POS_WIDTH / 2, this.POS_WIDTH, this.POS_WIDTH);
        this.context.fillStyle = "black";
        this.context.textBaseline = "bottom";
        
        this.context.fillText(offset.offsetY, 10, offset.offsetY+5);
        this.context.fillText(offset.offsetX, offset.offsetX-10, 20);
    }
    this.drawCross = function (offset) {
        this.context.strokeStyle = "red";
        this.context.beginPath();
        this.context.moveTo(offset.offsetX - 10, offset.offsetY);
        this.context.lineTo(offset.offsetX + 10, offset.offsetY);
        this.context.closePath();
        this.context.stroke();
        this.context.beginPath();
        this.context.moveTo(offset.offsetX , offset.offsetY-10);
        this.context.lineTo(offset.offsetX , offset.offsetY+10);
        this.context.closePath();
        this.context.stroke();
        this.context.fillStyle = "black";
        this.context.textBaseline = "bottom";
        var msg = "x=" + offset.offsetX + ",y=" + offset.offsetY;
        this.context.fillText(msg,offset.offsetX+10, offset.offsetY+5);
    }
    this.outputInfo = function (type, offset) {
        
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.context.clearRect(0, this.canvas.height-20,this.canvas.width, 20);
        this.drawCoords();
        this.context.fillStyle = "black";
        this.context.textBaseline = "bottom";
        var msg = type + "[x=" + offset.offsetX + ",y=" + offset.offsetY + "]";
        this.context.fillText(msg, this.canvas.width-msg.length*6, this.canvas.height-10);
        this.drawPos(offset);
        this.drawCross(offset);
    }
    
}


var Scence = function (divName, settings) {
    this.debug = true;
    var options = settings || { width: 300, height: 300 }
    this.div = $(divName);

    this.width = this.div.width() -20 || options.width;
    this.height = this.div.height() - 20 || options.height;
    $("<canvas id='canvas_debug' style='position:absolute;z-index:3;'></canvas>").appendTo(this.div);
    $("<canvas id='canvas_select' style='position:absolute;z-index:2;'></canvas>").appendTo(this.div);
    $("<canvas id='canvas_top' style='position:absolute;z-index:1;'></canvas>").appendTo(this.div);
    $("<canvas id='canvas'></canvas>").appendTo(this.div);
    this.canvas = document.getElementById("canvas");
    this.canvas_top = document.getElementById("canvas_top");
    this.canvas_debug = document.getElementById("canvas_debug");
    this.canvas_select = document.getElementById("canvas_select");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas_top.width = this.width;
    this.canvas_top.height = this.height;
    this.canvas_debug.width = this.width;
    this.canvas_debug.height = this.height;
    this.canvas_select.width = this.width;
    this.canvas_select.height = this.height;
    this.top = $(this.canvas).offset().top;
    this.left = $(this.canvas).offset().left;
    this.context = this.canvas.getContext("2d");
    this.context_top = this.canvas_top.getContext("2d");
    this.context_debug = this.canvas_debug.getContext("2d");
    this.context_select = this.canvas_select.getContext("2d");
    if (this.debug) {
        $(this.canvas_debug).css("border", "1px solid");
        $(this.canvas_select).css("border", "1px solid");
        $(this.canvas_top).css("border", "1px solid");
        $(this.canvas).css("border", "1px solid");
        this.debugger = new Debugger(this.context_debug);
    }
    var instance = this;
    $(this.canvas_debug).bind("mouseup", mouseup);
    $(this.canvas_debug).bind("mousedown", mousedown);
    $(this.canvas_debug).bind("mousemove", mousemove);
    $(this.canvas_debug).bind("mouseout", mouseout);
    $(document).bind("keydown", onkeydown);
    $(document).bind("keypress", onkeypress);
    function onkeydown (event) {
        instance.onkeydown(event);
    }
    function onkeypress(event) {
        instance.onkeypress(event);
    }
    function mouseup(e) {
        instance.mouseup({ offsetX: e.clientX - instance.left, offsetY: e.clientY - instance.top });
    }
    function mousedown(e) {
        instance.mousedown({ offsetX: e.clientX - instance.left, offsetY: e.clientY - instance.top });
    }
    function mouseout(e) {
        instance.mouseout({ offsetX: e.clientX - instance.left, offsetY: e.clientY - instance.top });
    }
    function mousemove(e) {
        instance.mousemove({ offsetX: e.clientX - instance.left, offsetY: e.clientY - instance.top });
    }
    this.mouseup = function (e) {
        logger("mouseup", e);
       
    }
    this.mousedown = function (e) {
        logger("mousedown", e)
       
        
    }
    this.mouseout = function (e) {
        logger("mouseout", e);
       
        
    }
    this.mousemove = function (e) {
        logger("mousemove", e);
       
        
    }
    function logger(type, offset) {
        if (instance.debug) {
            instance.debugger.outputInfo(type, offset);
        }
        instance.command[type](offset);
        //instance.refresh();
    }
    this.refresh = function () {
        //this.command.Draw();
        for (var i = 0; i < this.commandList.length; i++) {
            this.commandList[i].drawSelect();
        }
    }
    this.reDraw = function (reset) {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context_top.clearRect(0, 0, this.context_top.canvas.width, this.context_top.canvas.height);
        for (var i = 0; i < this.commandList.length; i++) {
            if (reset)
                this.commandList[i].selected = false;
            this.commandList[i].Draw();
        }
    }
    this.lastCommandName = "select";
    this.command = new Select(instance);
    this.commandList = [];
    this.registerTools = [MultiMoveSelect, Pen, Line, Rect, Circle, Reset];
    this.getTool = function (name) {
        for (var i = 0; i < this.registerTools.length; i++) {
            if (this.registerTools[i].classname == name) {
                return this.registerTools[i];
            }
        }
        throw Error("Not found");
    }
    this.do = function (name) {
        this.reDraw(true);
        this.lastCommandName = name;
        var newCommand = this.getTool(name);
        if (newCommand) {
            this.command = new newCommand(instance);
            this.command.execute();
            return this.command;
        }
        
    }
    this.clone = function (action) {
        this.commandList.push(action);
        this.do(this.lastCommandName).getStyle(action);
    }
    this.selectCommand = function (actions) {
        console.log(actions);
    }
    this.onkeydown = function (event) {
        if (event.keyCode = 46) {
            if (this.command.last_select && this.command.last_select.length > 0) {
                for (var i = this.command.last_select.length - 1; i > -1; i--) {
                    var action = this.command.last_select[i];
                    action.deleted = true;
                    /*
                    var index = this.commandList.indexOf(action);
                    if (index > -1)
                        this.commandList.splice(index, 1);
                    */
                }
                this.reDraw();
            }
            
        }
    }
    this.onkeypress = function (event) {
        console.log("keycode=" + event.keyCode + ",ctrl=" + event.ctrlKey);
    }
}

