var app = angular.module("edPen", []);


app.controller("UICtrl", function ($scope, MainMenuService) {
    $scope.scence = new Scence("#mainBody");
    $scope.helper = new ActionHelper();
    $scope.settings = {};
    var example_canvas = document.getElementById("example_canvas");
    $scope.helper.example_context = example_canvas.getContext("2d");
    $scope.scence.addEvent("create", function (event) {
        //$scope.command = event.target;
        $scope.change_command(event.target);
    });
    $scope.change_command = function (newCommand) {
        $scope.command = newCommand;
        $scope.helper.setCommand($scope.command);
        $scope.settings = $scope.helper[$scope.command.classname];
        $scope.helper.draw($scope.command);
    }
    
    $scope.ispopuping = false;
    $scope.scence.addEvent("select", function (event) {
        if (event.target.length == 1) {
            //$scope.command = event.target[0];
            $scope.change_command(event.target[0]);
            $scope.selectCommand(event.target[0]);
        }
    });
    $scope.command = $scope.scence.command;
    $scope.mainmenu = { selected: 'toolbar' };
    $scope.do_mainmenu = function (command,li) {
        command = command.toLowerCase();
        if (command.indexOf(' selected') > -1 || command.indexOf('selected ') > -1) {
            //cancel current command
            $scope.mainmenu.selected = null;
            command = command.replace(" selected", "").replace("selected ", "");
        } else {
            $scope.mainmenu.selected = command;
        }
        console.log("Execute mainmenu command:" + command);
        MainMenuService[command](li);

    }
    $scope.execute = function (command) {
        $scope.command= $scope.scence.do(command);
    }

    angular.element(document).bind("click", function () {
        console.log("document click!");
        if ($scope.ispopuping) {
            $scope.ispopuping = false;
        } else {
            $("div[popup]").hide();
        }
        
    });
    $scope.openSetting = function (event) {
        event.stopPropagation();
        angular.element("div.setting-win").toggle();
    }
    $scope.openColor = function (event, c) {
        angular.element("div.color-win").hide();
        angular.element("div.line-start-win").hide();
        angular.element("div.line-end-win").hide();
        event.stopPropagation();
        var popup= angular.element(event.target).closest("div[popup]");
        var top = angular.element(event.target).offset().top - 185;
        var left = popup.offset().left + popup.width();
        var win = angular.element("div.color-win");
        win.css("left", left);
        win.css("top", top);
        win.find("li").each(function () {
            var li = $(this);
            var color = li.find("span").css("background-color");
            li.attr("color", color);
            li.removeClass("selected");
            if (color == $scope.command[c]) {
                li.addClass("selected");
            }
        });
        win.attr("target-color", c);
        win.show();
        
    }
    $scope.openLineSetting = function (event, lineWin) {
        angular.element("div.color-win").hide();
        angular.element("div.line-start-win").hide();
        angular.element("div.line-end-win").hide();
        event.stopPropagation();
        var popup = angular.element(event.target).closest("div[popup]");
        var top = angular.element(event.target).offset().top - 125;
        var left = popup.offset().left + popup.width();
        var win = angular.element("div."+lineWin);
        win.css("left", left);
        win.css("top", top);
        win.show();

    }
    $scope.changFontSize = function (v) {
        $scope.command.fontSize += v;
    }
    $scope.$watch("command.lineWidth", function (v) {
        $scope.command.setStyle({ lineWidth: v });
        $scope.helper.draw($scope.command);
    });
    $scope.$watch("command.opacity", function (v) {
        $scope.command.setStyle({ opacity: v });
        $scope.helper.draw($scope.command);
    });
    $scope.$watch("command.fillColor", function (v) {
        $scope.command.setStyle({ fillColor: v });
        $scope.helper.draw($scope.command);
    });
    $scope.$watch("command.strokeColor", function (v) {
        $scope.command.setStyle({ strokeColor: v });
        $scope.helper.draw($scope.command);
    });
    $scope.$watch("command.fontSize", function (v) {
        $scope.command.setStyle({ fontSize: v });
        $scope.helper.draw($scope.command);
    });
    $scope.$watch("command.fontName", function (v) {
        $scope.command.setStyle({ fontName: v });
        $scope.helper.draw($scope.command);
    });
    $scope.$watch("command.alignment", function (v) {
        $scope.command.setStyle({ alignment: v });
        $scope.helper.draw($scope.command);
    });
    $scope.$watch("command.lineStart", function (v) {
        $scope.command.setStyle({ lineStart: v });
        $scope.helper.draw($scope.command);
    });
    $scope.$watch("command.lineEnd", function (v) {
        $scope.command.setStyle({ lineEnd: v });
        $scope.helper.draw($scope.command);
    });
    $scope.deleteCurrent = function () {
        $scope.command.deleted = true;
        $scope.scence.reDraw();
        angular.element("div[popup]").hide();
    }
    $scope.popup_shortmenu = function (action) {
        angular.element("div[popup]").hide();
        var rect = action.clientRect;
        var menu = angular.element("div[shortmenu]");
        menu.css("left", rect.left + (rect.right - rect.left - menu.width()) / 2);
        menu.css("top", rect.top - 56);
        menu.show();
        $scope.ispopuping = true;
    }
    $scope.selectCommand = function (action) {
        
        action.selected = true;
        $scope.scence.reDraw();
        $scope.popup_shortmenu(action);
        //$scope.scence.do("select");
    }
    $scope.deleteCommand = function (action, event) {
        event.stopPropagation();
        action.deleted = true;
        $scope.scence.reDraw();
        angular.element("div[popup]").hide();
    }
    $scope.noteCurrent = function (event) {
        event.stopPropagation();
        var rect = $scope.command.clientRect;
        var win = angular.element("div.left");
        win.css("left", rect.right);
        win.css("top", rect.top);
        win.show();
        win.find("textarea").focus();
    }
    $scope.copyCurrent = function (event) {
        console.log($scope.command);
    }


    //for moving
    $scope.mouse = {
        start: { x: 0, y: 0 },
        moving : false,
        items: [],
        move: function (vx,vy) {
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                var top = parseInt(item.css("top"));
                var left = parseInt(item.css("left"));
                item.css("top", top + vy);
                item.css("left", left + vx);
            }
        }
    }
});
app.service("MainMenuService", function () {
    
    this.log = function (command,li) {
        //console.log("last command:" + this.current);
        this.current = command;
        //console.log(angular.element(li));
    }
    this.toolbar = function (li) {
        if (arguments.callee == this.current) {
            console.log("execute again");
            //hide toolbar
         
        } else {
            console.log("execute new");
            //show toolbar
            
        }
        this.log(arguments.callee, li);
        angular.element("div.toolbar").toggle();
    }
    this.help = function (li) {
        this.log(arguments.callee, li);
        
        angular.element("div.help-wrap").toggle();
        if (angular.element("div.help-wrap").is(":visible")) {
            angular.element("div.toolbar").show();
        }
    }
    this.search = function (li) {
        this.log(arguments.callee, li);
    }
    this.history = function (li) {
        this.log(arguments.callee, li);
        angular.element("div.annotationsTooltip").toggle();
        
    }
    this.export = function (li) {
        this.log(arguments.callee, li);
    }
    this.grid = function (li) {
        this.log(arguments.callee, li);
    }
    this.remove = function (li) {
        this.log(arguments.callee, li);
        angular.element(li).find("div.sub-tooltip").toggle();
    }
    this.current = this.toolbar;
});
app.directive("popup", function () {
    return {
        link: function (scope, element, attrs) {
            angular.element(element).hide();
            element.bind("click", function (event) {
                event.stopPropagation();
            });
        }
    }
});
app.directive("mainMenu", function () {
    return {
        link: function (scope, element, attrs) {
            function bind() {
                angular.element(element).find("li").removeClass("selected");
                if (scope.mainmenu && scope.mainmenu.selected) {
                    angular.element(element).find("li." + scope.mainmenu.selected).addClass("selected");
                }
            }
            angular.element(element).bind("click", function (event) {
                event.stopPropagation();
                var command = angular.element(event.target).attr("class");
                //console.log(command);
                scope.do_mainmenu(command,event.target);
                scope.$apply();
                bind();
            });
            bind();
        }
    }
});

