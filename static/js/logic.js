// URL of all earthquake data in the past 7days
//var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
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

    function colorSelect(magnitude){
      
      var magnitudeFloat = parseFloat(magnitude);
      console.log("magnitudeFloat is ", parseFloat(magnitudeFloat));      
      /*switch(magnitudeFloat)
      {
        case 0-1:
          console.log("the number is less than or equal to 1");
          break;
        case 1.01-2:
          console.log("the number is less than or equal to 2");
          break;
        case 2.01-3:
          console.log("the number is less than or equal to 3");
          break;
        case 3.01-4:
          console.log("the number is less than or equal to 4");
          break;
        case 4.01-5:
          console.log("the number is less than or equal to 5");
          break;                
        default:
          console.log("the number is greater than 5");
          break;
      };*/
      if (magnitudeFloat <= 1)
      {
        console.log("the number is less than or equal to 1");
        return "#65C3B3";
      }
      else if (magnitudeFloat <= 2)
      {
        console.log("the number is less than or equal to 2");
        return "#4B9689";
      }
      else if (magnitudeFloat <= 3)
      {
        console.log("the number is less than or equal to 3");
        return "#327368";
      }
      else if (magnitudeFloat <= 4)
      {
        console.log("the number is less than or equal to 4");
        return "#1C564D";
      }
      else if (magnitudeFloat <= 5)
      {
        console.log("the number is less than or equal to 5");
        return "#0D4037";
      }
      else
      {
        console.log("the number is greater than 5");
        return "#042D26";
      }
}

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    
    var earthquakes = L.geoJSON(earthquakeData, 
    {
      pointToLayer: function(earthquakeData, latlng)
      {
        return L.circle(latlng,
        {
          radius: (earthquakeData.properties.mag * 30000),
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
  }