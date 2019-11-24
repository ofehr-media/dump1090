function initialize() {


		mapboxgl.accessToken = 'pk.PleAsEgETyOuRoWntOkEn';
        var mapOptions = {
			container: 'map_canvas',
            center:  [8.62, 47.24],
            zoom: 9.5,
            style: 'mapbox://styles/mapbox/streets-v11'
        }
        var map = new mapboxgl.Map(mapOptions);
			
		map.on('load',function() {
			var url = 'http://localhost:8080/data/planes.json';
			window.setInterval(function() {
					map.getSource('planes').setData(url);
				},1000);
				
			map.addSource('planes', {
					'type': 'geojson',
					'data': url,
					'generateId': true 
				  });
			var image = map.loadImage('/img/antenna-receiver.png',function(error,antenna){
				if (error) throw error;
					map.addImage('station',antenna);
					map.addLayer({
						'id': 'station-icon',
						'type': 'symbol',
						'source': {
							'type': 'geojson',
							'data': {
								'type': 'FeatureCollection',
								'features': [{
									'type': 'Feature',
									'geometry': {
										'type': 'Point',
										'coordinates': [8.616011,47.286140]
										}
									}]
								}
							},
						'layout': {
							'icon-image': 'station',
							'icon-size': 0.10
							}
					});
				
				});
					
			var image = map.loadImage('/img/airplane-icon-indigo.png',function(error,airplane){
				if (error) throw error;
					map.addImage('plane',airplane);
					map.addLayer({
						'id': 'planes-icon',
						'type': 'symbol',
						'source': 'planes',
						'layout': {
							'icon-image': 'plane',
							'icon-size': 0.17,
							'icon-allow-overlap': true,
							'icon-rotate': ['get','track']
							}
					});
				
				});

	
		});
		
		var hexDisplay = document.getElementById('hex');
		var flightDisplay = document.getElementById('flight');
		var altitudeDisplay = document.getElementById('altitude');
		
		var planeID = null;
		map.on('mousemove', 'planes-icon', (e) => {
		  map.getCanvas().style.cursor = 'pointer';
		  // Set variables equal to the current feature's magnitude, location, and time
		  var planeHex = e.features[0].properties.hex;
		  var planeFlight = e.features[0].properties.flight;
		  var planeAltitude = e.features[0].properties.altitude;

		  // Check whether features exist
		  if (e.features.length > 0) {
			// Display the magnitude, location, and time in the sidebar
			hexDisplay.textContent = planeHex;
			flightDisplay.textContent = planeFlight;
			altitudeDisplay.textContent = planeAltitude;

			// If quakeID for the hovered feature is not null,
			// use removeFeatureState to reset to the default behavior
			if (planeID) {
			  map.removeFeatureState({
				source: "planes",
				id: planeID
			  });
			}
			planeID = e.features[0].id;

			// When the mouse moves over the earthquakes-viz layer, update the
			// feature state for the feature under the mouse
			map.setFeatureState({
			  source: 'planes',
			  id: planeID,
			}, {
			  hover: true
			});

		  }
		});
		map.on('mouseleave', 'planes-icon', function() {
		  if (planeID) {
			map.setFeatureState({
			  source: 'planes',
			  id: planeID
			}, {
			  hover: false
			});
		  }
		  
		  planeID = null;
		  // Remove the information from the previously hovered feature from the sidebar
		  hexDisplay.textContent = '';
		  flightDisplay.textContent = '';
		  altitudeDisplay.textContent = '';
		  // Reset the cursor style
		  map.getCanvas().style.cursor = '';
		});
	
	}
