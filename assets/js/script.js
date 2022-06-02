// create a search bar on the main page with potential auto complete like in google maps and a logo to be used as an "enter button" as well
// once an address is typed in, use .replace to swap html pages

// on the other pages, use the google location api to display a whole map and use the ticket master api on the top left

// have a go back button in the top right in order to use the .replace again and go back to the main page.

// Search bar

let APIKey="AIzaSyDqV1XcJM6Vj9R_tQl-863vSYrI4O3QdvI";
let mainURl = "./index.html"
let searchURL = "./search.html"

// On the keyup function (pressing down on enter then releasing it) it replaces the current file with the search html
$("#searchMapInput").keyup(function(event) {
  if (event.keyCode === 13) {
  // 13 is the enter key
    window.location.assign("./search.html")
  //using assign instead of replace because it saves history so you can go back in the browser
  }
});

let button = "backButton";
$(button).click(function(event) {
 window.location.assign("./index.html")
});

// initMap common 
function initMap() {
    let input = document.getElementById("searchMapInput");

    let autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener("place_changed", function () {
      let place = autocomplete.getPlace();

      // document.getElementById("location-snap").innerHTML =
        //place.formatted_address;

      // document.getElementById("lat-span").innerHTML =
        //place.geometry.location.lat();

      // document.getElementById("lon-span").innerHTML =
        //place.geometry.location.lng();
    });
  }
  
//TICKETMASTER
  //to do: add html from https://developer.ticketmaster.com/products-and-docs/tutorials/events-search/search_events_in_location.html

  //to do: convert to switch statement and add case for reading user input instead of geolocation
  function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        var x = document.getElementById("location");
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}

//passes location to discovery api
  //to do: add slider for desired radius
function showPosition(position) {
  var x = document.getElementById("location");
  x.innerHTML = "Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude; 
  var latlon = position.coords.latitude + "," + position.coords.longitude;


  $.ajax({
    type:"GET",
    url:"https://app.ticketmaster.com/discovery/v2/events.json?apikey=pLOeuGq2JL05uEGrZG7DuGWu6sh2OnMz&latlong="+latlon,
    async:true,
    dataType: "json",
    success: function(json) {
                console.log(json);
                var e = document.getElementById("events");
                e.innerHTML = json.page.totalElements + " events found.";
                showEvents(json);
                initMap(position, json);
             },
    error: function(xhr, status, err) {
                console.log(err);
             }
  });

}

//processes api response
function showEvents(json) {
  for(var i=0; i<json.page.size; i++) {
    $("#events").append("<p>"+json._embedded.events[i].name+"</p>");
  }
}


function initMap(position, json) {
  var mapDiv = document.getElementById('map');
  var map = new google.maps.Map(mapDiv, {
    center: {lat: position.coords.latitude, lng: position.coords.longitude},
    zoom: 10
  });
  for(var i=0; i<json.page.size; i++) {
    addMarker(map, json._embedded.events[i]);
  }
}

function addMarker(map, event) {
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(event._embedded.venues[0].location.latitude, event._embedded.venues[0].location.longitude),
    map: map
  });
  marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
  console.log(marker);
}