var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    function getColor(depth) {
        if (depth < 10) return "#00d600";
        else if (depth < 30) return "#C5FF33";
        else if (depth < 50) return "#f3f100";
        else if (depth < 70) return "#FFC300";
        else if (depth < 90) return "#e86930";
        else return "#FF3333";
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        },
        pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
                {radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.geometry.coordinates[2]),
                fillOpacity: .6,
                color: "#000",
                stroke: true,
                weight: .8
            })
        }
    });

    createMap(earthquakes);

    function createMap(earthquakes) {

        var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18
        });

        var baseMaps = {
            "Street Map": street
        };

        var overlayMaps = {
            Earthquakes: earthquakes
        };

        var myMap = L.map("map", {
            center: [37.09, -95.71],
            zoom: 5,
            layers: [street, earthquakes]
        });

        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap);

        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function () {

            var div = L.DomUtil.create('div', 'info legend'),
                grades = [-10, 10, 30, 50, 70, 90];

            div.innerHTML += '<h4 style="margin:4px">Depth</h4>'

            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }

            return div;
        };

        legend.addTo(myMap);
    }
};


