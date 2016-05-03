// JavaScript Document


 var screenWidth=$(window).width();
 var mainNavWidth = $("#mainNav").outerWidth();
	var subSlideBarWidth = $("#subSlideBar").outerWidth();

	
	$("#mainBody").css("margin-left",mainNavWidth+subSlideBarWidth);
	$("#HeadertopLevel").css("margin-left",mainNavWidth+subSlideBarWidth);
	$("#HeaderSecondLevel").css("margin-left",mainNavWidth+subSlideBarWidth);
		
 	var screenHeight=$(window).height();	
	var headerHeight = $("#HeadertopLevel").outerHeight();
	var headerSecondHeight = $("#HeaderSecondLevel").outerHeight();
	var headerThirdHeight = $("#HeaderThirdLevel").outerHeight();
	
	$("#mainBody").css("min-width", 1320 - (mainNavWidth+subSlideBarWidth));
	$("#mainBody").css("height",screenHeight-headerHeight-headerSecondHeight-headerThirdHeight);
	$("#postBody").css("height",screenHeight-headerHeight-headerSecondHeight-headerThirdHeight);
	$("#edpenWrap").css("height",screenHeight-headerHeight-headerSecondHeight-headerThirdHeight-80);
	$("#HeadertopLevel").css("min-width", 1320 - (mainNavWidth+subSlideBarWidth));
	$("#HeaderSecondLevel").css("min-width", 1320 - (mainNavWidth+subSlideBarWidth));
	
	/*$("#HeaderSecondLevel").find("div").eq(0).css("width",screenWidth-(mainNavWidth+subSlideBarWidth+60));*/
	



 $( window ).resize(function() {
  	screenHeight=$(window).height();
  	headerHeight = $("#HeadertopLevel").outerHeight();
	headerSecondHeight = $("#HeaderSecondLevel").outerHeight();
	headerThirdHeight = $("#HeaderThirdLevel").outerHeight();
	$("#mainBody").css("height",screenHeight-headerHeight-headerSecondHeight-headerThirdHeight);
	$("#postBody").css("height",screenHeight-headerHeight-headerSecondHeight-headerThirdHeight);
	$("#edpenWrap").css("height",screenHeight-headerHeight-headerSecondHeight-headerThirdHeight-160);
})





function slideBarCollapse(obj){
	 var mainNavWidth = $("#mainNav").outerWidth();
	 var subSlideBarWidth = $("#subSlideBar").outerWidth();
	
	 var obj_id = $(obj).attr("id");
		if(obj_id == "slideBarCollapse"){
			
			$(".user-face .face img").css("border-radius","0px");
			$(".user-face .name").fadeOut(100);
			$(".logo").attr('class','logo-collapse');
			$(".main-nav a").css("text-indent","-9999px");
			$(".main-nav a").animate({width:80},150);
			$("#mainBody").animate({marginLeft:80+subSlideBarWidth},150);
			$("#HeadertopLevel").animate({marginLeft:80+subSlideBarWidth},150);
			$("#HeaderSecondLevel").animate({marginLeft:80+subSlideBarWidth},150);
			$(".user-face").animate({width:80},150);
			$(".slide-bar").animate({width:80},150);
			$("#slideBarCollapse").attr('id','slideBarExpand');
			$("#subSlideBar").animate({left:81},150);
			$(".ScrollBAR").getNiceScroll().resize();
			
			}else{
				
			$(".user-face .face img").css("border-radius","100px");
			$(".user-face .name").fadeIn(100);
			$(".logo-collapse").attr('class','logo');
			$(".main-nav a").css("text-indent","55px");
			$(".main-nav a").animate({width:160},150);
			$("#mainBody").animate({marginLeft:160+subSlideBarWidth},150);
			$("#HeadertopLevel").animate({marginLeft:160+subSlideBarWidth},150);
			$("#HeaderSecondLevel").animate({marginLeft:160+subSlideBarWidth},150);
			$(".user-face").animate({width:120},150);
			$(".slide-bar").animate({width:160},150);
			$("#slideBarExpand").attr('id','slideBarCollapse');
			$("#subSlideBar").animate({left:160},150);
			$(".ScrollBAR").getNiceScroll().resize();
			
			}
	}





