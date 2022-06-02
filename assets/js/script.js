// create a search bar on the main page with potential auto complete like in google maps and a logo to be used as an "enter button" as well
// once an address is typed in, use .replace to swap html pages

// on the other pages, use the google location api to display a whole map and use the ticket master api on the top left

// have a go back button in the top right in order to use the .replace again and go back to the main page.

// Search bar


function initMap() {
    var input = document.getElementById("searchMapInput");

    var autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener("place_changed", function () {
      var place = autocomplete.getPlace();

      document.getElementById("location-snap").innerHTML =
        place.formatted_address;

      document.getElementById("lat-span").innerHTML =
        place.geometry.location.lat();

      document.getElementById("lon-span").innerHTML =
        place.geometry.location.lng();
    });
  }
  