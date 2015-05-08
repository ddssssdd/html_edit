// JavaScript Document

$(document).ready(function(e) {
	
	
/*var columnOneHeaderWidth = $("#tableOne .tableHeader").outerWidth();
var columnOneBodyWidth = $("#tableOne .tableBody").outerWidth();

if (columnOneHeaderWidth>columnOneBodyWidth){
	$("#tableOne .tableBody").css("width",columnOneHeaderWidth);
	}else{
	$("#tableOne .tableHeader").css("width",columnOneBodyWidth);
	}*/

$('.superTable').each(function(){

var columnTwoUlNum = $(".layout2 .tableHeader ul li").length;
var wrapWidth = 0;	
	
		for(var i=0;i<columnTwoUlNum;i++)
		{
			var titleWidth1 = $(this).find(".layout2 .tableHeader ul li").eq(i).outerWidth()
			var bodyWidth1 = $(this).find(".layout2 .tableBody ul").eq(i).outerWidth()
						
			if(titleWidth1>bodyWidth1){
				$(this).find(".layout2 .tableBody ul").eq(i).css("width",titleWidth1)
				wrapWidth=wrapWidth+titleWidth1;
				
				}else{
				$(this).find(".layout2 .tableHeader ul li").eq(i).css("width",bodyWidth1)
				wrapWidth=wrapWidth+bodyWidth1;
 			}
			}

$(this).find(".wrap").css("width",wrapWidth);
console.log(wrapWidth);

			
			

var columnThreeUlNum = $(this).find(".layout3 .tableHeader ul li").length;
		
		for(var i=0;i<columnThreeUlNum;i++)
		{
			var titleWidth2 = $(this).find(".layout3 .tableHeader ul li").eq(i).outerWidth()
			var bodyWidth2 =  $(this).find(".layout3 .tableBody ul").eq(i).outerWidth()
						
			if(titleWidth2>bodyWidth2){
				$(this).find(".layout3 .tableBody ul").eq(i).css("width",titleWidth2)
				}else{
				$(this).find(".layout .tableHeader ul li").eq(i).css("width",bodyWidth2)
 			}
			}



});


})