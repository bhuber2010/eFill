$(function() {
  // Remove welcome and display everything else(this part needs to be added)
  $("#get-started").on("click",function(){
    $("#welcome").css("display","none")
  })

  var searchInput = "5600+Greenwood+Plaza+Boulevard,+Greenwood+Village,+CO";
  var searchDistance = 10;
  var googleKey = "AIzaSyCLXvOIsoBU0qY0PaF6bzbL0VkaG9u5aHw"

  var chargerCall =
    $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + searchInput + "&key=" + googleKey, function(geoLocation) {
      console.log(geoLocation);
      var latLng = geoLocation.results[0].geometry.location;
      console.log(latLng.lat, latLng.lng);
    })
      .done(function(){
        console.log("second success");
      })
      .fail(function(){
        console.log("error");
      })
      .always(function() {
        console.log("finished");
      });

    //Take Geocoded address and send to Openchargemap.org api
    chargerCall.always(function() {
      $.get("chargerURL", function(){


      })
    });


})
