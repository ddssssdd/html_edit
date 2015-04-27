var Select = function (scence) {
    
    this.scence = scence;
    this.context = scence ? scence.context : null;
    this.context_top = scence?scence.context_top:null;
    this.current = null;
    this.offset = {x:0,y:0};
    
    this.Draw = function () {
        //nothing;
    }
    Select.prototype.mouseup = function (e) {
        this.current = null;
        this.reDraw();
    }
    Select.prototype.mousedown = function (e) {
        var hasSelected = false;
        this.current = null;
        for (var i = 0; i < this.scence.commandList.length; i++) {
            var action = this.scence.commandList[i];
            //if (!hasSelected && action.inside(e)) {
            if ( action.inside(e)) {
                this.current = action;
                hasSelected = true;
                this.offset.x = e.offsetX;
                this.offset.y = e.offsetY;
            } else {
                action.selected = false;
            }
            
        }
        if (hasSelected) {
            this.reDraw();
        }
    }
    Select.prototype.mousemove = function (e) {
        if (this.current) {
            this.current.move({ x: e.offsetX - this.offset.x, y: e.offsetY - this.offset.y });
            this.current.selected = true;
            this.current.Draw();
            this.offset.x = e.offsetX;
            this.offset.y = e.offsetY;
            this.reDraw();
        }
    }
    Select.prototype.mouseout = function (e) {
       /* if (this.current)
            this.mouseup(e);
            */
    }
    Select.prototype.execute = function () {
        this.scence.refresh();
    }
    Select.prototype.reDraw = function () {
        this.scence.reDraw();
    }
}
Select.classname = "select";
Select.prototype = new Action();
var Reset = function (scence) {
    this.scence = scence;
    this.context = scence.context;
    this.context_top = scence.context_top;
    this.current = null;
    this.Draw = function () {
        //nothing;
    }
    this.mouseup = function (e) {

    }
    this.mousedown = function (e) {

    }
    this.mousemove = function (e) {

    }
    this.mouseout = function (e) {

    }
    this.execute = function () {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context_top.clearRect(0, 0, this.context_top.canvas.width, this.context_top.canvas.height);
        this.scence.commandList = [];
        this.command = new Select(this.scence);
    }
}
Reset.classname = "reset";
Reset.prototype = new Action();


var MultiSelect = function (scence) {
    this.scence = scence;
    this.context = scence.context;
    this.context_top = scence.context_top;
    this.current = [];
    this.offset = { x: 0, y: 0 };

    this.Draw = function () {
        //nothing;
    }
    this.mouseup = function (e) {
        this.current = [];
        this.reDraw();
    }
    this.mousedown = function (e) {
        var hasSelected = false;
        this.current = [];
        for (var i = 0; i < this.scence.commandList.length; i++) {
            var action = this.scence.commandList[i];
            if (action.inside(e)) {
                this.current.push(action);
                hasSelected = true;
                this.offset.x = e.offsetX;
                this.offset.y = e.offsetY;
            } else {
                action.selected = false;
            }

        }
        if (hasSelected) {
            this.reDraw();
        }
    }
    this.mousemove = function (e) {
        if (this.current.length > 0) {
            for (var i = 0; i < this.current.length; i++) {
                this.current[i].move({ x: e.offsetX - this.offset.x, y: e.offsetY - this.offset.y });
                this.current[i].selected = true;
            }
            this.offset.x = e.offsetX;
            this.offset.y = e.offsetY;
            this.reDraw();
        }
    }
    this.mouseout = function (e) {
        /* if (this.current)
             this.mouseup(e);
             */
    }
    this.execute = function () {
        this.scence.refresh();
    }
    this.reDraw = function () {
        this.scence.reDraw();
    }
}
MultiSelect.classname = "select";
MultiSelect.prototype = new Action(); //simple one


