let APIKey = "AIzaSyDqV1XcJM6Vj9R_tQl-863vSYrI4O3QdvI";
let mainURL = "./index.html";
let searchURL = "./search.html";

//GOOGLE PLACES
let button = "btn btn-secondary";
$(button).click(function (event) {
  window.location.assign(mainURL);
});

// initMap common
function initMap() {
  let input = document.getElementById("searchMapInput");

  let autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.addListener("place_changed", function () {
    let place = autocomplete.getPlace();
	  localStorage.setItem("lat", place.geometry.location.lat());
	  localStorage.setItem("lng", place.geometry.location.lng());

    for(let i=0; i<place.address_components.length; i++) {

      let addrComponent = '';
      let addrComponentValue = '';

      let types = place.address_components[i].types;

      if(types.includes("country")) {
        addrComponent = 'country';
        addrComponentValue = place.address_components[i].short_name;
      } else if(types.includes("administrative_area_level_1")) {
        addrComponent = 'administrative_area_level_1';
        addrComponentValue = place.address_components[i].short_name;
      } else if(types.includes("locality")) {
        addrComponent = 'locality';
        addrComponentValue = place.address_components[i].short_name;
      }

      switch(addrComponent) {
        case 'country': 
          localStorage.setItem("countryCode", addrComponentValue);
          break;
        case 'administrative_area_level_1': // province
          localStorage.setItem("stateCode", addrComponentValue);
          break;
        case 'locality': // city
          localStorage.setItem("city", addrComponentValue);
          break;
        }

    }


    window.location.assign("./search.html");
  }); 
}

//TICKETMASTER
let consKey = "tfKaqOyAuAgQ6Xx2fWTdV8BQsbZ7jw7r";

//passes location to discovery api
function showPosition(map) {
  let city = localStorage.getItem("city");
  let stateCode = localStorage.getItem("stateCode");
  let countryCode = localStorage.getItem("countryCode");
  let endDateTime = moment().format("YYYY-MM-DD") + "T00:00:00Z";


  let url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${consKey}&city=${city}&countryCode=${countryCode}&stateCode=${stateCode}&endDateTime=${endDateTime}`;

  $.ajax({
    type: "GET",
    url: url,
    async: true,
    dataType: "json",
    success: function (json) {
      console.log(json);
      let e = document.getElementById("events");
      e.innerHTML = json.page.totalElements + " events found.";
      showEvents(map,json);
    },
    error: function (xhr, status, err) {
      console.log(err);
    },
  });
}

//processes api response
function showEvents(map,json) {
  for (let i = 0; i < json._embedded.events.length; i++) {
    addMarker(map, json._embedded.events[i]);

    $("#events").append("<p>" + json._embedded.events[i].name + "</p>");


  }
}


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

// Adds the map to search.html
function searchMap() {

  let mapOptions = {
    center: new google.maps.LatLng(localStorage.getItem("lat"), localStorage.getItem("lng")),
    zoom: 12
  }

  let map = new google.maps.Map(document.getElementById("map"), mapOptions);
  showPosition(map);

}


