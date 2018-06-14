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
          'sw': [ 12.6884, 79.9248],
          'ne': [ 13.3766, 80.5413]
        }
      },
      'mumbai': {
        'region': 'mum',
        'bounds': { //arbit bounding box drawn in QGIS. So the edges aren't orthogonal
          'sw': [72.704, 18.860],
          'ne': [73.095, 19.297]
        }
      },
      'bangalore': {
        'region': 'blr',
        'bounds': { //arbit bounding box drawn in QGIS. So the edges aren't orthogonal
          'sw': [77.365, 12.763],
          'ne': [77.866, 13.200]
        }
      }
    },
    'default_region': {
      'region': 'chn',
      'bounds': {
        'sw': [ 12.6884, 79.9248],
        'ne': [ 13.3766, 80.5413]
      }
    },
    'region_center': [13.017163, 80.185031],
    'start_city_center': [13.017163, 80.185031]
  }
};
