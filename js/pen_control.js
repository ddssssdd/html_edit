var isEdit = true;
var longpress_timer;
var isclick;
var click_a;
var command;

var current_style;

var StyleSetup = function (opacity,thinkness,color,fillcolor,li)
{
    this.opacity = opacity;
    this.thinkness = thinkness;
    this.color = color;
    this.fillcolor = fillcolor;
    this.isFill = 0;
    this.li = li;
    this.div_setting_name;
    this.div_color_name;
    this.namespace;
    this.init = function (isFill)
    {
        $("div.selectColor > ul > li").unbind("click");
        this.isFill = isFill;
        $("div.selectColor > ul > li").removeClass("select");
        var li = $("div.selectColor > ul > li[color='" +( isFill?this.fillcolor:this.color) + "']");
        li.addClass("select");
        var instance = this;
        $("div.selectColor > ul > li").click(function () {
            $("div.selectColor > ul > li").removeClass("select");
            $(this).addClass("select");
            var color = $(this).attr("color");
            if (instance.isFill) {
                instance.fillcolor = color;
                $(click_a).attr("brushcolor", color);
            } else {
                instance.color = color;
                $(click_a).attr("pencolor", color);
                $(".colorSelect").css("background-color", color);
                $(click_a).css("background-color", color);
            }
            //graphic.settings_change(instance.color, instance.fillcolor, instance.thinkness, instance.opacity);
            instance.update();
            instance.draw();
        });
    }
    this.update = function ()
    {
        graphic.settings_change(this.color, this.fillcolor, this.thinkness, this.opacity);
    }
    this.draw = function ()
    {
        $("input[opacity]").val(this.opacity);
        $("input[thickness]").val(this.thinkness);
        this.drawbackground("pencolor", this.color);
        this.drawbackground("brushcolor", this.fillcolor);
    }
    this.bindchange = function ()
    {
        $("input[thickness]").unbind("change");
        $("input[opacity]").unbind("change");
        var instance = this;
        $("input[thickness]").change(function () {

            instance.thinkness = $(this).val();
            $(click_a).attr("penwidth", instance.thinkness);
            instance.update();
        });
        $("input[opacity]").change(function () {

            instance.opacity = $(this).val();
            $(click_a).attr("opacity", instance.opacity);
            instance.update();
        });
    }
    this.drawbackground = function (canvasname, pencolor)
    {
        var div1 = $(this.namespace+" div["+canvasname+"]");
        div1.empty();
        $("<canvas id='canvas_"+canvasname+this.namespace+"'></canvas>").appendTo(div1);
        var canvas_pencolor = document.getElementById("canvas_"+canvasname+this.namespace);
        canvas_pencolor.width = 30;
        canvas_pencolor.height = 30;
        var context_pencolor = canvas_pencolor.getContext("2d");
        context_pencolor.fillStyle = pencolor;
        context_pencolor.fillRect(0, 0, 30, 30);
    }
    
}

//help button on click
function do_help(a)
{
    if (!isEdit)
        $(".leftNavBar").show();
    $(".helpMaskLayer").toggle();
}
function hide_help()
{
    if (!isEdit)
        $(".leftNavBar").hide();
    $(".helpMaskLayer").toggle();
}

//edit button on click
function do_edit(a)
{
    if (isEdit) {
        isEdit = false;
        $(a).parent().removeClass("editSelect");
        $(a).parent().addClass("edit");
        $(".leftNavBar").hide();
    } else {
        isEdit = true;
        $(a).parent().removeClass("edit");
        $(a).parent().addClass("editSelect");
        $(".leftNavBar").show();
    }
    
    //show toolbar

}

//annotations button click
function do_annotations(a)
{

    $(".annotationsTooltip").toggle();
}

function setup_color(a)
{
    var pencolor = $(a).parent().attr("pencolor");
    var brushcolor = $(a).parent().attr("brushcolor");
    var penwidth = $(a).parent().attr("penwidth");
    var opacity = $(a).parent().attr("opacity");
    var setupstyle = $(a).parent().attr("setupstyle");
    var toolwinname = ".styleSettingTooltip";
    if (setupstyle == "font")
    {
        toolwinname = ".fontStyleSettingTooltip";
    }
    var toolwin=$(toolwinname).toggle();
    var visible = toolwin.css("display") == "block";
    if (visible)
    {
        $("div"+toolwinname+" div.inksetting").show();
        $("div" + toolwinname + " div.selectColor").hide();
        //should init style canvas, according to which tools;
        current_style = new StyleSetup(opacity, penwidth, pencolor, brushcolor,$(a).parent());
        current_style.namespace = toolwinname;
        current_style.draw();
        current_style.div_setting_name = "div" + toolwinname + " div.inksetting";
        current_style.div_color_name = "div" + toolwinname + " div.selectColor";
        current_style.bindchange();
    }

}

