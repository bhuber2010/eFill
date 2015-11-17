$(function() {
  // Remove welcome and display everything else(this part needs to be added)
  $("#get-started").on("click",function(){
    $("#welcome").fadeOut("slow",function(){
      $(".search-form").fadeIn("3000");
    })
  })

  $("#findChargers").on("click", function(){

    var searchInput = $("#searchAddress").val().replace(/\s+/g, "+")
    // 5600 Greenwood Plaza Blvd, 80111
    var searchDistance = $("#distance").find(":selected").text();
    var searchLevels = $("#charger-level").val().toString();
    console.log(searchLevels);
    var googleKey = "AIzaSyCLXvOIsoBU0qY0PaF6bzbL0VkaG9u5aHw";

    var $chargerCall =
      $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + searchInput + "&key=" + googleKey, function(geoLocation) {
        console.log(geoLocation);
        var latLng = geoLocation.results[0].geometry.location;
        console.log(latLng.lat, latLng.lng);
        // return latLng;
      })

        .done(function(){
        })

        .fail(function(){
          console.log("error");
        })

      //Take Geocoded address and send to Openchargemap.org api
      $chargerCall.always(function() {
        var latLng = $chargerCall.responseJSON.results[0].geometry.location,
            lat = latLng.lat,
            lng = latLng.lng;

        $.get("http://api.openchargemap.io/v2/poi/?output=json&countrycode=US&maxresults=" + 100 + "&latitude=" + lat + "&longitude=" + lng + "&distance=" + searchDistance + "&distanceunit=Miles&levelid=" + searchLevels, function(chargersResult){
          console.log(chargersResult);
          var $locations = $(".locations");
          $locations.empty();
          $(chargersResult).map(function(){
            var source   = $("#charger-location").html();
            var template = Handlebars.compile(source);
            var html = template(this);
            return $locations.append(html);

            console.log(this.AddressInfo.Title);
            console.log(this.AddressInfo.AddressLine1);
            console.log("Level " + this.Connections[0].LevelID);
            console.log("Quantity " + this.Connections[0].Quantity);
          })

        })
          .fail(function(){
            console.log("error");
          })
      });

  })

})
