// JavaScript Document



var screenHeight=$(window).height();
var subSlideBarHeight = 0;



$("#subSlideBar").children("div").each(function(){
	 subSlideBarHeight = subSlideBarHeight + $(this).outerHeight(true);
}); 

var subSlideDivNum = $("#subSlideBar").children("div").length;
var prevHeightNum = 0;
for(var i=0; i< subSlideDivNum; i++){
	
	if(i< subSlideDivNum-1){
		prevHeightNum = prevHeightNum + ($("#subSlideBar").children("div").eq(i).outerHeight(true));
		}else{
		$("#subSlideBar").children("div").eq(i).css('height',screenHeight - prevHeightNum -37);
		}
}
	
	
if(screenHeight>668){
	}else{
  $("#mainNav").css('height',screenHeight-227);
	}

	
$( window ).resize(function() {
	$("#topLevel").css("top",0);
	
	var screenHeight=$(window).height();
 var subSlideBarHeight = 0;
		
	$("#subSlideBar").children("div").each(function(){
	 subSlideBarHeight = subSlideBarHeight + $(this).outerHeight(true);
}); 

var subSlideDivNum = $("#subSlideBar").children("div").length;
var prevHeightNum = 0;
for(var i=0; i< subSlideDivNum; i++){
	
	if(i< subSlideDivNum-1){
		prevHeightNum = prevHeightNum + ($("#subSlideBar").children("div").eq(i).outerHeight(true));
		}else{
		$("#subSlideBar").children("div").eq(i).css('height',screenHeight - prevHeightNum -37);
		}
}
	
	
if(screenHeight>668){
  $("#mainNav").css('height',440);
	}else{
  $("#mainNav").css('height',screenHeight-227);
	}
	
	
	})