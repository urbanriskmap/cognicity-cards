//Utility functions for manipulating leaflet map layers

import {inject, noView} from 'aurelia-framework';
import * as L from 'leaflet';
import Chart from 'chart';
import {Config} from 'resources/config';
import {HttpClient} from 'aurelia-http-client';
import * as topojson from 'topojson-client';

//start-non-standard
@noView
@inject(Config)
//end-non-standard
export class MapLayers {
  constructor(Config) {
    this.activeReports = {}; // List of available reports (filtered by city, time: last 1 hour)
    this.config = Config.map;
    this.mapIcons = {
      report_normal: L.icon({
        iconUrl: 'assets/icons/floodIcon.svg',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      }),
      report_selected: L.icon({
        iconUrl: 'assets/icons/floodSelectedIcon.svg',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      }),
      gauge_icons: (url) => L.icon({
        iconUrl: url,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      })
    };
  }

  gaugeIconUrl(level) {
    switch(level) {
      case 1:
      return 'assets/icons/gateIcon.svg';
      case 2:
      return 'assets/icons/gateIcon.svg';
      case 3:
      return 'assets/icons/gateIcon.svg';
      default:
      return 'assets/icons/gateIcon.svg';
    }
  }

  //Get topojson data from server, return geojson
  getData(end_point) {
    var self = this,
        url = self.config.data_server + end_point;
    let client = new HttpClient();
    return new Promise((resolve, reject) => {
      client.get(url)
      .then(data => {
        var topology = JSON.parse(data.response);
        if (topology.statusCode === 200) {
          var result = topology.result;
          if (result && result.objects) {
            resolve(topojson.feature(result, result.objects.output));
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      })
      .catch(err => reject(err));
    });
  }

  onEachFeature(feature, layer, city_name, map, togglePane) {
    var self = this;
    self.activeReports[feature.properties.pkey] = layer;
    layer.on({
      click: (e) => {
        if (!self.selected_report) {
          e.target.setIcon(self.mapIcons.report_selected);
          self.popupContent = {};
          for (let prop in feature.properties) {
            self.popupContent[prop] = feature.properties[prop];
          }
          let localTimestamp = new Date(feature.properties.created_at);
          self.popupContent.timestamp = (localTimestamp.toLocaleDateString('id', {timeZone: "Asia/Jakarta"}) + " " + localTimestamp.toLocaleTimeString('en', {hour12: false, timeZone: "Asia/Jakarta"}));
          map.flyTo(layer._latlng, 15);
          history.pushState({city: city_name, report_id: feature.properties.pkey}, "city", "map/" + city_name + "/" + feature.properties.pkey);
          togglePane('#reportPane', 'show', false);
          self.selected_report = e;
        } else if (e.target === self.selected_report.target) {
          e.target.setIcon(self.mapIcons.report_normal);
          history.pushState({city: city_name, report_id: null}, "city", "map/" + city_name);
          togglePane('#reportPane', 'hide', false);
          self.selected_report = null;
        } else if (e.target !== self.selected_report.target) {
          self.selected_report.target.setIcon(self.mapIcons.report_normal);
          e.target.setIcon(self.mapIcons.report_selected);
          self.popupContent = {};
          for (let prop in feature.properties) {
            self.popupContent[prop] = feature.properties[prop];
          }
          let localTimestamp = new Date(feature.properties.created_at);
          self.popupContent.timestamp = (localTimestamp.toLocaleDateString('id', {timeZone: "Asia/Jakarta"}) + " " + localTimestamp.toLocaleTimeString('en', {hour12: false, timeZone: "Asia/Jakarta"}));
          map.flyTo(layer._latlng, 15);
          history.pushState({city: city_name, report_id: feature.properties.pkey}, "city", "map/" + city_name + "/" + feature.properties.pkey);
          togglePane('#reportPane', 'show', false);
          self.selected_report = e;
        }
      }
    });
  }

  appendData(end_point, localObj, map) {
    var self = this;
    return new Promise((resolve, reject) => {
      self.getData(end_point)
      .then(data => {
        if (!data) {
          console.log('Could not load map layer');
          resolve(data);
        } else {
          localObj.addData(data);
          localObj.addTo(map);
          resolve(data);
        }
      }).catch(() => reject(null));
    });
  }

  addSingleReport(report_id) {
    var self = this;
    return new Promise((resolve, reject) => {
      self.getData('reports/' + report_id)
      .then(data => {
        self.reports.addData(data);
        resolve(self.activeReports[data.features[0].properties.pkey]);
      }).catch(() => reject(null));
    });
  }

  addReports(city_name, city_region, map, togglePane) {
    var self = this;
    self.reports = L.geoJSON(null, {
      onEachFeature: (feature, layer) => {
        self.onEachFeature(feature, layer, city_name, map, togglePane);
      },
      pointToLayer: (feature, latlng) => {
        return L.marker(latlng, {
          icon: self.mapIcons.report_normal
        });
      }
    });
    return self.appendData('reports/?city=' + city_region, self.reports, map);
  }

  removeReports(map) {
    var self = this;
    if (self.reports) {
      map.removeLayer(self.reports);
      self.reports = null;
    }
  }

  addFloodExtents(city_region, map) {
    var self = this;
    self.flood_extents = L.geoJSON(null, {
      style: (feature, layer) => {
        switch (feature.properties.state) {
          case 4: return {fillColor:"#CC2A41", weight:1, color:"#CC2A41", opacity:0.8, fillOpacity: 0.8};
          case 3: return {fillColor:"#FF8300", weight:1, color:"#FF8300", opacity:0.8, fillOpacity: 0.8};
          case 2: return {fillColor:"#FFFF00", weight:1, color:"#FFFF00", opacity:0.8, fillOpacity: 0.8};
          case 1: return {fillColor:"#A0A9F7", weight:1, color:"#A0A9F7", opacity:0.8, fillOpacity: 0.8};
          default: return {color:"rgba(0,0,0,0)", weight:0, fillOpacity:0};
        }
      }
    });
    return self.appendData('floods?city=' + city_region + '&minimum_state=1', self.flood_extents, map);
  }

  removeFloodExtents(map) {
    var self = this;
    if (self.flood_extents){
      map.removeLayer(self.flood_extents);
      self.flood_extents = null;
    }
  }

  addFloodGauges(city_region, map, togglePane) {
    var self = this;
    if (city_region === 'jbd') {

      // Create flood gauge layer and add to the map
      self.gaugeLayer = L.geoJSON(null, {
        pointToLayer: (feature, latlng) => {
          return L.marker(latlng, {
            icon: self.mapIcons.gauge_icons(self.gaugeIconUrl(feature.properties.observations[feature.properties.observations.length-1].f3))
          });
        },
        onEachFeature: (feature, layer) => {
          layer.on({
            click: (e) => {
              // Handle flood reports layer selection and popup
              if (this.selected_report) {
                this.selected_report.target.setIcon(self.mapIcons.report_normal);
                togglePane('#reportPane', 'hide', false);
                this.selected_report = null;
                history.pushState({city: city_name, report_id: null}, "city", "map/" + city_name);
              }
              //TODO - set via Aurelia binding
              $('#chart-title').html(feature.properties.gaugenameid);
              $('#chart-pane').html('<canvas id="modalChart"></canvas>');
              $('#modalChart').empty();
              var ctx = $('#modalChart').get(0).getContext("2d");
              var data = {
                labels : [],
                datasets : [{
                  label: "Tinggi Muka Air / Water Depth (cm)",
                  backgroundColor: "rgba(151,187,205,0.2)",
                  borderColor: "rgba(151,187,205,1)",
                  pointBackgroundColor: "rgba(151,187,205,1)",
                  pointBorderColor: "#fff",
                  pointRadius: 4,
                  data: [1,2,3]
                }]
              };
              for (var i = 0; i < feature.properties.observations.length; i++){
                data.labels.push(feature.properties.observations[i].f1);
                data.datasets[0].data.push(feature.properties.observations[i].f2);
              }
              var gaugeChart = new Chart(ctx,
                {type: 'line',
                data:data,
                options: {
                  bezierCurve:true,
                  legend: {display:true},
                  scaleLabel: "<%= ' ' + value%>",
                  scales: {
                    xAxes: [{
                      type: 'time',
                      time: {
                        unit: 'hour',
                        unitStepSize: 1,
                        displayFormats: {
                          'millisecond': 'HH:mm',
                          'second': 'HH:mm',
                          'minute': 'HH:mm',
                          'hour': 'HH:mm',
                          'day': 'HH:mm',
                          'week': 'HH:mm',
                          'month': 'HH:mm',
                          'quarter': 'HH:mm',
                          'year': 'HH:mm'
                        }
                      }
                    }]
                  },
                  tooltips:{
                    enabled: false
                  }
                }
              });
              togglePane('#chartPane', 'show', false);
            }
          });
        }
      });
    }

    // Get areas where flooding is happening
    // TODO change to env config when there is data in dev for flood gauges
    // Get data and add to layer
    return self.appendData('floodgauges?city=' + city_region, self.gaugeLayer, map);
  }

  removeFloodGauges(map) {
    var self = this;
    if (self.gaugeLayer) {
      map.removeLayer(self.gaugeLayer);
      self.gaugeLayer = null;
    }
  }
}
