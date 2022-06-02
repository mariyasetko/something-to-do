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
  