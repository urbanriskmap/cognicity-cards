export default {
  debug: false,
  testing: false,
  enable_test_cardid: false,

  //deployment specific env params
  riskmap_us: {
    title: 'RiskMap.us',
    supported_languages: ['en', 'es'],
    default_language: 'en',
    tile_layer: 'https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidXJiYW5yaXNrbWFwIiwiYSI6ImNqZnY2cGxndzN3M3AyeHMydGVyeHcyMWIifQ.D6K1H9c8CTnP6twGYdtDKA',
    data_server: 'https://data.riskmap.us/',
    app: 'https://riskmap.us/'
  },
  petabencana: {
    title: 'PetaBencana.id',
    supported_languages: ['en', 'id'],
    default_language: 'id',
    tile_layer: 'https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidXJiYW5yaXNrbWFwIiwiYSI6ImNpdmVhbTFraDAwNHIyeWw1ZDB6Y2hhbTYifQ.tpgt1PB5lkJ-wITS02c96Q',
    data_server: 'https://data.petabencana.id/',
    app: 'https://petabencana.id/'
  },
  riskmap_in: {
    title: 'RiskMap.in',
    supported_languages: ['en', 'ml'],
    default_language: 'en',
    tile_layer: 'https://api.mapbox.com/styles/v1/urbanriskmap/cjfvacwic1cfc2smiwbyfwcs4/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidXJiYW5yaXNrbWFwIiwiYSI6ImNqZnY2cGxndzN3M3AyeHMydGVyeHcyMWIifQ.D6K1H9c8CTnP6twGYdtDKA',
    data_server: 'https://data.riskmap.in/',
    app: 'https://riskmap.in/'
  }
};
