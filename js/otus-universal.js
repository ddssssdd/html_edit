// JavaScript Document
	
	
$(document).ready(function(e) {
		
	 var headerCenterBarWidth = $("#headerCenterBar").outerWidth();
	 var headerCenterBarHeight = $("#headerCenterBar").outerHeight();
		
		$("#headerCenterBar").css('margin-left',-(headerCenterBarWidth)/2);
		$("#headerCenterBar").css('margin-top',-(headerCenterBarHeight)/2);
		
		
		
	$('.tooltip').each(function(){
	
	 var tooltipWidth = $(this).outerWidth();
	 var leftBtnWidth =  $(this).find("header").find(".left").outerWidth();
	 var rightBtnWidth =  $(this).find("header").find(".right").outerWidth();
	 if (!leftBtnWidth || leftBtnWidth==0)
		 leftBtnWidth = 90;
	 	
		if(leftBtnWidth>rightBtnWidth){
			
			$(this).find("header").find(".tooltip-title").css("width",tooltipWidth-((leftBtnWidth+10)*2));
			$(this).find("header").find(".tooltip-title").css("margin-left",-(tooltipWidth-((leftBtnWidth+10)*2))/2);
			
			}else{
			
			$(this).find("header").find(".tooltip-title").css("width",tooltipWidth-((rightBtnWidth+10)*2));
			$(this).find("header").find(".tooltip-title").css("margin-left",-(tooltipWidth-((rightBtnWidth+10)*2))/2);
				
			}
	
	});	
	
	
		$('.popup').each(function(){
	
	 var popupWidth = $(this).outerWidth();
	 var popupHeight = $(this).outerHeight();
	 var popupleftBtnWidth = $(this).find("header").find(".left").outerWidth();
	 var popuprightBtnWidth = $(this).find("header").find(".right").outerWidth();
	 
	 if (!popupleftBtnWidth || popupleftBtnWidth==0){
		 popupleftBtnWidth = 90;
	 }
		
		$(this).css({'margin-left':-(popupWidth/2),'margin-top':-(popupHeight/2)})
		
		if(popupleftBtnWidth>popuprightBtnWidth){
			
			$(this).find("header").find(".popup-title").css("width",popupWidth-((popupleftBtnWidth+10)*2));
			$(this).find("header").find(".popup-title").css("margin-left",-(popupWidth-((popupleftBtnWidth+10)*2))/2);
			
			}else{
			
			$(this).find("header").find(".tooltip-title").css("width",popupWidth-((popuprightBtnWidth+10)*2));
			$(this).find("header").find(".tooltip-title").css("margin-left",-(popupWidth-((popuprightBtnWidth+10)*2))/2);
				
			}
	
	});	
		
		
		
		//custom DropDown
 	$(".custom-dropdown-list").each(function(index, element) {
    
			 var dropdownHeight = $(this).find("ul").height();
				if(dropdownHeight>300){
					$(this).find("li").css('width',"173px");
					}else{
					$(this).find("li").css('width',"191px");
					}
						
  });
		
		$(".custom-drapdown").each(function(index, element) {
			 
				$(this).click(function(event){
		    $(".custom-dropdown-list").hide();
				  $(this).next("div").css('visibility','visible');	
				  $(this).next("div").css('display','block');	
						
						var thisList = $(this).next("div");
						var thisListClass = $(this).next("div").attr("class");
						event.stopPropagation();
						
						
						
				})
				
//				var thisList = $(this).next("div");
//				console.log(thisList);
//			$(document).not($(this).next("div")).click(function(){
//      thisList.css('display','none');
//    });
				
		});
	 
		
		
});
$(document).click(function(){
		$(".custom-dropdown-list").hide();
});

$(".custom-dropdown-list").click(function(event){
  //var evt = event.srcElement ? event.srcElement : event.target; 
	 event.stopPropagation();
});
	
