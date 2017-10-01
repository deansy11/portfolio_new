// https://developers.google.com/maps/documentation/javascript/markers
(function() {
  window.MapSpot = function(node, options) {
    const DEFAULT_CENTER = {lat: 35.654890, lng: 139.722600}
    const DEFAULT_ZOOM = 17

    this.options = options || {}

    this.node = node
    this.markers = []
    this.map = new google.maps.Map(this.node)

    this.initMap = function() {
      this.map.setCenter(this.options["center"] || DEFAULT_CENTER)
      this.map.setZoom(this.options["zoom"] || DEFAULT_ZOOM)
      this.addEventListeners()
    }

    this.addEventListeners = function() {
      let self = this
      google.maps.event.addListener(this.map, "click", function(event) {
        self.addMarker(event.latLng)
      });
    }

    this.addMarker = function(coordinates) {
      this.markers.push(
        new google.maps.Marker({
          position: coordinates,
          draggable: true,
          map: this.map
        })
      )
    }

    this.getCoordinates = function() {
      return this.markers.map(function(marker) {
        return {
          lat: marker.position.lat(),
          lng: marker.position.lng()
        }
      })
    }

    this.deleteAllMarkers = function() {
      this.markers.forEach(function(marker) {
        marker.setMap(null)
      })
      this.markers.length = 0
    }

    this.restoreCoordinates = function(coordinates) {
      let self = this
      coordinates.forEach(function(coordinate) {
        self.addMarker(coordinate)
      })
    }

    this.restoreMap = function(serialized) {
      let self = this
      this.deleteAllMarkers()
      this.map.setCenter(serialized.center)
      this.map.setZoom(serialized.zoom)
      this.restoreCoordinates(serialized.coordinates)
    }

    this.serialize = function() {
      return {
        center: {
          lat: this.map.getCenter().lat(),
          lng: this.map.getCenter().lng(),
        },
        zoom: this.map.getZoom(),
        coordinates: this.getCoordinates(),
      }
    }
  }
})();

(function() {
  window.mapDefaults = {
    coordinates: [
      {lat: 35.654890, lng: 139.722600},
    ],
    node: document.getElementById('map'),
  }
})();


let mapSpot = new MapSpot(mapDefaults.node, {
  center: mapDefaults.coordinates[0],
})
mapSpot.initMap()

mapSpot.restoreCoordinates(mapDefaults.coordinates)
mapSpot.addMarker({lat: 35.654376, lng: 139.722903})

console.log("Coordinates")
console.table(mapSpot.getCoordinates())

console.log("Markers")
console.log(mapSpot.markers)

// Demo serialize and restore
setTimeout(function() {
  mapSpot.map.setZoom(16)
}, 1000)
serialized = mapSpot.serialize()
setTimeout(function() {
  mapSpot.deleteAllMarkers()
}, 2000)
setTimeout(function() {
  mapSpot.restoreMap(serialized)
}, 3000)