app.directive("command", function () {
    return {
        link: function (scope, element, attrs) {
            element.bind("click", function (event) {
                //var command = angular.element(event.target).attr("command");
                //console.log(command + "," + attrs.command);
                
                event.stopPropagation();
                if (element.attr("done") == "1") {
                    return;
                }
                angular.element("div[popup]").hide();
                scope.execute(element.attr("command"));
                //scope.execute(attrs.command);
                if (attrs.once) {
                    angular.element(event.target).closest("div[popup]").hide();
                } else {
                    angular.element(event.target).closest("ul").find("[command]").removeClass("selected");
                    angular.element(event.target).closest("li").addClass("selected");
                }
            })
        }
    }
});

app.directive("toolChange", function () {
    return {
        link: function (scope, element, attrs) {
            element.click(function (event) {
                //console.log(event.target);
                var tool = $(event.target).text();
                var target = attrs.target;
                //console.log(target+","+tool);
                var li = angular.element("li[window='"+target+"']");
                li.attr("command",tool);
                li.attr("class", tool);
                li.removeAttr("done");
                li.trigger("click");
                element.closest("div[popup]").hide();
            });
        }
    }
});


app.directive("setupColor", function () {
    return {
        link: function (scope, element, attrs) {
            element.find("span").bind("click", function (event) {
                
                var color = angular.element(event.target).parent().attr("color");
                var target_color = angular.element("div.color-win").attr("target-color");
                scope.command[target_color] = color;
                scope.$apply();
                angular.element("div.color-win").removeAttr("target-color");
                angular.element("div.color-win").hide();
            });
        }
    };
});

