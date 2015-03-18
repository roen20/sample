/* Maps API */

//-----------------------------------------------------------------
// Google Simple Map
var map;
function simpleMap() {
    var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(-34.397, 150.644)
    };
    map = new google.maps.Map(document.getElementById('map-simple'),
        mapOptions);
}

google.maps.event.addDomListener(window, 'load', simpleMap);


//-----------------------------------------------------------------
// Google Marker with click event
function markerMapWithClickEvent() {
    var locations = [
    ['Bondi Beach', -33.890542, 151.274856, 4],
    ['Coogee Beach', -33.923036, 151.259052, 5],
    ['Cronulla Beach', -34.028249, 151.157507, 3],
    ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
    ['Maroubra Beach', -33.950198, 151.259302, 1]
    ];

    var map = new google.maps.Map(document.getElementById('map-marker'), {
        zoom: 10,
        center: new google.maps.LatLng(-33.92, 151.25),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) {  
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
}

google.maps.event.addDomListener(window, 'load', markerMapWithClickEvent);

//-----------------------------------------------------------------
// Google Simple Cluster Map
function simpleCluster() {
    var center = new google.maps.LatLng(37.4419, -122.1419);

    var map = new google.maps.Map(document.getElementById('simple-cluster'), {
        zoom: 3,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var markers = [];
    for (var i = 0; i < 100; i++) {
        var dataPhoto = data.photos[i];
        var latLng = new google.maps.LatLng(dataPhoto.latitude,
            dataPhoto.longitude);
        var marker = new google.maps.Marker({
            position: latLng
        });
        markers.push(marker);
    }
    var markerCluster = new MarkerClusterer(map, markers);
}
google.maps.event.addDomListener(window, 'load', simpleCluster);


//-----------------------------------------------------------------
// Google Advance Cluster Map
var styles = [[{
    url: 'google_cluster_images/people35.png',
    height: 35,
    width: 35,
    anchor: [16, 0],
    textColor: '#ff00ff',
    textSize: 10
}, {
    url: 'google_cluster_images/people45.png',
    height: 45,
    width: 45,
    anchor: [24, 0],
    textColor: '#ff0000',
    textSize: 11
}, {
    url: 'google_cluster_images/people55.png',
    height: 55,
    width: 55,
    anchor: [32, 0],
    textColor: '#ffffff',
    textSize: 12
}], [{
    url: 'google_cluster_images/conv30.png',
    height: 27,
    width: 30,
    anchor: [3, 0],
    textColor: '#ff00ff',
    textSize: 10
}, {
    url: 'google_cluster_images/conv40.png',
    height: 36,
    width: 40,
    anchor: [6, 0],
    textColor: '#ff0000',
    textSize: 11
}, {
    url: 'google_cluster_images/conv50.png',
    width: 50,
    height: 45,
    anchor: [8, 0],
    textSize: 12
}], [{
    url: 'google_cluster_images/heart30.png',
    height: 26,
    width: 30,
    anchor: [4, 0],
    textColor: '#ff00ff',
    textSize: 10
}, {
    url: 'google_cluster_images/heart40.png',
    height: 35,
    width: 40,
    anchor: [8, 0],
    textColor: '#ff0000',
    textSize: 11
}, {
    url: 'google_cluster_images/heart50.png',
    width: 50,
    height: 44,
    anchor: [12, 0],
    textSize: 12
}]];

var markerClusterer = null;
var map = null;
var imageUrl = 'http://chart.apis.google.com/chart?cht=mm&chs=24x32&' +
'chco=FFFFFF,008CFF,000000&ext=.png';

function refreshMap() {
    if (markerClusterer) {
        markerClusterer.clearMarkers();
        gMaps(2);
    }

    var markers = [];

    var markerImage = new google.maps.MarkerImage(imageUrl,
        new google.maps.Size(24, 32));

    for (var i = 0; i < 1000; ++i) {
        var latLng = new google.maps.LatLng(data.photos[i].latitude,
            data.photos[i].longitude)
        var marker = new google.maps.Marker({
            position: latLng,
            draggable: true,
            icon: markerImage
        });
        markers.push(marker);
    }

    var zoom = parseInt(document.getElementById('zoom').value, 10);
    var size = parseInt(document.getElementById('size').value, 10);
    var style = parseInt(document.getElementById('style').value, 10);
    zoom2 = zoom == -1 ? 2 : zoom;
    size = size == -1 ? null : size;
    style = style == -1 ? null: style;
    if(zoom == -1 || zoom != -1){
        markerClusterer = new MarkerClusterer(map, markers, {
            gridSize: size,
            styles: styles[style]
        });
        if(zoom != -1){
            gMaps(zoom2);
        }
    }
}

function advancedCluster() {

    gMaps(2);

    var refresh = document.getElementById('refresh');
    google.maps.event.addDomListener(refresh, 'click', refreshMap);

    var clear = document.getElementById('clear');
    google.maps.event.addDomListener(clear, 'click', clearClusters);

    refreshMap();
}

function gMaps(getzoom){
    map = new google.maps.Map(document.getElementById('advanced-cluster'), {
        zoom: getzoom,
        center: new google.maps.LatLng(39.91, 116.38),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
}
function clearClusters(e) {
    e.preventDefault();
    e.stopPropagation();
    markerClusterer.clearMarkers();
}
google.maps.event.addDomListener(window, 'load', advancedCluster);

function weatherLayer() {
    var mapOptions = {
        zoom: 6,
        center: new google.maps.LatLng(49.265984,-123.127491)
    };

    var map = new google.maps.Map(document.getElementById('map-weatherlayer'),
        mapOptions);

    var weatherLayer = new google.maps.weather.WeatherLayer({
        temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT
    });
    weatherLayer.setMap(map);

    var cloudLayer = new google.maps.weather.CloudLayer();
    cloudLayer.setMap(map);
}

google.maps.event.addDomListener(window, 'load', weatherLayer);
   
//-----------------------------------------------------------------   
// Google Geolocation
// 
// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see a blank space instead of the map, this
// is probably because you have denied permission for location sharing.

var map;

function geoLocation() {
    var mapOptions = {
        zoom: 6
    };
    map = new google.maps.Map(document.getElementById('map-geolocation'),
        mapOptions);

    // Try HTML5 geolocation
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);

            var infowindow = new google.maps.InfoWindow({
                map: map,
                position: pos,
                content: 'Howdy, I found you!' //Location found using HTML5.
            });

            map.setCenter(pos);
        }, function() {
            handleNoGeolocation(true);
        });
    } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }
}

function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}

google.maps.event.addDomListener(window, 'load', geoLocation);

//-----------------------------------------------------------------
// Bing Geocoder with custom service
var map;
var geocoder;
var locatorUrl = "http://servicesbeta.esri.com/ArcGIS/rest/services/LocateValveByAssetID/GeocodeServer";
require([
    "esri/map", "esri/dijit/Geocoder", "dojo/domReady!"
    ], function(
        Map, Geocoder
        ) {
        map = new Map("map",{
            basemap: "topo",
            center: [-117.19,34.05], // lon, lat
            zoom: 13
        });
        
        var myGeocoders = [{
            url: locatorUrl,
            name: "LocateValveByAssetID"
        }];
        geocoder = new Geocoder({
            map: map,
            autoComplete: true,
            arcgisGeocoder: false,
            geocoders: myGeocoders,
            value: "146317"
        },"search");
        geocoder.startup();
    });