var serverBaseUrl = "http://localhost:3000/operations";

var rowHTML = ' <div class="row" id="objects-row">';
var objectOuterHTML = '<div class="col-lg-3 col-md-6 text-center "> <div class="service-box">'
// ' <i class="fa fa-4x fa-lemon-o wow bounceIn "></i> <h3 >Object </h3> </div> </div>';
var objectHTML = '<i id data-object-colorclass="fa fa-4x fa-lemon-o wow bounceIn myObject">'

var allObjects = {};



function getAllObjects(){
	$.get( serverBaseUrl, function( data ) {  	
  	// alert( "Load was performed." );
  		console.log("retrieved all objects");
  		console.log(data);



  		data.forEach(function(elem){

	  		//group depending upon color
			var color = elem.color;
			if(allObjects[color]){
				allObjects[color].push(elem);
			}else{
				allObjects[color] = [];
				allObjects[color].push(elem);
			}


  			// $('#objects-row').append(objectHTML);
  		});
  		console.log('allObjects');
  		console.log(allObjects);

  		var template = '';
  		Object.keys(allObjects).forEach(function(color){
  			template += rowHTML;
  			allObjects[color].forEach(function(object){
  				template += objectOuterHTML;
  				
  				result = objectHTML.replace('id', ' id ="'+ object._id +'"' );
  				result = result.replace('data-object-color', 'data-object-color="' + object.color + '"');
  				result = result.replace('>', ' style="color:'+ object.color + '" >');
  				result += '</i>';
  				result += '</div> </div>';
  				template += result;
  				console.log(object._id);

  			});
  			template += '</div>';
  		});

  		$('#objects-container').append(template);
  		registerHandler();
	});
}


function registerHandler(){
	$('.myObject').click(function(event){

		alert('clicked ' + event.target.id);
	});
}

getAllObjects();