app.directive("moving", function () {
    return {
        link: function (scope, element, attrs) {
            element.bind("mousedown", function (event) {
                scope.mouse.items.push(element);
            });
        }
    }
});

app.directive("longpress", function () {
    return {
        link: function (scope, element, attrs) {
            var pressTimer;
            element.bind("mousedown", function (event) {
                element.removeAttr("done");
                pressTimer = window.setTimeout(function () {
                    //console.log("long press" + element);
                    do_longpress();
                }, 1000);
                event.stopPropagation();
            });
            element.bind("mouseup", function (event) {
                clearTimeout(pressTimer);
                event.stopPropagation();
            });
            function do_longpress() {
                //console.log(attrs.window);
                angular.element(attrs.window).show();
                element.attr("done", "1"); //to prevent click event happen.
            }
        }
    }
});
app.directive("mouseEvent", function () {
    return {
        link: function (scope, element, attrs) {
            var pressTimer;
            element.bind("mouseup", function (event) {                
                scope.mouse.start = { x: 0, y: 0 };
                scope.mouse.false = true;
                scope.mouse.items = [];
                clearTimeout(pressTimer);
            });
            element.bind("mousedown", function (event) {
                scope.mouse.start ={ x: event.clientX, y: event.clientY };
                scope.mouse.moving = true;
                element.removeAttr("done");
                pressTimer = window.setTimeout(function () {
                    do_longpress(event);
                }, 1000);
            });

            element.bind("mousemove", function (event) {
                clearTimeout(pressTimer);
                if (scope.mouse.moving) {
                    start2 = { x: event.clientX, y: event.clientY };
                    var vx = (start2.x - scope.mouse.start.x);
                    var vy = (start2.y - scope.mouse.start.y);
                    scope.mouse.move(vx, vy);
                    scope.mouse.start = { x: event.clientX, y: event.clientY };
                }
            });
            element.bind("mouseout", function (event) {
                scope.mouse.start = { x: 0, y: 0 };
                scope.mouse.moving = false;
                scope.mouse.items = [];
            });
            function do_longpress(event) {
                var win = angular.element("div[shortmenuall]");
                win.css("left", event.clientX- element.offset().left - win.width()/2);
                win.css("top", event.clientY - element.offset().top - win.height());
                win.show();
                scope.ispopuping = true;
                clearTimeout(pressTimer);
            }
        }
    }
});
app.directive("lineSetting", function () {
    return {
        scope:false,
        link: function (scope, element, attrs) {
            //console.log(attrs);
            function refresh() {
                if (scope.command && scope.command.classname == "polyline") {
                    var degree = angular.element(element).closest("div[popup]").hasClass("line-start-win") ? 0 : 180;
                    var context = element.context.getContext('2d');
                    element.context.width = element.width();
                    element.context.height = element.height();
                    var w = context.canvas.width;
                    var h = context.canvas.height;
                    context.clearRect(0, 0, w, h);
                    scope.command.drawLineSet(context,w/2,h/2, attrs.lineSetting, degree, scope.command.strokeColor, scope.command.fillColor);
                }
                
            }
            refresh();
            scope.$watch(attrs.fillColor, function () {
                refresh();
            });
            scope.$watch(attrs.strokeColor, function () {
                refresh();
            });
            element.bind("click", function () {
                var index = attrs.lineSetting;
                var prop = angular.element(element).closest("div[popup]").hasClass("line-start-win") ? "lineStart" : "lineEnd";
                scope.command[prop] = index;
                scope.$apply();
            });
        }
    };

});
function ActionHelper() {
    this.example_context = null;
    this.thumb_context = null;
    var pen = function () {
        this.set_color = true;
        this.set_fill = true;
        this.set_opactiy = true;
        this.set_thinkness = true;
        this.set_font = false;
        this.set_size = false;
        this.set_alignment = false;
        this.command = null;
    }
    pen.prototype.draw = function (example_context,thumb_context) {
        this.draw_example_full(example_context);
        this.draw_thumb(thumb_context);
    }
    pen.prototype.draw_example_full = function (context) {
        if (!context)
            return;
        if (!this.command)
            return;
        context.save();
        context.fillStyle = this.command.fillColor;
        context.strokeStyle = this.command.strokeColor;
        context.globalAlpha = this.command.opacity/100;
        context.lineWidth = this.command.lineWidth;
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        this.draw_example(context);
        context.restore();
    }
    pen.prototype.draw_example = function (context) {
        var r = 80;
        var start = 20;
        var w = context.canvas.width;
        var h = context.canvas.height;
        context.beginPath();
        context.lineCap = "round";
        context.moveTo(start, h / 2);
        context.bezierCurveTo(r, h, w / 2-r, h, w / 2, h / 2);
        context.bezierCurveTo(w/2+r, 0, w-r , 0, w-start, h / 2);
        context.stroke();
        context.closePath();
    }
    pen.prototype.draw_thumb = function (context) {
        if (!context)
            return;
        context.save();
        context.fillStyle = "red";
        context.fillRect(10, 10, context.canvas.width - 10, context.canvas.height - 10);
        context.restore();
    }
    var brush = function () {

    }
    brush.prototype = new pen();

    var circle = function () {
        this.draw_example = function (context) {
            var r = 20;
            var w = context.canvas.width;
            var h = context.canvas.height;
            context.beginPath();
            context.arc(w/2, h+h+r,h+h, 0, Math.PI * 2, true);
            context.stroke();
            context.fill();
            
        }
    }
    circle.prototype = new pen();
    var rect = function () {
        this.draw_example = function (context) {
            var r = 30;
            var w = context.canvas.width;
            var h = context.canvas.height;
            context.fillRect(r, r, w - r*2, h);
            context.strokeRect(r, r, w - r*2, h);
            
        }
    }
    rect.prototype = new pen();
    var line = function () {
        this.draw_example = function (context) {
            
            var start = 20;
            var w = context.canvas.width;
            var h = context.canvas.height;
            context.beginPath();
            context.lineCap = "round";
            context.moveTo(start, h / 2);
            context.lineTo(w - start, h / 2);
            context.stroke();
            context.closePath();
        }
    }
    line.prototype = new pen();
    var polygon = function () {
        this.draw_example = function (context) {
            var r = 40;
            var w = context.canvas.width;
            var h = context.canvas.height;
            context.beginPath();

            context.moveTo(0, h + r);
            context.lineTo(r, r);
            context.lineTo(w - r,r);
            context.lineTo(w, h + r);
            context.lineTo(0, h + r);
            context.closePath();
            context.stroke();
            context.fill();

        }
    }
    polygon.prototype = new pen();
    var polyline = function () {
        this.set_lineStart = true;
        this.set_lineEnd = true;
        this.draw_example = function (context) {
            var r = 15;
            var start = 20;
            var w = context.canvas.width;
            var h = context.canvas.height;
            context.beginPath();
            context.lineCap = "round";
            context.moveTo(start, h / 2);
            context.lineTo(w/4,h-r*2);
            context.lineTo(w / 4 * 3, r * 2);
            context.lineTo(w-start, h/2);
            context.stroke();
            context.closePath();
            this.command.drawLineDirBegin(context, start, h / 2,w/4,h-r*2, this.command.lineStart, this.command.strokeColor, this.command.fillColor);
            this.command.drawLineDirEnd(context, w-start, h / 2,w / 4 * 3, r * 2, this.command.lineEnd, this.command.strokeColor, this.command.fillColor);
        }
    }
    polyline.prototype = new pen();

    var text = function () {
        this.set_color = true;
        this.set_fill = false;
        this.set_opactiy = true;
        this.set_thinkness = false;
        this.set_font = true;
        this.set_size = true;
        this.set_alignment = true;
        this.draw_example = function (context) {
            context.font = this.command.font();
            var text = "Sample";
            var w = context.canvas.width;
            var h = context.canvas.height;
            var textWidth = parseInt(context.measureText(text).width);
            var textHeight = parseInt(context.measureText('W').width);
            var startx = 10;
            if (this.command.alignment == "right") {
                startx = w - 10 - textWidth;
            } else if (this.command.alignment == "center") {
                startx = w / 2 - textWidth / 2;
            }
            context.fillText(text, startx, h/2+textHeight/2);
        }
    }
    text.prototype = new pen();
    var action = function () {
        this.set_color = false;
        this.set_fill = false;
        this.set_opactiy = false;
        this.set_thinkness = false;
        this.set_font = false;
        this.set_size = false;
        this.set_alignment = false;
        this.draw_example = function (context) {
         
        }
    }
    action.prototype = new pen();
    var erase = function () {

    }
    erase.prototype = new action();
    var upload = function () {
        this.set_color = false;
        this.set_fill = true;
        this.set_opactiy = true;
        this.set_thinkness = false;
        this.set_font = false;
        this.set_size = false;
        this.set_alignment = false;
        this.draw_example = function (context) {

        }
    }
    upload.prototype = new pen();
    this.setCommand = function (command) {
        this[command.classname] = eval("new " + command.classname + "()");
        this[command.classname].command = command;
    }
    this.draw = function (command) {
        if (this[command.classname]) {
            this[command.classname].draw(this.example_context, this.thumb_context);
        }
        
    }
   
}