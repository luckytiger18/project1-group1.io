//  TODO: create a reset function to clear out the list of playgrounds if the user input a new zipcode (line 94)

// var safety = https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=EXZo2ybfi9amYpepIOggcUyzblMHeIpfh1QhMc80&location="  

// tracking location

// tracking location

function queryMapApi(address) {

    var map = "https://api.mapbox.com/geocoding/v5/mapbox.places/playgrounds " + address + ".json?access_token=pk.eyJ1IjoiYWtrdXJuaWNraSIsImEiOiJjanl2dGlhZ2gwZXdpM21yb2pzeTN0MXU1In0.fw1d3cJU5L4lFhDYAzy3fQ"
    $.ajax({
        url: map,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        // Iterate over the response feature

        for (var i = 0; i < response.features.length; i++) {
            // var geocoords = response.features[i].place_name;
            var geocoords = response.features[i].context[i].text;
            var playgrounds = response.features[i].place_name;
            var category = response.features[i].properties.category;
            if (category == "playground, leisure") {

                // var button = $("<button>").attr("id", "jhfhgfgh").attr("gfhg","hgfhgfgh")
                var button = $("<button>").attr({
                    "data-lat": response.features[i].center[1],
                    "data-lon": response.features[i].center[0]
                })
                button.text(playgrounds)
                button.addClass("location")


                $("#places").append(button);
            }
            // console.log(geocoords)

        }
    })
}

$(document).on("click", ".location", function () {
    var lat = $(this).attr("data-lat");
    var lon = $(this).attr("data-lon");
    map.setCenter({ lat: lat, lon: lon }); //  map.setCenter({lat, lon}) (shortcuts: if it is the same name, you do not need to repeat it.)

    map.addLayer({
        "id": $(this).text(),
        "type": "symbol",
        "source": {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [lon, lat]
                    },
                    "properties": {
                        "title": "Park",
                        "icon": "park"
                    }
                }]
            }
        },
        "layout": {
            "icon-image": "{icon}-15",
            "text-field": "{title}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
        }
    });
})


// Weather API
function queryWeatherApi(address) {
    var weather = "https://api.openweathermap.org/data/2.5/weather?q=" + address + "&appid=6c256c8dc9b56a412a1c42874dad6022";
    $.ajax({
        url: weather,
        method: "GET"
    }).then(function (response) {
        var temp = response.main.temp;
        var tempNew = parseInt(1.8 * (temp - 273) + 32);
        var wind = response.wind.speed;
        var description = response.weather[0].main;
        $("#weather").append("Temperature: " + tempNew + "</br>" + "Wind: " + wind + "MPH" + "</br>" + "Description: " + description)
        // console.log(response);
    })
}

function reset() {

    $("#places").empty();
    $("#weather").empty();
}
// execution 
$("#submitButton").on("click", function () {
    event.preventDefault();
    var address = $("#searchLocation").val();
    address = address.replace(/ /g, '%20');
    queryMapApi(address);
    queryWeatherApi(address);
    reset();
})
navigator.geolocation.getCurrentPosition(function (position) {
    // console.log(position.coords.latitude, position.coords.longitude);
    map.setCenter({ lat: position.coords.latitude, lon: position.coords.longitude })
});

mapboxgl.accessToken = 'pk.eyJ1IjoiYWtrdXJuaWNraSIsImEiOiJjanl2dGlhZ2gwZXdpM21yb2pzeTN0MXU1In0.fw1d3cJU5L4lFhDYAzy3fQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-79.4512, 43.6568],
    zoom: 14
});
