// JavaScript Document

$(document).ready(function(e) {
 

	
			$('.class-name').each(function(index, element) {
	
			var docObject = $('.student-list');	
			var divLockTop = $(this).offset().top
			var thisDiv = $(this)
			
				docObject.scroll(function(){
					
					
		  	var thisDivWidth = $(this).innerWidth();
					
					if((docObject.scrollTop()+269)>=divLockTop){
						$(thisDiv).addClass("lock");
						$(thisDiv).next("li").css('margin-top',30);
						$(thisDiv).css('width',thisDivWidth);
					}else{
						$(thisDiv).removeClass("lock");
						$(thisDiv).next("li").css('margin-top',0);
					}
							
				});
	
			});
			
			
	
});