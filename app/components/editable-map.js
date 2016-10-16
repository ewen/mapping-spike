/* global $, L */

import Ember from 'ember';
import mapUtil from 'mapping-spike/utils/map-util'

const { get, set, run, computed } = Ember

// const initMap = function (containerId) {


//   // make global for experimentation in the browser
//   document.map = map



//   // Initialise the FeatureGroup to store editable layers
//   const drawnItems = new L.FeatureGroup()
//   map.addLayer(drawnItems)

//   // Initialise the draw control and pass it the FeatureGroup of editable layers
//   const drawControl = new L.Control.Draw({
//     edit: {
//         featureGroup: drawnItems
//     }
//   })
//   map.addControl(drawControl)

//   map.on('draw:created', function (e) {
//     const type = e.layerType
//     const layer = e.layer

//     if (type === 'marker') {
//         // Do marker specific actions
//     }

//     if (type === 'polygon') {
//       const area = L.GeometryUtil.geodesicArea(layer.getLatLngs())
//       console.log('Area', area)
//       console.log('LatLngs', layer.getLatLngs())
//     }

//     drawnItems.addLayer(layer)
//   })


//   map.on('draw:edited', function (e) {
//     const layers = e.layers
//     layers.eachLayer(function (layer) {
//       //do whatever you want, most likely save back to db
//       const area = L.GeometryUtil.geodesicArea(layer.getLatLngs())
//       console.log('Area', area)
//       console.log('LatLngs', layer.getLatLngs())
//     })
//   })

//   document.drawnItems = drawnItems

//   return {map, drawnItems}
// }

export default Ember.Component.extend({
  didInsertElement: function () {
    this._super()
    run(() => this.initMap())
  },
  initMap: function () {
    const container = document.getElementById(get(this, 'elementId'))
    const mapElement = $('.editable-map', container).get(0)

    const map = L.map(mapElement, {
      center: L.latLng(-41.5134, 173.9612), // Blenheim
      zoom: 10,
      crs: mapUtil.getCrs()
    })

    // add MDC map layers
    mapUtil.getLayerGroup().addTo(map)
    // mapUtil.getParcelLayer().addTo(map)

    // Initialise the FeatureGroup to store editable layers
    const drawnItems = new L.FeatureGroup()
    map.addLayer(drawnItems)

    // Initialise the draw control and pass it the FeatureGroup of editable layers
    const drawControl = new L.Control.Draw({
      edit: {
          featureGroup: drawnItems
      }
    })
    map.addControl(drawControl)

    map.on('draw:created', (e) => {
      drawnItems.addLayer(e.layer)
      this.syncroniseInfo()
    })
    map.on('draw:edited', (e) => {
      this.syncroniseInfo()
    })
    map.on('draw:draw:deleted', (e) => {
      this.syncroniseInfo()
    })

    set(this, 'map', map)
    set(this, 'drawnItems', drawnItems)
    set(this, 'drawControl', drawControl)
  },
  syncroniseInfo() {
    const drawnItems = get(this, 'drawnItems')
    const layers = drawnItems.getLayers()

    const polygons = []
    const lines = []
    const markers = []
    const circles = []
    layers.forEach(layer => {
      if (layer instanceof L.Polygon) {
        polygons.push({
          area: Math.round(L.GeometryUtil.geodesicArea(layer.getLatLngs()))
        })
      } else if (layer instanceof L.Polyline) {
        const latLngs = layer.getLatLngs()
        let prevLatLng
        let length = 0
        latLngs.forEach(latLng => {
          if (prevLatLng) {
            length += latLng.distanceTo(prevLatLng)
          }
          prevLatLng = latLng
        })
        lines.push({
          length: Math.round(length)
        })
      } else if (layer instanceof L.Marker) {
        markers.push({
          position: layer.getLatLng()
        })
      } else if (layer instanceof L.Circle) {
        circles.push({
          radius: Math.round(layer.getRadius()),
          position: layer.getLatLng()
        })
      }
    })
    set(this, 'polygons', polygons)
    set(this, 'lines', lines)
    set(this, 'markers', markers)
    set(this, 'circles', circles)
  },
  polygons: [],
  lines: [],
  markers: [],
  actions: {
    addMooring() {
      const map = get(this, 'map')
      const drawControl = get(this, 'drawControl')
      new L.Draw.Circle(map, drawControl.options.circle).enable()
    },
    addMeter() {
      const map = get(this, 'map')
      const drawControl = get(this, 'drawControl')
      new L.Draw.Marker(map, drawControl.options.marker).enable()
    }
  }
})
