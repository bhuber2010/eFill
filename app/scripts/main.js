
$(function() {

// initilize Material Bootstrap
  $.material.init();

// Global variables

  var googleKey = "AIzaSyCLXvOIsoBU0qY0PaF6bzbL0VkaG9u5aHw";
  var searchForm = $(".search-form");
  var $searchOptions = $(".options");
  var $findChargers = $("#findChargers")

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

  // $findChargers.one("click",function(){
  //   $(".options, legend").hide("normal",function(){
  //     $(".container").animate({
  //       marginTop:  0,
  //       marginLeft: 0,
  //       maxWidth: "500px",
  //     },800);
  //     $(".form-group").css({
  //       marginBottom: 0,
  //     });
  //     $(".settings").css({
  //       display:  "block",
  //     });
  //     $(".flex-page").css({
  //       display:        "flex",
  //       flexWrap:       "wrap",
  //       justifyContent: "space-between",
  //       height:         "88vh",
  //     });
  //   });
  //   $("#map")
  //     .delay(1000)
  //     .css({
  //       display: "inherit",
  //     });
  //   setTimeout(function(){
  //     initMap();
  //   },2000)
  //
  // })


// Shows search options

  $(".settings").on("click",function(){
    // console.log($(this).prop("checked"));
    // $(this).prop("checked", !$(this).prop("checked"));
    $searchOptions.slideDown();
  })

// enter on address field also triggers search

   $("#searchAddress").keypress(function (e) {
    if (e.which == 13) {
      e.preventDefault();
      $findChargers.trigger("click");
    }
   });

   // Chargers search calls (first to Geocode address and then query OpenChargeMap for results based on inputs)

   function searchInput() {
     return $("#searchAddress").val().replace(/\s+/g, "+");
   }

   function searchDistance() {
     return $("#distance").find(":selected").text();
   };

   function searchLevels() {
     return $("#charger-level").val().toString();
   };

  // function geoCall() {
  //   var addressGeocode =
  //     $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?" +
  //     "address=" + addressSearch +
  //     "&key=" + googleKey);
  //     return addressGeocode
  // }
  //
  // geoCall()

  var gAddrees;

  $findChargers.on("click", function(){
    var addressSearch = searchInput();
    var addressGeocode =
      $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?" +
      "address=" + addressSearch +
      "&key=" + googleKey);
    var geoAddress;

    addressGeocode.done(function(data) {
      geoAddress = data.results[0].geometry.location;
    });

    gAddrees = geoAddress;

    searchDistance();
    searchLevels();

    console.log("Distance: " + searchDistance())
    console.log("Charger Level: " + searchLevels())

    $searchOptions.fadeOut("slow");
    console.log(gAddress);
    chargerSearch();

  })



  //Take Geocoded address and send to Openchargemap.org api

  var chargerSearch = function(){
    var lat = geoAddress;
    var lng = geoAddress.lng
    $.getJSON("http://api.openchargemap.io/v2/poi/?output=json" +
    "&countrycode=US" +
    "&maxresults=" + 100 +
    "&latitude=" + lat +
    "&longitude=" + lng +
    "&distance=" + searchDistance +
    "&distanceunit=Miles" +
    "&levelid=" + searchLevels)
    .done(function(cData){
      console.log(cData);
    })
  };

  // chargerSearch.done(function(){
  //   var $locations = $(".locations");
  //   $locations
  //     .empty()
  //     .css({
  //       height: "76vh",
  //     });
  //   setTimeout(function(){
  //     adjustMapCenter(map, latLng);
  //   },1800);
  // })


            // loop through charger location results

            $(chargersResult).map(function(){

              // populate results in handlebars template
              var source   = $("#charger-location").html();
              var template = Handlebars.compile(source);
              var html = template(this);
              $locations.append(html).hide().fadeIn(800);

              var resultLatLng = {
                lat: this.AddressInfo.Latitude,
                lng: this.AddressInfo.Longitude
              }

              // Map Marker (need to redo this with array)
              setTimeout(function(){
                var marker = new google.maps.Marker({
                  position: resultLatLng,
                  map: map,
                  title: "Charger"
                });
              },1800)
            })

          .fail(function(){
            console.log("error");
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
