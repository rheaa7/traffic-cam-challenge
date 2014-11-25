// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

$( document ).ready(function() {
    
    //creates the google map and info window on the page 
    var mapOptions = {
        center: {lat: 47.6, lng: -122.3}, 
        zoom: 12 
    };
    
    var mapElem = document.getElementById('map');
    var map = new google.maps.Map(mapElem, mapOptions);
    var infoWin = new google.maps.InfoWindow();


    
    //resize the map based on the viewport height
    $(window).resize(function() {
        $("#map").height( (Number($(this).height())) - ($('#map').position().top) - 20); 

    });
    
    //gets the list of traffic cameras, if success, data contains parsed Javascript data, if request fails, error alert is shown 
    $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
    .done(function(data) {
        
        //add marker for each camera
        data.forEach(function(camera) {
            //var image = ".../img/marker.png"
            //changes the icon image of the marker to a custom marker image 
            var image = 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/48/Map-Marker-Ball-Pink.png'
            var marker = new google.maps.Marker({
                position: {
                    lat: Number(camera.location.latitude),
                    lng: Number(camera.location.longitude),
                },
                map: map,
                icon: image,
                draggable:true,
                animation: google.maps.Animation.DROP,
  
            });
            
            google.maps.event.addListener(marker, 'click', toggleBounce);
            
            //adds animation to the markers
            function toggleBounce() {
                if (marker.getAnimation() != null) {
                    marker.setAnimation(null);
                } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                }
            }
            
            //shows the camera image when the marker is clicked 
            google.maps.event.addListener(marker, 'click', function() {
                map.panTo(this.getPosition());
                infoWin.open(map, this);
                infoWin.setContent('<p>' + camera.cameralabel + '</p>' + '<img src="' + camera.imageurl.url + '" alt="picture of '
                + camera.cameralabel + '">');
                
            });
            
            //closes the infoWindow when the user clicks on the map and stops the animation 
            google.maps.event.addListener(map, 'click', function() {
                marker.setAnimation(null);
                infoWin.close(map, this)
            });
            
            //filters the marker when user is searching 
            $("#search").bind('search keyup', function() {
                var cameraLabel = camera.cameralabel;
                cameraLabel = cameraLabel.toLowerCase();
                
                var searchLabel = this.value;
                searchLabel = searchLabel.toLowerCase();
                
                if (cameraLabel.indexOf(searchLabel) < 0) {
                    marker.setMap(null);
                } else {
                    marker.setMap(map);
                }
                
                
            });
        });
        
    }) //success
    
    .fail(function(error) {
        alert("error");
    })
    
    .always(function() {
        console.log('successfully loaded');
    })
    
}); //DOM

