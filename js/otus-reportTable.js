// JavaScript Document
	
$(document).ready(function(e) {
	
	$(".table-two-header").each(function(index, element) {
		var tableTdNum = $(this).find("td").size();
		var tableTwoWidth = 0;
		if(tableTdNum%2 == 0){
			var tableWidth = (tableTdNum/2)*160+(tableTdNum/2)*90;
			$(this).find("table").css('width',tableWidth)
			$(this).next("div").find("table").css('width',tableWidth)
		}else{
			var tableWidth = ((tableTdNum+1)/2)*160+((tableTdNum-1)/2)*90;
			$(this).find("table").css('width',tableWidth)
			$(this).next("div").find("table").css('width',tableWidth)
		}
 });
	


 
	
	
 $('.table-two-body').scroll(function (e)  {
		var headerPosition = $(this).scrollLeft();
		var bodyPosition = $(this).prev("div").scrollLeft();
		if(headerPosition != bodyPosition ){
    $(this).prev("div").scrollLeft(headerPosition);
		}
	})
	
	
	
	$('.table-three-body').scroll(function (e)  {
		var threeTablePosition = $(this).scrollTop();
		var oneTablePosition = $(this).parents(".super-table").find(".table-one-body").scrollTop()
		var twoTablePosition = $(this).parents(".super-table").find(".table-two-body").scrollTop()
		if(threeTablePosition != twoTablePosition || threeTablePosition != oneTablePosition ){
   $(this).parents(".super-table").find(".table-one-body").scrollTop(threeTablePosition);
			$(this).parents(".super-table").find(".table-two-body").scrollTop(threeTablePosition);
		}
	})

	
})

