//  TODO: Check if place is "playground" based on catergory

// var safty = https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=EXZo2ybfi9amYpepIOggcUyzblMHeIpfh1QhMc80&location="  

// tracking location

function queryMapApi(address) {
  
    var map = "https://api.mapbox.com/geocoding/v5/mapbox.places/playgrounds " + address + ".json?access_token=pk.eyJ1IjoiYWtrdXJuaWNraSIsImEiOiJjanl2dGlhZ2gwZXdpM21yb2pzeTN0MXU1In0.fw1d3cJU5L4lFhDYAzy3fQ"
    $.ajax({
        url: map,
        method: "GET"
    }).then(function (response) {
        // console.log(response)
        // Iterate over the response feature
        
        for (var i = 0; i < response.features.length; i++) {
            var geocoords = response.features[i].place_name;
            $("#places").append(geocoords + "<br>");
            console.log(geocoords)
            
        }
    })
}
// Weather API
function queryWeatherApi(address) {
    var weather = "https://api.openweathermap.org/data/2.5/weather?q=" + address + "&appid=6c256c8dc9b56a412a1c42874dad6022";
    $.ajax({
        url: weather,
        method: "GET"
    }).then(function (response) {
        var temp = response.main.temp;
        var tempNew = 1.8 * (temp - 273) + 32;
        $("#temperature").append("Temperature: " + tempNew)
    })
}

$("#submitButton").on("click", function () {
    event.preventDefault();
    var address = $("#searchLocation").val();
    address = address.replace(/ /g, '%20');
    queryMapApi(address);
    queryWeatherApi(address);
})
mapboxgl.accessToken = 'pk.eyJ1IjoiYWtrdXJuaWNraSIsImEiOiJjanl2dGlhZ2gwZXdpM21yb2pzeTN0MXU1In0.fw1d3cJU5L4lFhDYAzy3fQ';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-96, 37.8], // starting position
    zoom: 3 // starting zoom
});
// Add geolocate control to the map.
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));
