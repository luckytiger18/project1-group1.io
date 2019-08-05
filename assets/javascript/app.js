//  TODO: Check if place is "playground"

// map api

// var safty = https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=EXZo2ybfi9amYpepIOggcUyzblMHeIpfh1QhMc80&location="  

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
            $("#places").append("Places: " + geocoords + "<br>");
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
        $("#temperature").append("Temperature: " + response.main.temp)
    })
}

$("#submitButton").on("click", function () {
    event.preventDefault();
    var address = $("#searchLocation").val();
    address = address.replace(/ /g, '%20');
    queryMapApi(address);
    queryWeatherApi(address);
})
