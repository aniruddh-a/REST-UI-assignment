var serverBaseUrl = "http://localhost:3000/operations";

var rowHTML = ' <div class="row" id="objects-row">';
var objectOuterHTML = '<div class="col-lg-3 col-md-6 text-center "> <div class="service-box">'
// ' <i class="fa fa-4x fa-lemon-o wow bounceIn "></i> <h3 >Object </h3> </div> </div>';
var objectHTML = '<i id data-object-colorclass="fa fa-4x fa-lemon-o wow bounceIn myObject">'


var radioForm = '<form class="form-horizontal"> <fieldset>  <div class="form-group"> <label class="col-md-4 control-label" for="data-id"></label> <div class="col-md-5"> <select id="data-id" name="data-id" class="form-control"> <option value="red">Red </option> <option value="blue">Blue</option>  <option value="green">Green</option> </select> </div> </div> </fieldset> </form>';
var allObjects = {};



function getAllObjects(){
  // empty the container, remove previous DOM nodes
  //show preloader

  $('#objects-container').empty();
  $('#preloader').show();
  allObjects = {};
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


  		});
  		console.log('allObjects');
  		console.log(allObjects);

  		var template = '';
  		Object.keys(allObjects).forEach(function(color){

  			template += rowHTML;
  			allObjects[color].forEach(function(object){
  				template += objectOuterHTML;
  				
  				result = objectHTML.replace('id', ' id ="icon_'+ object._id +'"' );
  				result = result.replace('data-object-color', 'data-object-color="' + object.color + '"');
  				result = result.replace('>', ' style="color:'+ object.color + '" >');
  				result += '</i>';
         
          var toReplace = 'data-id';
          var regexp = new RegExp(toReplace, 'g');

          result += radioForm.replace(regexp, object._id);

          result += '</div>  <a class="btn btn-default btn-xl">Update</a> </div>'
          template += result;
  				console.log(object._id);

  			});
  			template += '</div>';
  		});

  		$('#objects-container').append(template);
      //now set default selected for all
      $('#objects-container').find('i').each(function( elem){
        var color = $(this).attr('data-object-color');
        $(this).parent().find('select').val(color);

      } );

      $('#preloader').hide(); 
      //register button click handler after drawing button on UI and in DOM 
  		registerHandler();
	});
}

function registerHandler(){

  $('.btn').click(function(event){
    
    var id = $(event.target.parentElement).find('select').attr('id');
    var newColor = $('#' + id).find( "option:selected" ).prop("value");

    //now call server API to update value of this object

    updateObject(id, newColor);
  });
}

function updateObject(id, color){

  $.ajax({
      type: 'PUT',
      url : serverBaseUrl,
      data : JSON.stringify({ _id : id, color : color}),
      success:function(data){
        //need to refresh all the data
        console.log('update success');
        // alert('Update successful, Please wait while we reload latest information from server');        
        getAllObjects();
      },
      contentType: "application/json",
      dataType: 'json'
    })

}


getAllObjects();


