// URL of all earthquake data in the past 7days
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryURL, function(earthquakeData) {

    console.log(earthquakeData);

    createFeatures(earthquakeData);
});

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(features, layer) {
      layer.bindPopup("<h3>" + "Earthquake ID: " + features.id + "</h3>" + "<hr>" + "Coordinates: " + features.geometry.coordinates[0] + ", " + features.geometry.coordinates[1] + "<br>" + "Magnitude: " + features.properties.mag);
    }

    // sets the color of the circle based on magnitude
    function colorSelect(magnitude){
      
      var magnitudeFloat = parseFloat(magnitude);
      var color = "#FB0808";
      
      switch(true)
      {
        case (magnitudeFloat <= 1.0):
          color = "#08FB48";
          break;
        case (magnitudeFloat <= 2.0):
          color = "#ADFB08";
          break;
        case (magnitudeFloat <= 3.0):
          color = "#FBF608";
          break;
        case (magnitudeFloat <= 4.0):
          color = "#FBA408";
          break;
        case (magnitudeFloat <= 5.0):
          color = "#FB5A08";
          break;                
      };
      return color;
}

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array

    var earthquakes = L.geoJSON(earthquakeData, 
    {
      pointToLayer: function(earthquakeData, latlng)
      {
        return L.circle(latlng,
        {
          // sets the size of the circle based on magnitude
          radius: (earthquakeData.properties.mag * 30000),
          // calls the function that returns the color of each circle
          color:  colorSelect(earthquakeData.properties.mag),
          fillOpacity: 1
        });
      },
      onEachFeature: onEachFeature
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
 

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("mapid", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function() 
  {
    var div = L.DomUtil.create("div", "info legend");
    var labels = [];

    // Add min & max
    var legendInfo = "<h2>&nbsp;Legend (Magnitude): &nbsp;</h2>" +
      "<div style=\"background-color: #08FB48\">&nbsp;Less than or equal to 1</div>" +
      "<div style=\"background-color: #ADFB08\">&nbsp;Less than or equal to 2</div>" +
      "<div style=\"background-color: #FBF608\">&nbsp;Less than or equal to 3</div>" +
      "<div style=\"background-color: #FBA408\">&nbsp;Less than or equal to 4</div>" +
      "<div style=\"background-color: #FB5A08\">&nbsp;Less than or equal to 5</div>" +
      "<div style=\"background-color: #FB0808\">&nbsp;More than 5</div>" ;

    div.innerHTML = legendInfo;

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
}