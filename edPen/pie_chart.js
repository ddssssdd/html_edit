var FONTNAME = "AvenirMedium";
var COLOR_MAX = 15;
var NUMBER_MAX = 5;
var SHADOWN_WIDTH = 6;
var NUMBER_RECT_WIDTH = 16;
var NUMBER_RECT_SHADOWN = 3;
var COLOR_BACK = "rgba(237,238,240,1)";
var COLOR_SET = ["rgba(19,171,246,1)", "rgba(237,0,140,1)", "rgba(247,148,29,1)", "rgba(38,204,16,1)", "rgba(87,90,135,1)",
                      "rgba(181, 2, 61,1)", "rgba(15, 204, 135,1)", "rgba(66, 110, 251,1)", "rgba(249, 187, 20,1)",
                     "rgba(119, 81, 196,1)", "rgba(217, 70, 115,1)", "rgba(6, 155, 139,1)", "rgba(248, 101, 20,1)",
                     "rgba(128, 189, 33,1)", "rgba(255, 252, 0, 1)"];

var Circle = function (x, y, context) {
    this.center = { x: x, y: y };
    this.context = context;
    Circle.prototype.arc = function (radius, b, e, color) {
        this.context.beginPath();
        this.context.arc(this.center.x, this.center.y, radius, b, e, false);
        this.context.lineTo(this.center.x, this.center.y);
        this.context.closePath();
        this.context.fillStyle = color;
        this.context.fill();
    }
}
var Bar = function (data, label, index) {
    this.data = data;
    this.label = label;
    this.index = index;
    this.percent = 0;
    this.display = label;
    this.isMax = false;
    this.isMin = false;
    this.begin = 0;
    this.end = 0;
    this.radius = 0;
    this.fontSize = 16;
    this.isSelected = false;
    this.isDrawNumber = true;
    this.textBarPos = { x: 0, y: 0 };
    this.callback = null;
    this.color = "rgba(255,255,255,1)";
    this.original = null;
    this.autoDraw = function () {
        this.draw(this.context, this.begin, this.end, this.color, this.isDrawNumber);
    }
    this.draw2 = function () {
        //if (!this.isDrawNumber)
        //	return;
        var extra = 0;
        if (this.isSelected) {
            extra = SHADOWN_WIDTH;
        }
        this.drawNumber(this.begin + (this.end - this.begin) / 2, this.radius / 2, this.radius + extra, this.color, this.data + '');
    }
    this.draw = function (context, r, begin, end, color, isDrawNumber) {

        this.context = context;
        this.begin = begin;
        this.end = end;
        this.color = color;
        this.radius = r;
        this.isDrawNumber = isDrawNumber;
        if (this.percent <= 0) {
            return;
        }
        if (this.isMax || this.isSelected) {
            this.arc(r + SHADOWN_WIDTH * 2, begin, end, COLOR_BACK);
            this.arc(r + SHADOWN_WIDTH, begin, end, color);

        } else {
            this.arc(r, begin, end, color);

        }
    }

    this.drawNumber = function (an, rb, re, color, label) {
        if (this.percent <= 0) {
            return;
        }
        //an = Math.PI/2;
        var x1 = this.center.x + Math.cos(an) * rb;
        var y1 = this.center.y + Math.sin(an) * rb;
        var x2 = this.center.x + Math.cos(an) * re;
        var y2 = this.center.y + Math.sin(an) * re

        var x3 = this.center.x + Math.cos(an) * (re - 10);
        var y3 = this.center.y + Math.sin(an) * (re - 10)
        this.context.beginPath();
        this.context.arc(x1, y1, 3, 0, Math.PI * 2, true);
        this.context.closePath();
        this.context.fillStyle = "white";
        this.context.fill();
        this.context.strokeStyle = "white";
        this.context.moveTo(x1, y1);
        this.context.lineWidth = 3;
        this.context.lineTo(x3, y3);
        this.context.stroke();
        //context.beginPath();
        //context.arc(x2,y2,5,0,Math.PI*2,true);
        this.context.fillStyle = "white";
        this.context.fillRect(x2 - (NUMBER_RECT_WIDTH + NUMBER_RECT_SHADOWN), y2 - (NUMBER_RECT_WIDTH + NUMBER_RECT_SHADOWN), (NUMBER_RECT_WIDTH + NUMBER_RECT_SHADOWN) * 2, (NUMBER_RECT_WIDTH + NUMBER_RECT_SHADOWN) * 2);
        this.context.fillStyle = color;
        this.context.fillRect(x2 - NUMBER_RECT_WIDTH, y2 - NUMBER_RECT_WIDTH, NUMBER_RECT_WIDTH * 2, NUMBER_RECT_WIDTH * 2);
        //context.closePath();
        this.context.fillStyle = "white";
        this.context.font = this.fontSize + "px " + FONTNAME;
        var labelWidth = parseInt(this.context.measureText(label).width); //label.length * 2.5;
        var textH = parseInt(this.context.measureText('A').width);
        this.context.fillText(label, x2 - labelWidth / 2, y2 + textH / 2);
    }
    this.drawTextBar = function (x, y, w, h) {
        this.textBarPos.x = x;
        this.textBarPos.y = y;
        this.textBarPos.w = w;
        this.textBarPos.h = h;

        if (this.isSelected) {// draw grey selected bar in background
            this.context.font = "12px " + FONTNAME;

            var actualWidth = parseInt(this.context.measureText(this.label).width) + 70 + 10;
            this.context.fillStyle = COLOR_BACK;
            this.context.fillRect(x, y, actualWidth, h);
        } else {
            this.context.fillStyle = "white";
            this.context.fillRect(x, y, w, h);
        }
        this.context.fillStyle = this.color;
        this.context.fillRect(x, y, 60, h);
        this.context.fillStyle = "white";
        this.context.font = "12px " + FONTNAME;
        var txty = y + 15;
        //var p = (this.percent.toFixed(2)+'%').replace('.00','');
        var p = (this.percent.toFixed(2) + '%');
        this.context.fillText(p, x + 10, txty);
        this.context.closePath();
        this.context.fillStyle = "black";
        this.context.fillText(this.label, x + 70, txty);

    }
    this.feel = function (angel, x, y) {
        var distance = Math.sqrt((x - this.center.x) * (x - this.center.x) + (y - this.center.y) * (y - this.center.y));
        //console.log("distance ="+distance+", radius="+this.radius);
        var result = angel > this.begin && angel < this.end && (distance < this.radius + 20);
        var result2 = ((x > this.textBarPos.x) && (x < this.textBarPos.x + this.textBarPos.w)) &&
        				((y > this.textBarPos.y) && (y < this.textBarPos.y + this.textBarPos.h));
        return result || result2;
    }
}
Bar.prototype = new Circle(0, 0, null);

