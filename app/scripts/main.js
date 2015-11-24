
$(function() {

// initilize Material Bootstrap
  $.material.init();

// Global variables

  var googleKey = "AIzaSyCLXvOIsoBU0qY0PaF6bzbL0VkaG9u5aHw";
  var searchForm = $(".search-form");
  var $searchOptions = $(".options");
  var $findChargers = $("#findChargers");
  var $locations = $(".locations");
  var markers_data = [];

// Remove welcome and display search

  $("#get-started").on("click",function(){
    $("#welcome").fadeOut("slow",function(){
      searchForm.fadeIn(800);
    })
  })

// Disable Find Chargers button if no address

  $("#searchAddress").blur(function(){
    if( $(this).val().length === 0 ) {
      $findChargers.prop("disabled",true);
    } else {
      $findChargers.prop("disabled",false);
    }
  });

// Hides search options/filters, moves it to the top left, and renders gMap

  $findChargers.one("click",function(){
    $(".options, legend").hide("normal",function(){
      $(".container").animate({
        marginTop:  0,
        marginLeft: 0,
        maxWidth: "500px",
      },800);
      $(".form-group").css({
        marginBottom: 0,
      });
      $(".settings").css({
        display:  "block",
      });
      $(".flex-page").css({
        display:        "flex",
        flexWrap:       "wrap",
        justifyContent: "space-between",
        height:         "88vh",
      });
    });
    $("#map")
      .delay(800)
      .css({
        display: "inherit",
        //these need math done on them
        height: "500px",
        width: "500px",
      });
    // setTimeout(function(){
    //   initMap();
    // },1000)

  })


// Shows search options

  $(".settings").on("click",function(){
    // console.log($(this).prop("checked"));
    // $(this).prop("checked", !$(this).prop("checked"));
    $searchOptions.slideDown();
  })

// enter on address field also tiggers search

   $("#searchAddress").keypress(function (e) {
    if (e.which == 13) {
      e.preventDefault();
      $findChargers.trigger("click");
    }
   });

// Chargers search calls (first to Geocode address and then query OpenChargeMap for results based on inputs)

  $findChargers.on("click", function(){

    var searchInput = $("#searchAddress").val().replace(/\s+/g, "+")
    // 5600 Greenwood Plaza Blvd, 80111
    var searchDistance = $("#distance").find(":selected").text();
    console.log("Distance: " + searchDistance);
    var searchLevels = $("#charger-level").val().toString();
    console.log("Charger Level: " + searchLevels);

    // remove previous search results from list & markers from map
    $locations
      .empty()
      .css({
        height: "76vh",
      });

    markers_data.splice(0,markers_data.length);

    // hide search options (if they are shown)
    $searchOptions.fadeOut("slow");

    // geocode address
    var $chargerCall =
      $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + searchInput +
          "&key=" + googleKey, function(geoLocation) {
        var searchLocation = geoLocation.results[0].geometry.location;
        console.log(searchLocation);
        // return searchLocation;
      });

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
            "&distanceunit=Miles" +
            "&levelid=" + searchLevels, function(){
        })

          .done(function(chargersResult){
            console.log(chargersResult);
            setTimeout(function(){
              adjustMapCenter(map, latLng);
            },1800);

            // loop through charger location results

            $(chargersResult).map(function(){

              // manipulated OpenCharger API variables
              var chargerDist = Math.round( this.AddressInfo.Distance * 10 ) / 10;

              // populate results in handlebars template
              var source   = $("#charger-location").html();
              var template = Handlebars.compile(source);
              var context = {api: this, Distance: chargerDist};
              var html = template(context);
              $locations.append(html).hide().fadeIn(800);

              var resultLatLng = {
                lat: this.AddressInfo.Latitude,
                lng: this.AddressInfo.Longitude
              }

              // Map Marker (need to redo this with array)
              // setTimeout(function(){
              //   var marker = new google.maps.Marker({
              //     position: resultLatLng,
              //     map: map,
              //     title: "Charger"
              //   });
              // },1800)

              if (lat != undefined && lng != undefined) {
                var icon = 'https://maps.google.com/mapfiles/kml/paddle/grn-circle.png';
                markers_data.push({
                  lat : lat,
                  lng : lng,
                  title : this.AddressInfo.Title,
                  icon : {
                    size : new google.maps.Size(16, 16),
                    url : icon
                  }
                });
              }

              map.addMarkers(markers_data);

            })
          })
          .fail(function(){
            console.log("error");
          })
      });
  })

// center map

  function adjustMapCenter(map, location) {
    mapOptions = {
      center: location,
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map.setOptions(mapOptions);
  }

// On click of star button, add charger location to favorites

  var Favs = [];

  $(document).on("click",".mdi-action-grade",function(){
      // console.log(this);
      $(this).addClass("fav");
      var selectedFav = this.closest(".panel");
      console.log(selectedFav);
      var updatedFavs = Favs.push(selectedFav.innerHTML);
      // console.log(Favs);
      var jsonFavs = JSON.stringify(Favs);
      localStorage.setItem("favs",jsonFavs);
      var currentFavs = localStorage.getItem("favs");
      var returnedFavs = JSON.parse(currentFavs);
  })

// View list of Favs in dropdown

  $("#favs-link").on("click",function(){
    $(".favs-dropdown").empty();
    var currentFavs = localStorage.getItem("favs");
    var returnedFavs = JSON.parse(currentFavs);
    $(".favs-dropdown").append(returnedFavs);
  })

// Clear out favorites

  $("#clear-favs").on("click",function(){
    localStorage.clear("favs");
    Favs.splice(0,Favs.length);
  })


})