function subSlideBarCollapse(obj,pageTitleItem){
	 var mainNavWidth = $("#mainNav").outerWidth();
	 var subSlideBarWidth = $("#subSlideBar").outerWidth();

	 var obj_id = $(obj).attr("id");
		var pageTitle = pageTitleItem;
		
		
		if(obj_id == "subSlideBarCollapse"){
			
			if(pageTitle =="classes"){
				 $("#subSlideBar").attr("class","sub-slide-bar classesCollapse");
				}else if(pageTitle =="bookshelf"){
				 $("#subSlideBar").attr("class","sub-slide-bar bookshelfCollapse");
				}else if(pageTitle =="blog"){
				 $("#subSlideBar").attr("class","sub-slide-bar blogCollapse");
				}else{}
				
	
 			$("#subSlideBarCollapse").attr('id','subSlideBarExpand');
				studentListExpand();
 			$("#subSlideBar").animate({width:80},150);
 			$("#mainBody").animate({marginLeft:mainNavWidth+80},150);
 			$("#HeadertopLevel").animate({marginLeft:mainNavWidth+80},150);
 			$("#subNav li").removeClass("no-transition");
 			$("#editMenu li").removeClass("no-transition");
 			$(".ScrollBAR").getNiceScroll().resize();

			
			
		}else{
			
			if(pageTitle =="classes"){
				 $("#subSlideBar").attr("class","sub-slide-bar classesExpand");
				}else if(pageTitle =="bookshelf"){
				 $("#subSlideBar").attr("class","sub-slide-bar bookshelfExpand");
				}else if(pageTitle =="blog"){
				 $("#subSlideBar").attr("class","sub-slide-bar blogExpand");
				}else{}
				
   if(pageTitle =="blog"){
				
			$("#subSlideBarExpand").attr('id','subSlideBarCollapse');
				studentListExpand();
			$("#subSlideBar").animate({width:210},150);
			$("#mainBody").animate({marginLeft:mainNavWidth+210},150);
			$("#HeadertopLevel").animate({marginLeft:mainNavWidth+210},150);
			$("#subNav li").addClass("no-transition");
			$("#editMenu li").addClass("no-transition");
			$(".ScrollBAR").getNiceScroll().resize();
			
				}else{
					
				
			$("#subSlideBarExpand").attr('id','subSlideBarCollapse');
			$("#subSlideBar").animate({width:150},150);
			$("#mainBody").animate({marginLeft:mainNavWidth+150},150);
			$("#HeadertopLevel").animate({marginLeft:mainNavWidth+150},150);
			$("#subNav li").addClass("no-transition");
			$("#editMenu li").addClass("no-transition");
			$(".ScrollBAR").getNiceScroll().resize();
			
			}
			
			}
	}

$(document).ready(function(e) {
 $("#subSlideBar").each(function(index, element) {
		
  if($(this).hasClass('blogCollapse')){
		 
			 $("#subSlideBarCollapse").attr('id','subSlideBarExpand');
 			$("#subSlideBar").animate({width:80},150);
 			$("#mainBody").animate({marginLeft:mainNavWidth+80},150);
 			$("#HeadertopLevel").animate({marginLeft:mainNavWidth+80},150);
 			$("#subNav li").removeClass("no-transition");
 			$("#editMenu li").removeClass("no-transition");
 			$(".ScrollBAR").getNiceScroll().resize();
			
		}else if($(this).hasClass('classCollapse')){
			
				$("#subSlideBarCollapse").attr('id','subSlideBarExpand')
 			$("#subSlideBar").animate({width:80},150);
 			$("#mainBody").animate({marginLeft:mainNavWidth+80},150);
 			$("#HeadertopLevel").animate({marginLeft:mainNavWidth+80},150);
 			$("#subNav li").removeClass("no-transition");
 			$("#editMenu li").removeClass("no-transition");
 			$(".ScrollBAR").getNiceScroll().resize();
		
		}
		
		
 });
});




function studentListExpand(){
	

	 if($("#subSlideBarExpand").length > 0){
			$("#student-list li .face").animate({marginLeft:8},10);
 		$("#student-list li .info").fadeOut(10);
			$("#student-list").animate({width:80},10);
			$("li.class-name").animate({width:80},10);
			
			$(".following-list li").animate({height:54},10);
			$(".following-list .info").fadeOut(10);
			$(".following-list .face").animate({marginLeft:8},10);
			$(".student-list").animate({width:80},10);
		}
		

			
		
		if($("#subSlideBarCollapse").length > 0){
 		$("#student-list li .face").animate({marginLeft:0},10);
 		$("#student-list li .info").fadeIn(10);
			$("#student-list").animate({width:210},10);
			$("li.class-name").animate({width:210},10);
			
			$(".following-list li").animate({height:92},10);
			$(".following-list .info").fadeIn(10);
			$(".following-list .face").animate({marginLeft:0},10);
			$(".student-list").animate({width:210},10);

			
		}

}

