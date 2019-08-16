// firebase api 
var firebaseConfig = {
    apiKey: "AIzaSyC3_ITSAINLA2_33Y4PF6Yv4BejAt_N6BQ",
    authDomain: "project1group1-71a9c.firebaseapp.com",
    databaseURL: "https://project1group1-71a9c.firebaseio.com",
    projectId: "project1group1-71a9c",
    storageBucket: "",
    messagingSenderId: "490262466856",
    appId: "1:490262466856:web:cc6c10ed045f0f72"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// mapbox api for bbox (boundary box)
function getGeoCode(address) {
    var map = "https://api.mapbox.com/geocoding/v5/mapbox.places/ " + address + ".json?country=us&access_token=pk.eyJ1IjoiYWtrdXJuaWNraSIsImEiOiJjanl2dGlhZ2gwZXdpM21yb2pzeTN0MXU1In0.fw1d3cJU5L4lFhDYAzy3fQ"
    $.ajax({
        url: map,
        method: "GET"
    }).then(function (response) {
        var bbox = response.features[0].bbox;
        bbox[2]= bbox[0] + 0.05296465868;
        bbox[3] = bbox[1] +0.08435483832;
        queryMapApi(address, bbox)
        console.log(bbox)
    })
}
// mapbox api 
function queryMapApi(address, bbox) {

    var map = `https://api.mapbox.com/geocoding/v5/mapbox.places/playgrounds ${address}.json?country=us&bbox=${bbox}limit=10&access_token=pk.eyJ1IjoiYWtrdXJuaWNraSIsImEiOiJjanl2dGlhZ2gwZXdpM21yb2pzeTN0MXU1In0.fw1d3cJU5L4lFhDYAzy3fQ`
    $.ajax({
        url: map,
        method: "GET"
    }).then(function (response) {
        var a = [];

        var playgroundsArray = [];
        for (var i = 0; i < response.features.length; i++) {
            var temp = response.features[i].place_name;
            a = temp.split(",");

            if (a.indexOf(" United States") != -1) {
                var playgrounds = response.features[i].place_name;
                var category = response.features[i].properties.category;

                if (category == "playground, leisure") {
                    playgroundsArray.push(playgrounds)
                    var button = $("<button>").attr({
                        "data-lat": response.features[i].center[1],
                        "data-lon": response.features[i].center[0],
                    })
                    button.text(playgrounds)
                    button.addClass("location waves-effect waves-light btn")

                    $("#places").append(button);
                }
            }
        }
        database.ref().set({
            zipcode: address,
            playgrounds: playgroundsArray

        });
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

        $("#weather").append("Temperature: " + tempNew + '&#8457' + "</br>" + "Wind: " + wind + "MPH" + "</br>" + "Description: " + description)
    })
}
function reset() {
    $("#places").empty();
    $("#weather").empty();
}
// button execution 
$("#submitButton").on("click", function () {
    event.preventDefault();
    var address = $("#searchLocation").val();
    address = address.replace(/ /g, '%20');
    getGeoCode(address);
    queryWeatherApi(address);
    reset();

    $("#weather").addClass("container card")

})
navigator.geolocation.getCurrentPosition(function (position) {
    // console.log(position.coords.latitude, position.coords.longitude);
    map.setCenter({ lat: position.coords.latitude, lon: position.coords.longitude })

    var size = 100;
    var pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        onAdd: function () {
            var canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d');
        },

        render: function () {
            var duration = 1000;
            var t = (performance.now() % duration) / duration;

            var radius = size / 2 * 0.3;
            var outerRadius = size / 2 * 0.7 * t + radius;
            var context = this.context;

            // draw outer circle
            context.clearRect(0, 0, this.width, this.height);
            context.beginPath();
            context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
            context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
            context.fill();

            // draw inner circle
            context.beginPath();
            context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
            context.fillStyle = 'rgba(255, 100, 100, 1)';
            context.strokeStyle = 'white';
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();

            // update this image's data with data from the canvas
            this.data = context.getImageData(0, 0, this.width, this.height).data;

            // keep the map repainting
            map.triggerRepaint();

            // return `true` to let the map know that the image was updated
            return true;
        }
    };

    map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
    // pulsing of the dot
    map.addLayer({
        "id": "points",
        "type": "symbol",
        "source": {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [position.coords.longitude, position.coords.latitude]
                    }
                }]
            }
        },
        "layout": {
            "icon-image": "pulsing-dot"
        }
    });
});

mapboxgl.accessToken = 'pk.eyJ1IjoiYWtrdXJuaWNraSIsImEiOiJjanl2dGlhZ2gwZXdpM21yb2pzeTN0MXU1In0.fw1d3cJU5L4lFhDYAzy3fQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-79.4512, 43.6568],
    zoom: 14
});