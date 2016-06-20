/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    hinting: false
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  const imagesDestDir = '/assets/images'

  app.import('bower_components/leaflet-draw/dist/images/spritesheet.png', { destDir: imagesDestDir })
  app.import('bower_components/leaflet-draw/dist/images/spritesheet-2x.png', { destDir: imagesDestDir })
  app.import('bower_components/leaflet-dist/images/layers-2x.png', { destDir: imagesDestDir })
  app.import('bower_components/leaflet-dist/images/layers.png', { destDir: imagesDestDir })
  app.import('bower_components/leaflet-dist/images/marker-icon-2x.png', { destDir: imagesDestDir })
  app.import('bower_components/leaflet-dist/images/marker-icon.png', { destDir: imagesDestDir })
  app.import('bower_components/leaflet-dist/images/marker-shadow.png', { destDir: imagesDestDir })

  app.import('bower_components/leaflet-dist/leaflet.css')
  app.import('bower_components/leaflet-draw/dist/leaflet.draw.css')
  app.import('bower_components/leaflet-dist/leaflet-src.js')
  app.import('bower_components/leaflet-draw/dist/leaflet.draw-src.js')

  app.import('bower_components/proj4/dist/proj4-src.js')
  app.import('bower_components/Proj4Leaflet/src/proj4leaflet.js')
  // app.import('bower_components/esri-leaflet/dist/esri-leaflet.js')

  return app.toTree();
};
