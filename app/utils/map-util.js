
const mapsBaseUrl = 'http://maps.marlborough.govt.nz/arcgis/rest/services/Cache'

const linzKey = '3742b50619164a8c9a296878d1c4138e'

// proj4.defs('NZTM', '+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 ' +
//   '+y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs')

export default {
  getLayerGroup() {
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
    const parcelLayer = L.tileLayer(
      `http://tiles-{s}.data-cdn.linz.govt.nz/services;key=${linzKey}/tiles/v4/layer=772/EPSG:3857/{z}/{x}/{y}.png`,
      {
        "maxZoom": 13,
        "attribution": "LINZ",
        "minZoom": 0,
        "continuousWorld": true,
        'subdomains': 'abcd'
      }
    )
    return L.layerGroup([baseLayer, lowResLayer, highResLayer])
  },

  getParcelLayer() {
    return L.tileLayer(
      `http://tiles-{s}.data-cdn.linz.govt.nz/services;key=${linzKey}/tiles/v4/layer=772/EPSG:3857/{z}/{x}/{y}.png`,
      {
        'subdomains': 'abcd'
      }
    )

    // return L.tileLayer(
    //   'http://api.data.linz.govt.nz/api/vectorQuery.json?' +
    //     'key=3742b50619164a8c9a296878d1c4138e&layer=772&x={x}&y={y}&max_results=3&radius=10000&geometry=true&with_field_names=true'
    // )
  },

  getCrs() {
    return new L.Proj.CRS('EPSG:2193', // http://epsg.io/2193
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
  },

  // Takes co-ordinates in the format [easting, northing] and returns [lat, lng] (WGS84).
  nztmToLatLng(coordinates)  {
    return proj4('NZTM', 'WGS84', coordinates).reverse()
  }

}
