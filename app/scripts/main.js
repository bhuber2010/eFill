

$(function() {

  var googleKey = "AIzaSyCLXvOIsoBU0qY0PaF6bzbL0VkaG9u5aHw";
  var searchForm = $(".search-form");
  var $searchOptions = $(".options");

// Remove welcome and display everything else(this part needs to be added)

  $("#get-started").on("click",function(){
    $("#welcome").fadeOut("slow",function(){
      searchForm.fadeIn(800);
    })
  })

// Hides search options/filters, moves it to the top left

  $("#findChargers").one("click",function(){
    $(".options, legend").hide("normal",function(){
      $(".container").animate({
        marginTop:  0,
        marginLeft: 0,
        maxWidth: "500px",
      },800)
      .css({
        display:  "inline-block",
      });
      $(".form-group").css({
        marginBottom: 0,
      });
    });
    $("#map")
      .delay(5000)
      .css({
        display: "inline-block",
      })
  })

// Toggles search settings displaying or not

  $(".togglebutton").on("click",function(){
    $searchOptions.prop("checked", !$searchOptions.prop("checked"));
  })

// Chargers search calls (first to Geocode address and then query OpenChargeMap for results based on inputs)

  $("#findChargers").on("click", function(){

    var searchInput = $("#searchAddress").val().replace(/\s+/g, "+")
    // 5600 Greenwood Plaza Blvd, 80111
    var searchDistance = $("#distance").find(":selected").text();
    console.log("Distance: " + searchDistance);
    var searchLevels = $("#charger-level").val().toString();
    console.log("Charger Level: " + searchLevels);

    $searchOptions.fadeOut("slow");

    var $chargerCall =
      $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + searchInput +
          "&key=" + googleKey, function(geoLocation) {
        console.log(geoLocation);
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
            console.log(lat, lng);

        $.get("http://api.openchargemap.io/v2/poi/?output=json" +
            "&countrycode=US" +
            "&maxresults=" + 100 +
            "&latitude=" + lat +
            "&longitude=" + lng +
            "&distance=" + searchDistance +
            "&distanceunit=Miles&levelid=" + searchLevels, function(){
        })

          .done(function(chargersResult){
            console.log(chargersResult);
            var $locations = $(".locations");
            $locations
              .empty()
              .css({
                height: "76vh",
              });
            $(chargersResult).map(function(){
              var source   = $("#charger-location").html();
              var template = Handlebars.compile(source);
              var html = template(this);
              return $locations.append(html).hide().fadeIn(800);

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