var ClearData = function (data, labels, centerX, centerY, settings) {
    //clean data 
    var total = 0;
    var items = [];
    var max = 0;
    var min = 999999;

    for (var i = 0; i < data.length; i++) {
        var value = Number(data[i]);
        if (isNaN(value))
            value = 0;
        total += value;
        var label = "";
        if (i < labels.length) {
            label = labels[i];
        } else {
            label = value + '';
        }
        var bar = new Bar(value, label, i);
        bar.center.x = centerX;
        bar.center.y = centerY;
        
        if (settings.func) {
            bar.callback = settings.func;
        }
        
        if (settings.data && settings.data instanceof Array) {
            bar.original = { index: i, item: (settings.data.length>i?settings.data[i]:0) };
        } else {
            bar.original = i;
        }
        if (settings.bar && settings.bar.fontSize) {
            bar.fontSize = settings.bar.fontSize || 16;
        }
        items.push(bar);
        if (value > max) {
            max = value;
        }
        if (value < min) {
            min = value;
        }
    }
    for (var i = 0; i < items.length; i++) {
        if (total > 0) {
            items[i].percent = items[i].data / total * 100;
        } else {
            items[i].percent = 0;
        }

        if (items[i].data == max) {
            items[i].isMax = true;
        }
        if (items[i].data == min) {
            items[i].isMin = true;
        }
        //items[i].display = items[i].percent.toFixed(2) + '%';
        items[i].display = items[i].label + '';
    }
    if (settings && settings.not_sort) {

    } else {
        items = items.sort(function (a, b) {
            if (a.data > b.data)
                return -1;
            else if (a.data < b.data)
                return 1;
            else
                return 0;
        });
        for (var i = 0; i < items.length; i++) {
            items[i].index = i;
            //items[i].display = i + '';
        }
    }
    //console.log(items);
    return items;
}
var ClearData2 = function (data, centerX, centerY, settings) {
    //clean data 
    var total = total;
    var items = [];
    var max = 0;
    var min = 999999;

    for (var i = 0; i < data.length; i++) {

        var bar = new Bar(data[i].data, data[i].label, i);
        bar.percent = data[i].percent;
        bar.center.x = centerX;
        bar.center.y = centerY;
        if (settings.bar && settings.bar.fontSize) {
            bar.fontSize = settings.bar.fontSize || 16;
        }
        items.push(bar);
        if (bar.data > max) {
            max = bar.data;
        }
        if (bar.data < min) {
            min = bar.data;
        }
        bar.original = data[i];
        if (data[i].func) {
            bar.callback = data[i].func;
        }
    }
    for (var i = 0; i < items.length; i++) {
        if (items[i].data == max) {
            items[i].isMax = true;
        }
        if (items[i].data == min) {
            items[i].isMin = true;
        }
        //items[i].display = items[i].percent.toFixed(2) + '%';
        items[i].display = items[i].label + '';
    }
    if (settings && settings.not_sort) {

    } else {
        items = items.sort(function (a, b) {
            if (a.data > b.data)
                return -1;
            else if (a.data < b.data)
                return 1;
            else
                return 0;
        });
        for (var i = 0; i < items.length; i++) {
            items[i].index = i;
            //items[i].display = i + '';
        }
    }
    //console.log(items);
    return items;
}
function PieChart(data, labels, id, settings) {

    settings = settings || {};

    var div = document.getElementById(id);
    var canvas = document.createElement("canvas");
    div.appendChild(canvas);
    var w = div.clientWidth;
    var h = div.clientHeight;
    if (w == 0) {
        w = settings.width || 300;
    }
    if (h == 0) {
        h = settings.height || 300;
    }
    var r = w / 2;
    var center = { x: w / 2, y: h / 2, r: r - 35, hasText: false };
    if (w > h)//left right type
    {
        r = h / 2;
        center = { x: h / 2, y: h / 2, r: r - 35, hasText: true, textPos: { x: h - 20, y: 10, width: w - h - 20, height: h - 20 } };
    } else if (w < h) //top bottom
    {
        r = w / 2
        center = { x: w / 2, y: w / 2, r: r - 35, hasText: true, textPos: { x: 20, y: w - 20, width: w - 30, height: h - w - 20 } };
    }
    var context = canvas.getContext("2d");

    canvas.width = w;
    canvas.height = h;

    var items;
    var no_need_recalculate_total = false;
    if (labels instanceof Array) {
        items = ClearData(data, labels, center.x, center.y, settings);
    } else {
        settings.not_sort = true;
        items = ClearData2(data, center.x, center.y, settings);
        no_need_recalculate_total = true;

    }
    var itemsCircle = items.concat();
    if (settings.not_sort) {
        itemsCircle = items.sort(function (a, b) {
            if (a.data > b.data)
                return -1;
            else if (a.data < b.data)
                return 1;
            else
                return 0;
        });
    }

    function drawcircle(r, colors) {
        var startAngle = 0;
        var endAngle = 0;
        var total = 0;
        for (var i = 0; i < itemsCircle.length; i++) {
            var item = itemsCircle[i];
            item.center.x = center.x;
            item.center.y = center.y;
            var angle = Math.PI * 2 * (item.percent / 100);
            endAngle = startAngle + angle;
            item.draw(context, r, startAngle, endAngle, colors[item.index % COLOR_MAX], (i < NUMBER_MAX));
            startAngle = endAngle;
            total += item.data;
        }
        for (var i = 0; i < items.length; i++) {
            if (items[i].isSelected || i < NUMBER_MAX)
                items[i].draw2();
        }
        return total;
    }
    var refresh = function () {
        context.fillStyle = "rgba(255,255,255,1)";
        context.fillRect(0, 0, w, h);
        var circle = new Circle(center.x, center.y, context);
        circle.arc(center.r, 0, Math.PI * 2, COLOR_BACK); //draw big back

        var total = drawcircle(center.r - SHADOWN_WIDTH, settings.color_set ? settings.color_set : COLOR_SET);//draw all pies
        if (no_need_recalculate_total) {
            total = labels;
        }
        circle.arc(center.r / 2, 0, Math.PI * 2, "rgba(237,238,240,0.5)"); //draw 2nd circle
        circle.arc(center.r / 4, 0, Math.PI * 2, "rgba(255,255,255,1)"); // draw inside white circle

        //draw text in side;
        context.fillStyle = "black";
        context.font = "14px " + FONTNAME;
        var textwidth = parseInt(context.measureText(total + '').width);//(total+'').length*2
        context.fillText(total, center.x - textwidth / 2, center.y + 5);
        if (center.hasText) {
            context.fillStyle = "white";
            context.fillRect(center.textPos.x, center.textPos.y, center.textPos.width, center.textPos.height);
            var textx = center.textPos.x;
            var texty = center.textPos.y;
            for (var i = 0; i < items.length; i++) {
                var bar = items[i];
                /* context.fillStyle = bar.color;
                 context.fillRect(textx + 10, texty + i * 25 + 10, center.textPos.width - 20, 20);
                 */
                bar.drawTextBar(textx + 10, texty + bar.index * 25 + 10, center.textPos.width - 20, 20);
            }
        }

    }
    refresh();
    if (settings.nomove) {
        return {
            center: center,
            context: context
        }
    }
    //event
    canvas.addEventListener("mousemove", function (event) {
        //console.log(event);
        var offsetx = (event.offsetX == undefined ? event.layerX : event.offsetX) - center.x;
        var offsety = (event.offsetY == undefined ? event.layerY : event.offsetY) - center.y;
        var angel = Math.atan(Math.abs(offsety / offsetx));
        if (offsetx > 0) {
            if (offsety > 0) {
                //4 = 
            } else {
                //1
                angel = 2 * Math.PI - angel;
            }
        } else {
            if (offsety > 0) {
                //3
                angel = Math.PI - angel;
            } else {
                //2
                angel = Math.PI + angel;
            }
        }

        var hasTarget = false;
        //console.log("Start to select ....");
        for (var i = 0; i < items.length; i++) {
            var bar = items[i];
            bar.isSelected = false;
            //if (angel > bar.begin && angel < bar.end) {
            if (bar.feel(angel, offsetx + center.x, offsety + center.y)) {
                // console.log("angel=" + angel + ",index=" + bar.index + ",begin=" + bar.begin + ",end=" + bar.end);
                bar.isSelected = true;
                hasTarget = true;
                // console.log("select :"+bar.display+", x="+(offsetx+center.x)+",y="+(offsety+center.y));
                //console.log(bar.textBarPos);
            }
        }
        //console.log("End to select");
        if (hasTarget) {
            refresh();
        }


    });
    canvas.addEventListener("click", function (event) {
        //console.log(event);
        var offsetx = (event.offsetX == undefined ? event.layerX : event.offsetX) - center.x;
        var offsety = (event.offsetY == undefined ? event.layerY : event.offsetY) - center.y;
        var angel = Math.atan(Math.abs(offsety / offsetx));
        if (offsetx > 0) {
            if (offsety > 0) {
                //4 = 
            } else {
                //1
                angel = 2 * Math.PI - angel;
            }
        } else {
            if (offsety > 0) {
                //3
                angel = Math.PI - angel;
            } else {
                //2
                angel = Math.PI + angel;
            }
        }

        var hasTarget = false;        
        for (var i = 0; i < items.length; i++) {
            var bar = items[i];
            bar.isSelected = false;
            
            if (bar.feel(angel, offsetx + center.x, offsety + center.y)) {
            
                bar.isSelected = true;
                hasTarget = true;
            
                //alert(bar.display);
                if (bar.callback) {
                    var func = eval(bar.callback);
                    func(bar.original,bar.color);
                }
                break;
            }
        }
        
    });
    canvas.addEventListener("mouseout", function (event) {
        for (var i = 0; i < items.length; i++) {
            var bar = items[i];
            bar.isSelected = false;
        }
        refresh();
    });
    return {
        center: center,
        context: context
    }
}