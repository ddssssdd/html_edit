// JavaScript Document
$(document).ready(function(e) {
    
  $("input[type=checkbox]").css("display","none");
    
});

function checkBOX(id){
	  
  for(i=0;i<=id;i++){
	  
	  if(i==id){
		  var checkboxClass=$("#checkBox"+i).attr('class')

		  if(checkboxClass=='CBnoselect'){
			  $("#checkBox"+i).removeClass()
			  $("#checkBox"+i).addClass("CBselect")

			  }else{
			  
			  $("#checkBox"+i).removeClass()
			  $("#checkBox"+i).addClass("CBnoselect")
			  }

		  }
		  
	  }

}

function checkBOX2(id){
	  
  for(j=0;j<=id;j++){
	  
	  if(j==id){
		  var checkboxClass=$("#checkBox2"+j).attr('class')

		  if(checkboxClass=='CBnoselect'){
			  $("#checkBox2"+j).removeClass()
			  $("#checkBox2"+j).addClass("CBselect")

			  }else{
			  
			  $("#checkBox2"+j).removeClass()
			  $("#checkBox2"+j).addClass("CBnoselect")
			  }

		  }
		  
	  }
	  

}



function checkBOX3(id){
	  
  for(k=0;k<=id;k++){
	  
	  if(k==id){
		  var checkboxClass=$("#checkBox3"+k).attr('class')

		  if(checkboxClass=='CBnoselect'){
			  $("#checkBox3"+k).removeClass()
			  $("#checkBox3"+k).addClass("CBselect")

			  }else{
			  
			  $("#checkBox3"+k).removeClass()
			  $("#checkBox3"+k).addClass("CBnoselect")
			  }

		  }
		  
	  }
}


function checkBOX4(id){
	  
  for(l=0;l<=id;l++){
	  
	  if(l==id){
		  var checkboxClass=$("#checkBox4"+l).attr('class')

		  if(checkboxClass=='CBnoselect'){
			  $("#checkBox4"+l).removeClass()
			  $("#checkBox4"+l).addClass("CBselect")

			  }else{
			  
			  $("#checkBox4"+l).removeClass()
			  $("#checkBox4"+l).addClass("CBnoselect")
			  }

		  }
		  
	  }
}


function checkBOX5(id){
	  
  for(m=0;m<=id;m++){
	  
	  if(m==id){
		  var checkboxClass=$("#checkBox5"+m).attr('class')

		  if(checkboxClass=='CBnoselect'){
			  $("#checkBox5"+m).removeClass()
			  $("#checkBox5"+m).addClass("CBselect")

			  }else{
			  
			  $("#checkBox5"+m).removeClass()
			  $("#checkBox5"+m).addClass("CBnoselect")
			  }

		  }
		  
	  }
}











