/* global $, L */

import Ember from 'ember';

const { get, run } = Ember

const crs = new L.Proj.CRS('EPSG:2193', // http://epsg.io/2193
  '+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 ' +
  '+ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  {
    origin: [-4020900, 19998100],
    resolutions: [
      396.87579375158754,
      264.5838625010584,
      132.2919312505292,
      66.1459656252646,
      33.0729828126323,
      26.458386250105836,
      13.229193125052918,
      6.614596562526459,
      2.6458386250105836,
      1.3229193125052918,
      0.6614596562526459,
      0.26458386250105836,
      0.13229193125052918,
      0.06614596562526459,
      0.033072982812632296
    ]
  }
)

const mapsBaseUrl = 'http://maps.marlborough.govt.nz/arcgis/rest/services/Cache'

const initMap = function (containerId) {
  const container = document.getElementById(containerId)
  const mapElement = $('.editable-map', container).get(0)

  const map = L.map(mapElement, {
    center: L.latLng(-41.5134, 173.9612),
    zoom: 10,
    crs: crs
  })

  const baseLayer = L.tileLayer(
    `${mapsBaseUrl}/Basemap/MapServer/tile/{z}/{y}/{x}`,
    {
      "maxZoom": 13,
      "attribution": "",
      "minZoom": 0,
      "continuousWorld": true
    }
  )

  const lowResLayer = L.tileLayer(
    `${mapsBaseUrl}/LowResolutionAerialPhotos/MapServer/tile/{z}/{y}/{x}`,
    {
      "maxZoom": 13,
      "attribution": "",
      "minZoom": 0,
      "continuousWorld": true
    }
  )

  const highResLayer = L.tileLayer(
    `${mapsBaseUrl}/HighResolutionAerialPhotos/MapServer/tile/{z}/{y}/{x}`,
    {
      "maxZoom": 13,
      "attribution": "Marlborough District Council",
      "minZoom": 7,
      "continuousWorld": true
    }
  )

  L.layerGroup([baseLayer, lowResLayer, highResLayer]).addTo(map)

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

  map.on('draw:created', function (e) {
    const type = e.layerType
    const layer = e.layer

    if (type === 'marker') {
        // Do marker specific actions
    }

    if (type === 'polygon') {
      const area = L.GeometryUtil.geodesicArea(layer.getLatLngs())
      console.log('Area', area)
      console.log('LatLngs', layer.getLatLngs())
    }

    drawnItems.addLayer(layer)
  })


  map.on('draw:edited', function (e) {
    const layers = e.layers
    layers.eachLayer(function (layer) {
      //do whatever you want, most likely save back to db
      const area = L.GeometryUtil.geodesicArea(layer.getLatLngs())
      console.log('Area', area)
      console.log('LatLngs', layer.getLatLngs())
    })
  })
}

export default Ember.Component.extend({
  didInsertElement: function () {
    this._super()
    run(() => {
      initMap(get(this, 'elementId'))
    })
  }
})
