
    var DEBUG = true;
    var solution = 3; // 1 use canvas style as background;2 use copy and override backgroudn;3 use action to record all move
    var currentTool = null;
    var currentKey = "";
    function popup(key) {
        if (currentKey != key) {
            hideAllTool();
            currentKey = key;
            currentTool = $("." + key + "Tooltip").toggle();
        } else {
            currentTool = $("." + key + "Tooltip").toggle();
            currentKey = "";
        }
        
    }
    function hideAllTool()
    {
        $(".tool").hide();
        
        
    }
    function action(commandName, parameter)
    {
        console.log("Execute Command:" + commandName);
        if (commandName == "undo")
        {
            undo_draw();
        } else if (commandName == "redo") {
            redo_draw();
        }
    }
    function click_file()
    {
        $("#upload_file").trigger("click");
    }
    function upload_change(e)
    {
        console.log("Get Files");
        if (!e.files) {
            return;
        }
        var file =e.files[0];
        console.log(file);
        if (file)
        {
            load_file(file);
        }
        popup("image");
    }
    function choose(ele,cmd,index)
    {
        $("[tools]").removeClass("select");
        $(ele).parent().addClass("select");
        
        console.log(command);
        popup("brush");
        end_paint();
        command = cmd;
        if (index)
        {
            var li = $("#tool_brush");
            for (var i = 0; i < 9; i++)
            {
                li.removeClass("brush" + i);
            }
            li.addClass("brush" + index);
        }
    }
    function set_position(ele,index)
    {
        bmpIndex = index;
        $("[position]").removeClass("select");
        $(ele).parent().addClass("select");
       // popup("image");
    }
    function set_canvas_style(ele,c_style)
    {
        canvas_style = c_style;
        draw_canvas_background();
        $("[canvas_style]").removeClass("select");
        $(ele).parent().addClass("select");
        popup("paper");
    }


    function clear_page()
    {
        clear_context();
        context_back.clearRect(0, 0, canvasWidth, canvasHeight);
        draw_index = 0;
        draw_list = Array();
        actions = Array();
        $("#image_list").empty();
        //draw_boder();
        draw_canvas_background();
        popup("clearBtn");
    }
    function mouseup(e)
    {
        end_paint(e.clientX - $("#canvas").parent().offset().left, e.clientY - $("#canvas").parent().offset().top);
        debugInfo("MouseUp:x=" + e.clientX + ",y=" + e.clientY);

       // console.log(e);
    }
    function mousedown(e) {
        //hide tool if has one
        if (currentKey != "") {
            popup(currentKey);
        }
        start_paint(e.clientX - $("#canvas").parent().offset().left, e.clientY - $("#canvas").parent().offset().top);
        debugInfo("MouseDown:x=" + e.clientX + ",y=" + e.clientY);
        //console.log(e);
    }
    function mousemove(e) {
        draw_graphic(e.clientX - $("#canvas").parent().offset().left, e.clientY - $("#canvas").parent().offset().top);
        debugInfo("MouseMove:x=" + e.clientX + ",y=" + e.clientY);
        //console.log(e);
    }
    function mouseout(e)
    {
        debugInfo("MouseOut:x=" + e.clientX + ",y=" + e.clientY);
        //console.log(e);
    }
    function mouseclick(e)
    {
        //clear_context();
        console.log(e);
        //not drawing ,only mouse move
       // console.log("click on x=" + e.clientX + ",y=" + e.clientY);
       // select_one(e.clientX, e.clientY);
    }
    function select_one(x, y)
    {
        select_action = null;
        clear_context();
        for (var i = 0; i < actions.length; i++) {
            var action = actions[i];
            // console.log("Action[" + action.command + "], (" + action.minX + "," + action.minY + ")-(" + action.maxX + "," + action.maxY + ")");
            if (action.contains(x, y)) {
                console.log("found one, begin draw");
                action.draw_edit(context);
                select_action = action;
            }

        }
    }
    function debugInfo(message)
    {
        $("#debug").html(message);
    }
    function debugCanvas()
    {
        return;
        clear_context();
        draw_boder();
        console.log(canvas);
        console.log(context);
    }
    
    var canvas;
    var context;
    var canvas_back;
    var context_back;
    var canvasTop;
    var canvasLeft;
    var canvasWidth = 765;
    var canvasHeight = 765;
    var isDrawing = false;
    var drew = false;
    var command = "pen";
    var startX;
    var startY;
    var lastX;
    var lastY;
    var penWidth=3;
    var wipeSize = 50;
    var draw_list = Array();
    var actions = Array();
    var draw_index = -1;
    var pen_color = "rgb(0,0,0)";
    var pen_high_color = "rgba(0,0,0,0.05)";
    var canvas_color="rgb(255,255,255)";
    var canvas_style = "plain";
    var canvas_target_width = 765;
    var canvas_target_height = 765;
    var background_space = 50;
    /*
    var bmp_position = [{ x: 0, y: 0, w: canvasWidth, h: canvasHeight },
                        { x: canvasWidth / 4, y: 0, w: canvasWidth/2, h: canvasHeight/2 },
                        { x: canvasWidth / 4, y: canvasHeight / 2, w: canvasWidth/2, h: canvasHeight/2 },
                        { x: 0, y: canvasHeight / 4, w: canvasWidth / 2, h: canvasHeight / 2 },
                        { x: canvasWidth / 2, y: canvasHeight / 4, w: canvasWidth / 2, h: canvasHeight / 2 },
                        { x: canvasWidth / 4, y: canvasHeight / 4, w: canvasWidth / 2, h: canvasHeight / 2 },
                        { x: 0, y: 0, w: canvasWidth / 2, h: canvasHeight / 2 },
                        { x: canvasWidth / 2, y: 0, w: canvasWidth / 2, h: canvasHeight / 2 },
                        { x: 0, y: canvasHeight / 2, w: canvasWidth / 2, h: canvasHeight / 2 },
                        { x: canvasWidth/2, y: canvasHeight / 2, w: canvasWidth / 2, h: canvasHeight / 2 },
    ];
    */
    
    var bmp_position = [
        function (w, h) {
            return { x: 0, y: 0, w: w, h: h };
        },
        function (w, h) {
            return { x: w / 4, y: 0, w: w / 2, h: h / 2 };
        },
        function (w, h) {
            return { x: w / 4, y: h / 2, w: w / 2, h: h / 2 };
        },
        function (w, h) {
            return { x: 0, y: h / 4, w: w / 2, h: h / 2 };
        },
        function (w, h) {
            return { x: w / 2, y: h / 4, w: w / 2, h: h / 2 };
        },
        function (w, h) {
            return { x: w / 4, y: h / 4, w: w / 2, h: h / 2 }
        },
        function (w, h) {
            return { x: 0, y: 0, w: w / 2, h: h / 2 };
        },
        function (w, h) {
            return { x: w / 2, y: 0, w: w / 2, h: h / 2 };
        },
        function (w, h) {
            return { x: 0, y: h / 2, w: w / 2, h: h / 2 }
        },
        function (w, h) {
            return { x: w / 2, y: h / 2, w: w / 2, h: h / 2 };
        }
    ];
    var bmpIndex = 0;
    function init_canvas()
    {
        canvas = document.getElementById("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        context = canvas.getContext('2d');
        canvasTop = $(canvas).offset().top
        canvasLeft = $(canvas).offset().left;
        context.lineWidth = penWidth;

        canvas_back = document.getElementById("canvas_back");
        canvas_back.width = canvasWidth;
        canvas_back.height = canvasHeight;
        
        context_back = canvas_back.getContext('2d');
        $("#canvas").css("z-index", 1);
        $("#canvas").css("left", "50%");
        $("#canvas").css("margin-left", -canvasWidth / 2);
        $("#canvas_back").css("left", "50%");
        $("#canvas_back").css("margin-left", -canvasWidth / 2);
        draw_canvas_background();
    }
    function clear_context()
    {
        context.clearRect(0+1, 0+1, canvasWidth-2, canvasHeight-2);
    }
    function draw_boder()
    {
        $("#canvas").css("left", "50%");
        $("#canvas").css("margin-left", -canvasWidth / 2);
        $("#canvas_back").css("left", "50%");
        $("#canvas_back").css("margin-left", -canvasWidth / 2);
        
        context.rect(0, 0, canvasWidth, canvasHeight);
        //context.closePath();
        context.stroke();
    }
    function undo_draw()
    {
        if (draw_index <0 )
        {
            $("#tool_undo").addClass("disable");
            return;
        }
        
        
        draw_index = draw_index - 1;
        if (draw_index == -1) {
            
            context_back.clearRect(0, 0, canvasWidth, canvasHeight);
        } else {
            var image = new Image();
            image.src = draw_list[draw_index];
            image.onload = function () {
                context_back.clearRect(0, 0, canvasWidth, canvasHeight);
                context_back.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvasWidth, canvasHeight);
            };
        }
        $("#tool_redo").removeClass("disable");
       
    }
    function redo_draw()
    {
        if (draw_index == draw_list.length - 1) {
            $("#tool_redo").addClass("disable");
            return;
        }
        draw_index++;
        
        var image = new Image();
        image.src = draw_list[draw_index];
        image.onload = function () {
            context_back.clearRect(0, 0, canvasWidth, canvasHeight);
            context_back.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvasWidth, canvasHeight);
        };
        $("#tool_undo").removeClass("disable");
    }
    var current_action;
    var select_action;
    
    function start_paint(x, y)
    {
        if (select_action != null && select_action.contains(x, y))
        {
            select_action.beginPoint(x, y);
            draw_canvas_background();
            console.log("moving or resizing");
            return;
        }
        current_action = new Action(x, y, command);
        if (command == "pen")
        {
            context.beginPath();
            context.moveTo(x, y);
        } else if (command == "highlight") {
            context.strokeStyle = pen_high_color;
            context.fillStyle = pen_high_color;
            //context.globalAlpha = 0.25;
           //context.fillStyle = "rgba(255,0,0,0.02)";
           //context.strokeStyle = "rgba(255,0,0,0.02)";
          
            context.beginPath();
            context.moveTo(x, y);
        } else if (command == "eraser")
        {

            context.strokeStyle = canvas_color;
            context.fillStyle = canvas_color;
            lastX = x - wipeSize / 2;
            lastY = y - wipeSize / 2;
            context.fillRect(lastX, lastY, wipeSize, wipeSize);
            //context.strokeRect(lastX - 2, lastY - 2, wipeSize - 4, wipeSize - 4);
            current_action.penColor = canvas_color;
        }
        
        isDrawing = true;
        drew = false;
        startX = x;
        startY = y;
        
        
        
    }
    function end_paint(x, y)
    {
       
        if (select_action != null && select_action.move.action) {
            select_action.endPoint(x, y);
            draw_canvas_background();
            return;
        }
        if (drew && isDrawing && current_action.hasSome())
        {
            if (command == "pen") {

            } else if (command == "highlight") {

                context.strokeStyle = pen_color;
            } else if (command == "line") {


            } else if (command == "rect") {



            } else if (command == "ellipse") {


            } else if (command == "ellipse_fill") {


            } else if (command == "rect_fill") {

            } else if (command == "eraser") {
                //context.strokeRect(lastX - 2, lastY - 2, wipeSize - 4, wipeSize - 4);
            }

            //save_history();
            actions.push(current_action);
            draw_canvas_background();
        } else {
            
            select_one(x,y);
        }
        drew = false;
        isDrawing = false;
        
    }
    function draw_graphic(x, y)
    {
        if (select_action != null && select_action.move.action) {
            clear_context();
            select_action.toPoint(x, y,context);
            
            return;
        }
        if (isDrawing) {
            if (command == "pen") {
                context.lineTo(x, y);
                context.stroke();

            } else if (command == "line") {
                clear_context();

                context.beginPath();
                context.moveTo(startX, startY);
                context.lineTo(x, y);
                context.stroke();

            } else if (command == "highlight") {


                context.lineTo(x, y);

                context.stroke();


            } else if (command == "rect") {
                clear_context();
                var tempx = startX >= x ? x : startX;
                var tempy = startY >= y ? y : startY;
                context.strokeRect(tempx, tempy, Math.abs(x - startX), Math.abs(y - startY));
            } else if (command == "rect_fill") {
                clear_context();

                var tempx = startX >= x ? x : startX;
                var tempy = startY >= y ? y : startY;
                context.fillRect(tempx, tempy, Math.abs(x - startX), Math.abs(y - startY));
            } else if (command == "ellipse") {
                clear_context();
                /*
                context.beginPath();
                var rad = Math.sqrt((startX - x) * (startX - x) + (startY - y) * (startY - y));

                context.arc(startX, startY, rad, 0, Math.PI * 2, false);
                context.closePath();
                context.stroke();
                */
                var w = (x - startX);
                var h = (y - startY);
                drawEllipse(startX, startY, w, h, false);

            } else if (command == "ellipse_fill") {
                clear_context();
                /*
                context.beginPath();
                var rad = Math.sqrt((startX - x) * (startX - x) + (startY - y) * (startY - y));

                context.arc(startX, startY, rad, 0, Math.PI * 2, false);
                context.closePath();
                context.fill();
                */
                var w = (x - startX);
                var h = (y - startY);
                drawEllipse(startX, startY, w, h, true);

            } else if (command == "eraser") {

                context.fillRect(lastX, lastY, wipeSize, wipeSize);
                lastX = x - wipeSize / 2;
                lastY = y - wipeSize / 2;

                //context.strokeRect(lastX - 2, lastY - 2, wipeSize - 4, wipeSize - 4);
            }

            drew = true;
            current_action.add(x, y);
        }
        
    }
    function drawEllipseByCenter( cx, cy, w, h) {
        drawEllipse(cx - w / 2.0, cy - h / 2.0, w, h);
    }

    function drawEllipse( x, y, w, h,fill) {
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
    function draw_canvas_background()
    {
        //todo: unfinish
        if (solution ==1)
        {
            $(canvas_back).css("background-color", canvas_color);
            $(canvas_back).removeClass("graphBg");
            $(canvas_back).removeClass("linedBg");
            if (canvas_style != "plain")
            {
                $(canvas_back).addClass(canvas_style + "Bg");
            }
            save_history();
        }else if (solution ==2)
        {
            if (draw_list.length > 0) {
                var image = new Image();
                image.src = draw_list[draw_list.length - 1];
                image.onload = function () {
                    clear_context();
                    context.fillStyle = canvas_color;
                    context.fillRect(0, 0, canvasWidth, canvasHeight);
                    context.fillStyle = pen_color;

                    //context.globalAlpha = 0.5;
                    //context.globalCompositeOperation = "destination-out";
                    context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvasWidth, canvasHeight);
                    console.log(image);
                    save_history();
                };
            } else {

                clear_context();
                context.fillStyle = canvas_color;
                context.fillRect(0, 0, canvasWidth, canvasHeight);
                context.fillStyle = pen_color;
                save_history();
            }
        }else if (solution ==3)
        {
            clear_context();
            context.fillStyle = canvas_color;
            context.fillRect(0, 0, canvasWidth, canvasHeight);
            context.fillStyle = pen_color;
            context.strokeStyle = "rgba(0,0,0,0.05)";
            context.lineWidth = 0.5;
            
            if (canvas_style == "graph")
            {
               
                for (var i = 0; i < canvasHeight / background_space; i++) {

                    context.moveTo(0, i * background_space);
                    context.lineTo(canvasWidth, i * background_space);
                    context.stroke();
                }
                for (var i = 0; i < canvasWidth / background_space; i++) {

                    context.moveTo(i * background_space, 0);
                    context.lineTo(i * background_space, canvasHeight);
                    context.stroke();
                }
            } else if (canvas_style == "lined") {
                
                for (var i = 0; i < canvasHeight / background_space; i++)
                {
                    
                    context.moveTo(0, i * background_space);
                    context.lineTo(canvasWidth, i * background_space);
                    context.stroke();
                }
            }
            context.strokeStyle = pen_color;
            context.lineWidth = penWidth;
            var complete = function ()
            {
                imageCount--;
                if (imageCount == 0)
                {
                    save_history();
                }
            }
            var imageCount =0;
            for (var i = 0; i < actions.length; i++)
            {
                var action = actions[i];
                if (action.move.action)
                    continue;
                action.draw(context);

            }
            if (imageCount == 0) {
                save_history();
            }
            
        }
        
        
    }
    function save_history()
    {
        var image = new Image();
        image.src = canvas.toDataURL();
        image.onload = function () {
            context_back.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvasWidth, canvasHeight);
            //console.log(image);
            draw_list.push(canvas_back.toDataURL());
            clear_context();
            draw_index = draw_list.length - 1;
            $("#tool_undo").removeClass("disable");
            if (DEBUG) {
                var div = $("#history_div");
                div.empty();
                for (var i = 0; i < draw_list.length; i++) {
                    var img = "<image src='" + draw_list[i] + "' width='50px' height='50px'/>";

                    $(img).appendTo(div);
                }
            }
        };
        
    }
    //drag and drop process

    function load_file(f)
    {
        var t = f.type ? f.type : 'n/a';
        reader = new FileReader();
        isImg = isImage(t);

        // 处理得到的图片  
        if (isImg) {
            var p = bmp_position[bmpIndex];
            console.log(p);
            reader.onload = (function (theFile) {
                return function (e) {
                    var image = new Image();
                    image.src = e.target.result;
                    //console.log(image.src);
                   
                    image.onload = function () {
                        
                        //context.drawImage(image, 0, 0, image.width, image.height, p.x, p.y, p.w, p.h);
                        context.drawImage(image, 0, 0, image.width, image.height, p(canvasWidth, canvasHeight).x, p(canvasWidth, canvasHeight).y, p(canvasWidth, canvasHeight).w, p(canvasWidth, canvasHeight).h);
                        save_history();
                        var action = new Action(0, 0, "image");
                        action.image_src = image.src;
                        action.startX=p(canvasWidth, canvasHeight).x;
                        action.startY=p(canvasWidth, canvasHeight).y;
                        action.lastX=p(canvasWidth, canvasHeight).w;
                        action.lastY = p(canvasWidth, canvasHeight).h;
                        actions.push(action);
                        action.image_name = "temp_" + actions.length;
                        var image_list = $("#image_list");
                        var new_image = "<img src='" + image.src + "' width='" + image.width + "' height='" + image.height + "' id='" + action.image_name + "'/>";
                        $(new_image).appendTo(image_list);
                        
                    }

                };
            })(f)
            reader.readAsDataURL(f);
        }
    }
    // 处理文件拖入事件，防止浏览器默认事件带来的重定向  
    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
    }


    // 判断是否图片  
    function isImage(type) {
        switch (type) {
            case 'image/jpeg':
            case 'image/png':
            case 'image/gif':
            case 'image/bmp':
            case 'image/jpg':
                return true;
            default:
                return false;
        }
    }


    // 处理拖放文件列表  
    function handleFileSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        var files = evt.dataTransfer.files;

        for (var i = 0, f; f = files[i]; i++) {
            
            load_file(f);
            
        }
    }
    
    function init_screen()
    {
        //hide all tool panel
        hideAllTool();
        $("#txtCanvasSize").bind("change", function () {
            //canvas size changed
            var size = $(this).val() * 1;
            
            if (size == 0) {
                $("#lblCanvasSize").html("Small");
                canvas_target_width = 500;
                canvas_target_height = 500;
            } else if (size == 50) {
                canvas_target_width = 600;
                canvas_target_height = 600;
                $("#lblCanvasSize").html("Medium");
            } else {
                canvas_target_width = 765;
                canvas_target_height = 765;
                $("#lblCanvasSize").html("Large");
            }
            /*
            context.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            context_back.clearRect(0, 0, canvas.width, canvas.height);
            canvas_back.width = canvasWidth;
            canvas_back.height = canvasHeight;
            context.lineWidth = penWidth;
            context.strokeStyle = pen_color;
            draw_canvas_background();
            draw_boder();
            */
        });
        $("#txtPenWidth").bind("change", function () {
            //Pen with changed
            var size = $(this).val() * 1;
            console.log($(this).val());
            $("#lblPenWidth").html(size + "px");
            penWidth = size;
            context.lineWidth = penWidth;
        });
        $("#bg_colorlist").children().bind("click", function () {
            //background set up color
            var color_item = $(this).children("a");
            console.log(color_item);
            canvas_color = color_item.css('backgroundColor');
            console.log(canvas_color);
            draw_canvas_background();
            popup("paper");
            $("#bg_colorlist").children().removeClass("select");
            $(this).addClass("select");
        });
        $("#colorlist").children().bind("click", function () {
            //pen color
            var color_item = $(this).children("a");
            console.log(color_item.attr("bcolor"));
            pen_color = color_item.css('backgroundColor');
            pen_high_color = color_item.attr("bcolor");
            console.log(pen_color);
            context.strokeStyle = pen_color;
            context.fillStyle = pen_color;
            popup("fontColor");
            $("#colorlist").children().removeClass("select");
            $(this).addClass("select");
        });
        
        init_canvas();
        $(canvas).bind("mouseup", mouseup);
        $(canvas).bind("mousedown", mousedown);
        $(canvas).bind("mousemove", mousemove);
        $(canvas).bind("mouseout", mouseout);
        $(canvas).bind("click", mouseclick);
        debugCanvas();
        //init drap and drop bmp
        
        canvas.addEventListener('dragover', handleDragOver, false);
        canvas.addEventListener('drop', handleFileSelect, false);
    }
    