// JavaScript Document
$(document).ready(function(e) {
    
  $("input[type=radio]").css("display","none");
    
});


function sortOptionRadio(id){
	  
  for(i=0;i<=20;i++){
	  
	  if(i==id){
		  
		$("#sortOption"+i).removeClass()
		$("#sortOption"+i).addClass("radioSelect")
		
		}else{
		$("#sortOption"+i).removeClass()
		$("#sortOption"+i).addClass("radioNoselect")			
		}
		  
	  }

}