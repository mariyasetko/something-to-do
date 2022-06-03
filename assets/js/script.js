// create a search bar on the main page with potential auto complete like in google maps and a logo to be used as an "enter button" as well
// once an address is typed in, use .replace to swap html pages

// on the other pages, use the google location api to display a whole map and use the ticket master api on the top left

// have a go back button in the top right in order to use the .replace again and go back to the main page.

// Search bar

let APIKey = "AIzaSyDqV1XcJM6Vj9R_tQl-863vSYrI4O3QdvI";
let mainURl = "./index.html";
let searchURL = "./search.html";

// On the keyup function (pressing down on enter then releasing it) it replaces the current file with the search html
//$("#searchMapInput").keyup(function (event) {
//  if (event.keyCode === 13) {
//    // 13 is the enter key
//    window.location.assign("./search.html");
//    //using assign instead of replace because it saves history so you can go back in the browser
//    
//  }
//});

/*
$("#searchMapInput").keyup(function(event) {
  if (event.keyCode === 13){
    
  let location = encodeURIComponent($("#searchMapInput").val());
  
  let googleGeocodeUrl = " https://maps.googleapis.com/maps/api/geocode/json?new_forward_geocoder=true&address=" + location + "&key=AIzaSyDqV1XcJM6Vj9R_tQl-863vSYrI4O3QdvI";
  
  $.ajax({
    url: googleGeocodeUrl,
    type: 'GET',
    dataType: 'json', // added data type
    success: function(result) {
            let geo = result.results[0].geometry.location;
        let lat = geo.lat;
        let lng = geo.lng;

        alert(geo);
    }
});
    
    //Save to storage
    
    //window.location.assign("./search.html");
  }});
*/
let button = "myButton";
$(button).click(function (event) {
  window.location.assign("./index.html");
});

// initMap common
function initMap() {
  let input = document.getElementById("searchMapInput");

  let autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.addListener("place_changed", function () {
    let place = autocomplete.getPlace();

    /*
    document.getElementById("location-snap").innerHTML =
    place.formatted_address;

    document.getElementById("lat-span").innerHTML =
    place.geometry.location.lat();

    document.getElementById("lon-span").innerHTML =
    place.geometry.location.lng(); */
	localStorage.setItem("lat", place.geometry.location.lat());
	localStorage.setItem("lng", place.geometry.location.lng());
    window.location.assign("./search.html")
  }); 
}

//TICKETMASTER
//to do: add html from https://developer.ticketmaster.com/products-and-docs/tutorials/events-search/search_events_in_location.html

let consKey = "tfKaqOyAuAgQ6Xx2fWTdV8BQsbZ7jw7r";

//to do: convert to switch statement and add case for reading user input instead of geolocation
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    let x = document.getElementById("location");
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      x.innerHTML = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      x.innerHTML = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      x.innerHTML = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      x.innerHTML = "An unknown error occurred.";
      break;
  }
}

//passes location to discovery api
//to do: add slider for desired radius
function showPosition(position) {
  let x = document.getElementById("location");
  x.innerHTML =
    "Latitude: " +
    position.coords.latitude +
    "<br>Longitude: " +
    position.coords.longitude;
  let latlon = position.coords.latitude + "," + position.coords.longitude;

  $.ajax({
    type: "GET",
    url:
      "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" +
      consKey +
      "&latlong=" +
      latlon,
    async: true,
    dataType: "json",
    success: function (json) {
      console.log(json);
      var e = document.getElementById("events");
      e.innerHTML = json.page.totalElements + " events found.";
      showEvents(json);
      initMap(position, json);
    },
    error: function (xhr, status, err) {
      console.log(err);
    },
  });
}

//processes api response
function showEvents(json) {
  for (let i = 0; i < json.page.size; i++) {
    $("#events").append("<p>" + json._embedded.events[i].name + "</p>");
  }
}

/*function initMap(position, json) {
  let mapDiv = document.getElementById('map');
  let map = new google.maps.Map(mapDiv, {
    center: {lat: position.coords.latitude, lng: position.coords.longitude},
    zoom: 10
  });
  for(let i=0; i<json.page.size; i++) {
    addMarker(map, json._embedded.events[i]);
  }
}
*/

function addMarker(map, event) {
  let marker = new google.maps.Marker({
    position: new google.maps.LatLng(
      event._embedded.venues[0].location.latitude,
      event._embedded.venues[0].location.longitude
    ),
    map: map,
  });
  marker.setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");
  console.log(marker);
}

// Adds the map to the 2nd page
function searchMap() {

  let mapOptions = {
    center: new google.maps.LatLng(localStorage.getItem("lat"), localStorage.getItem("lng")),
    zoom: 12
  }

  let map = new google.maps.Map(document.getElementById("map"), mapOptions)

}