function style_color_click(isFill)
{
    //open color select
    $(current_style.div_setting_name).hide();
    $(current_style.div_color_name).show();
    current_style.init(isFill);
}
function style_title_click()
{
    if ($(current_style.div_color_name).css("display") == "block")
    {
        $(current_style.div_setting_name).show();
        $(current_style.div_color_name).hide();
        //has selected color and go back 
    }
}
function pencolor_select()
{
   
    $(".colorSettingTooltip").show();
}
function init_tools()
{
    //hide all toolwin
    $("[toolwin]").hide();

    //init edit
    $(".leftNavBar").show();

    //tool buttons long press
    $("a[longpress]").parent().each(
        function (s) {
            $(this).attr("last", $(this).attr("class"));
        }
    );
    $("a[longpress]").mouseup(function () {
        if (isclick) {
            console.log("only click");
            process_on_tool_button(isclick);
        } else {
            console.log("long press");
        }
        clearTimeout(longpress_timer);
        
        return false;
    }).mousedown(function () {
        $("[toolwin]").hide();
        isclick = true;
        click_a = $(this);//.attr("longpress");
        longpress_timer = window.setTimeout(function () {
            isclick = false;
            process_on_tool_button(isclick);
        }, 1000);
        return false;
    });
    //sub tools a click
    $("a[subkey]").click(function () {
        var a = $(this);
        var tool = a.attr("tool");
        var subkey = a.attr("subkey");
        var p = $("a[longpress='" + tool + "']");
        if (p)
        {
            p.attr("select", subkey);
            do_command(p, tool, subkey);
        }
    });
}

function process_on_tool_button(isclick)
{

    var tool_type = $(click_a).attr("longpress");
    var current = $(click_a).attr("select");
    var popup = $(click_a).attr("popup") * 1;
    var className = "." + tool_type + "MenuTooltip";

    if (isclick) //only click on this.
    {
        if (popup == 1) {
            $(className).hide();
            popup = 0;
        }
        //setup canvas command
        do_command(click_a,tool_type, current);

    } else //long press on this.
    {
        if (popup == 0) {
            $(className).show();
            popup = 1;
        } else {
            $(className).hide();
            popup = 0;
        }

    }
    

    $(click_a).attr("popup", popup);
}
function do_command(a,tool_type, current)
{
    $("." + tool_type + "MenuTooltip").hide();
    $("a[longpress]").parent().each(
       function (s) {
           $(this).attr("class", $(this).attr("last"));
       }
    );
    var command = new Command(tool_type, current);
   
    //color setup
    if ($(a).attr("colorset")) {
        var pencolor = $(a).attr("pencolor");
        var brushcolor = $(a).attr("brushcolor");
        var opacity = $(a).attr("opacity");
        var penwidth = $(a).attr("penwidth");
        var setupstyle = "color";

        if ($(a).attr("setupstyle")) {
            setupstyle = $(a).attr("setupstyle");
        }
        $(".colorSelect").css("background-color", pencolor);
        $(".colorSelect").attr("current_tool", tool_type);
        $(".colorSelect").attr("pencolor", pencolor);
        $(".colorSelect").attr("brushcolor", brushcolor);
        $(".colorSelect").attr("penwidth", $(a).attr("penwidth"));
        $(".colorSelect").attr("opacity", $(a).attr("opacity"));
        $(".colorSelect").attr("setupstyle", setupstyle);
        console.log("PenColor:" + pencolor + ",PenWidth:" + penwidth + ",BrushColor:" + brushcolor +
            ",opacity:" + opacity);
        command.pencolor = pencolor;
        command.penwidth = penwidth;
        command.brushcolor = brushcolor;
        command.opacity = opacity;
    } 
    console.log("Type:" + tool_type + ",command:" + current);
    graphic.do(command);
    if (tool_type == "action" || tool_type == "text") {
        //no select status;
    } else {
        if (graphic.selecting) {

        } else {
            var li = $(a).parent();
            li.attr("class", current + "SelectBtn");
            li.attr("last", current + "Btn");
        }

    }
    //move tool bar left or right
    if (tool_type == "action" && current == "move") {
        var pos = $(a).attr("position");
        if (pos == "left") {
            $(a).attr("position", "right");
            $(".leftNavBar").css("left", (graphic.width - 20-44) + "px");
        } else {
            $(a).attr("position", "left");
            $(".leftNavBar").css("left", "20px");
        }
    } else if (tool_type == "action" && current == "stop") {
        $(".leftNavBar").hide();
        isEdit = false;
    }

}

init_tools();

