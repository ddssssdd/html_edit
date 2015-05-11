var app = angular.module("edPen", []);
app.controller("UICtrl", function ($scope, MainMenuService) {
    $scope.scence = new Scence("#mainBody");
    $scope.scence.addEvent("create", function (event) {
        $scope.command = event.target;
    });
    
    $scope.ispopuping = false;
    $scope.scence.addEvent("select", function (event) {
        if (event.target.length == 1) {
            $scope.command = event.target[0];
            var rect = event.target[0].clientRect;
            var menu = angular.element("div.shortcutMenu");
            menu.css("left", rect.left+(rect.right-rect.left-menu.width())/2);
            menu.css("top", rect.top-56);
            menu.show();
            $scope.ispopuping = true;
            //event.original.event.stopPropagation();
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
        win.toggle();
        
    }
    $scope.changFontSize = function (v) {
        $scope.command.fontSize += v;
    }
    $scope.$watch("command.lineWidth", function (v) {
        $scope.command.setStyle({lineWidth:v})
    });
    $scope.$watch("command.opacity", function (v) {
        $scope.command.setStyle({ opacity: v/100 })
    });
    $scope.$watch("command.fillColor", function (v) {
        $scope.command.setStyle({ fillColor: v })
    });
    $scope.$watch("command.strokeColor", function (v) {
        $scope.command.setStyle({ strokeColor: v })
    });
    $scope.$watch("command.fontSize", function (v) {
        $scope.command.setStyle({ fontSize: v })
    });
    $scope.$watch("command.fontName", function (v) {
        $scope.command.setStyle({ fontName: v })
    });
    $scope.deleteCurrent = function () {
        $scope.command.deleted = true;
        $scope.scence.reDraw();
        $("div[popup]").hide();
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

app.directive("longpress", function () {
    return {
        link: function (scope, element, attrs) {
            var pressTimer;
            element.bind("mousedown", function () {
                element.removeAttr("done");
                pressTimer = window.setTimeout(function () {
                    //console.log("long press" + element);
                    do_longpress();
                }, 1000);
                
            });
            element.bind("mouseup", function () {
                clearTimeout(pressTimer);
            });
            function do_longpress() {
                //console.log(attrs.window);
                angular.element(attrs.window).show();
                element.attr("done", "1"); //to prevent click event happen.
            }
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

app.directive("moving_abondon", function () {
    return {
        link: function (scope, element, attrs) {
            var moving = false;
            var start = { x: 0, y: 0 };
            element.bind("mouseup", function (event) {
                console.log("mouseup");
                moving = false;
                start = { x: 0, y: 0 };
            });
            element.bind("mousedown", function (event) {
                console.log("mousedown");
                moving = true;                
                start = { x: event.clientX , y: event.clientY  };
                console.log("x=" + start.x + ",y=" + start.y);
            });
            
            element.bind("mousemove", function (event) {
                
                if (moving) {
                    start2 = { x: event.clientX, y: event.clientY };
                    console.log("x=" + start2.x + ",y=" + start2.y);
                    var left = angular.element("div.toolbar").offset().left;
                    var top = angular.element("div.toolbar").offset().top;
                    console.log("left=" + left + ",top=" + top);
                    var vx = left + (start2.x- start.x);
                    var vy =top+ (start2.y - start.y);
                    console.log("vx=" + vx + ",vy=" + vy);
                    angular.element("div.toolbar").css("left",vx);
                    angular.element("div.toolbar").css("top", vy );
                    left = angular.element("div.toolbar").offset().left;
                    top = angular.element("div.toolbar").offset().top;
                    console.log("left=" + left + ",top=" + top);
                    start2 = start;
                }
                
            });
            element.bind("mouseout", function (event) {
                moving = false;
                start = { x: 0, y: 0 };
            });
        }
    }
})