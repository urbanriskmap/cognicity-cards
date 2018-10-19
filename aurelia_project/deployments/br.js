export default {
  name: 'riskmap_us',
  supported_card_decks: {
    flood: [
      'location',
      'depth',
      'photo',
      'description',
      'review'
    ]
  },
  height_units: 'in',
  map: {
    'instance_regions': {
      'Broward': {
        'region': 'brw',
        'bounds': {
          'sw': [ 25.948143, -80.477974],
          'ne': [ 26.372556, -80.056669]
        },
        'center': [26.138301, -80.199261]
      }
      // 'Florida Panhandle': {
      //   'region': 'fph',
      //   'bounds': {
      //     'sw': [ 27.2007, -87.7825],
      //     'ne': [ 31.3291, -81.0455]
      //   },
      //   'center': [30.1588, -85.6602]
      // }
    },
    'default_region': {
      'region': 'south_east_florida',
      'bounds': {
        'sw': [ 25.948143, -80.477974],
        'ne': [ 26.372556, -80.056669]
      },
      'center': [26.138301, -80.199261]
    },
    'region_center': [26.138301, -80.199261],
    'start_city_center': [26.138301, -80.199261]
  }
};
