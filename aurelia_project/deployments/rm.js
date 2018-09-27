export default {
  name: 'riskmap_in',
  supported_card_decks: {
    flood: [
      'location',
      'depth',
      'photo',
      'description',
      'review'
    ],
    prep: [
      'prep',
      'location',
      'photo',
      'description',
      'review'
    ],
    assessment: [
      'location',
      'plinth',
      'roof',
      'walls',
      'nonstructural',
      'photo',
      'review'
    ]
  },
  height_units: 'cm',
  map: {
    'instance_regions': {
      'chennai': {
        'region': 'chn',
        'bounds': { //arbit bounding box drawn in QGIS. So the edges aren't orthogonal
          'sw': [12.6884, 79.9248],
          'ne': [13.3766, 80.5413]
        },
        'center': [13.0827, 80.2707]
      },
      'mumbai': {
        'region': 'mum',
        'bounds': { //arbit bounding box drawn in QGIS. So the edges aren't orthogonal
          'sw': [18.860, 72.704],
          'ne': [19.297, 73.095]
        },
        'center': [19.0760, 72.8777]
      },
      'bangalore': {
        'region': 'blr',
        'bounds': { //arbit bounding box drawn in QGIS. So the edges aren't orthogonal
          'sw': [12.763, 77.365],
          'ne': [13.200, 77.866]
        },
        'center': [12.9716, 77.5946]
      },
      'kerala': {
        'region': 'krl',
        'bounds': { //arbit bounding box drawn in QGIS. So the edges aren't orthogonal
          'sw': [8.1333, 74.6980],
          'ne': [12.978, 78.2170]
        },
        'center': [9.9312, 76.2673]
      },
      'madhubani': {
        'region': 'mdh',
        'bounds': {
          'sw': [26.0162, 85.7296],
          'ne': [26.6864, 86.7495]
        },
        'center': [13.017163, 80.185031]
      }
    },
    'default_region': {
      'region': 'krl', //TODO change this to show entire country or put a city selector
      'bounds': {
        'sw': [8.1333, 74.6980],
        'ne': [12.978, 78.2170]
      }
    },
    'region_center': [10.158299, 76.7151],
    'start_city_center': [9.9312, 76.2673]
  }
};
