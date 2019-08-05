 // map api
 $("#submitButton").on("click", function () {
    event.preventDefault();
    var address = $("#searchLocation").val();
    address = address.replace(/ /g, '%20');
    var map = "https://api.mapbox.com/geocoding/v5/mapbox.places/playgrounds " + address + ".json?access_token=pk.eyJ1IjoiYWtrdXJuaWNraSIsImEiOiJjanl2dGlhZ2gwZXdpM21yb2pzeTN0MXU1In0.fw1d3cJU5L4lFhDYAzy3fQ"
    // var safty = https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=EXZo2ybfi9amYpepIOggcUyzblMHeIpfh1QhMc80&location="  

    $.ajax({
        url: map,
        method: "GET"
    }).then(function (response) {
       
console.log(response)
        // Iterate over the response feature
        console.log(response.features.length)
        for (var i = 0; i < response.features.length; i++) {
            // Check if place is "playground"
            
            var geocoords = response.features[i].place_name;
            $("p").append(geocoords + "<br>");
        }

    })
})