var MultiMoveSelect = function (scence) {
    this.scence = scence;
    this.context = scence.context;
    this.context_top = scence.context_select;
    this.current = [];
    this.offset = { x: 0, y: 0 };
    this.last_select = [];
    this.mouseup = function (e) {
        this.reDraw();
        
        if (this.current.length > 0) {
            this.last_select = [];
            for (var i = 0; i < this.current.length; i++) {
                this.last_select.push(this.current[i]);
            }
            this.scence.selectCommand(this.last_select);
        }
        this.current = [];
        this.selecting = false;
        this.context_top.clearRect(0, 0, this.context_top.canvas.width, this.context_top.canvas.height);
        
    }
    this.mousedown = function (e) {
        if (this.last_select.length > 0) {//has some sharp selected
            for (var i = 0; i < this.last_select.length; i++) {
                var action = this.last_select[i];
                if (action.inside(e)) {
                    this.offset.x = e.offsetX;
                    this.offset.y = e.offsetY;
                    this.current = this.last_select;
                    return;
                }
            }
        }
        this.selecting = false;
        var hasSelected = false;
        this.current = [];
        this.last_select = [];
        for (var i = 0; i < this.scence.commandList.length; i++) {
            var action = this.scence.commandList[i];
            if (action.inside(e)) {
                this.current.push(action);
                hasSelected = true;
                
            } else {
                action.selected = false;
            }

        }
        this.offset.x = e.offsetX;
        this.offset.y = e.offsetY;
        if (hasSelected) {
            this.reDraw();
        } else {
            this.selecting = true;
        }
    }
    this.mousemove = function (e) {
        if (this.selecting) {
            this.drawMultiSelect(this.offset.x, this.offset.y, e.offsetX - this.offset.x, e.offsetY - this.offset.y);
            this.selected_count = 0;
            this.current = [];
            for (var i = 0; i < this.scence.commandList.length; i++) {
                var action = this.scence.commandList[i];
                if (action.inRect(this.offset.x, this.offset.y, e.offsetX, e.offsetY)) {
                    this.selected_count++;
                    this.current.push(action);
                }
            }
            if (this.selected_count>0)
                this.reDraw();
            return;
        }
        
        if (this.current.length > 0) {
            this.multiMove(e);
            return;
        }
    }
    this.multiMove = function (e) {
        for (var i = 0; i < this.current.length; i++) {
            this.current[i].move({ x: e.offsetX - this.offset.x, y: e.offsetY - this.offset.y });
            this.current[i].selected = true;
        }
        this.offset.x = e.offsetX;
        this.offset.y = e.offsetY;
        this.reDraw();
    }
    this.drawMultiSelect = function (x,y,w,h) {
        this.context_top.save();
        this.context_top.clearRect(0, 0, this.context_top.canvas.width, this.context_top.canvas.height);
        this.context_top.strokeStyle = "red";
        this.context_top.setLineDash([10]);
        this.context_top.lineWidth = 1;
        this.context_top.strokeRect(x,y,w,h);
        this.context_top.restore();
    }
}
MultiMoveSelect.classname = "select";
MultiMoveSelect.prototype = new Select(null); //complex one;
//redo
var Redo = function (scence) {
    this.scence = scence;
    this.context = scence.context;
    this.context_top = scence.context_select;
    this.execute = function () {
        var index = 0;
        while (index <this.scence.commandList.length) {
            var action = this.scence.commandList[index];
            if (action.deleted) {
                action.deleted = false;
                break;
            } else {
                index++;
            }
        }
        
        this.scence.reDraw();
    }
}
Redo.classname = "redo";
//undo
var Undo = function (scence) {
    this.scence = scence;
    this.context = scence.context;
    this.context_top = scence.context_select;
    this.execute = function () {
        var l = this.scence.commandList.length;
        while (l>0){
            var action = this.scence.commandList[l - 1];
            if (action.deleted) {
                l = l - 1;
            } else {
                action.deleted = true;
                break;
            }
        }
        this.scence.reDraw();
        
    }
}
Undo.classname = "undo";
