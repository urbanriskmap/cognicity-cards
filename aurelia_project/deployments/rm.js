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
        }
      },
      'mumbai': {
        'region': 'mum',
        'bounds': { //arbit bounding box drawn in QGIS. So the edges aren't orthogonal
          'sw': [18.860, 72.704],
          'ne': [19.297, 73.095]
        }
      },
      'bangalore': {
        'region': 'blr',
        'bounds': { //arbit bounding box drawn in QGIS. So the edges aren't orthogonal
          'sw': [12.763, 77.365],
          'ne': [13.200, 77.866]
        }
      },
      'kerala': {
        'region': 'krl',
        'bounds': { //arbit bounding box drawn in QGIS. So the edges aren't orthogonal
          'sw': [8.1333, 74.6980],
          'ne': [12.978, 78.2170]
        }
      },
      'madhubani': {
        'region': 'mdh',
        'bounds': {
          'sw': [26.0162, 85.7296],
          'ne': [26.6864, 86.7495]
        }
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
