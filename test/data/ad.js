module.exports = {
  'seller-inventory-key': {
    '@value': 'fooBar42'
  },
  'description': 'This is really a nice car. The only strange thing is that so called flux capacitor that it is equipped with. The previous owner told me that he took it from an old DeLorean. No idea what it is good for.',
  'mobile-features': [
    {'feature': 'EYE_CATCHER'},
    {'feature': 'PAGE_ONE_AD'},
    {'feature': 'TOP_OF_PAGE'}
  ],
  'vehicle:vehicle': {
    'vehicle:classification': {
      '@key': 'Car'
    },
    'vehicle:category': {
      '@key': 'Cabrio'
    },
    'vehicle:make': {
      '@key': 'PORSCHE'
    },
    'vehicle:model': {
      '@key': '993'
    },
    'vehicle:model-description': {
      '@value': '993 coupe Carrera 4'
    },
    'vehicle:damage-and-unrepaired': {
      '@value': false
    },
    'vehicle:accident-damaged': {
      '@value': false
    },
    'vehicle:roadworthy': {
      '@value': true
    },
    'vehicle:features': [
      {'vehicle:feature': {'@value': 'ELECTRIC_WINDOWS'} },
      {'vehicle:feature': {'@value': 'IMMOBILIZER'} },
      {'vehicle:feature': {'@value': 'ABS'} },
      {'vehicle:feature': {'@value': 'ESP'} },
      {'vehicle:feature': {'@value': 'HU_AU_NEU'} }
    ],
    'vehicle:specifics': {
      'vehicle:mileage': {
        '@value': 142000
      },
      'vehicle:door-count': {
        '@value': 'TWO_OR_THREE'
      },
      'vehicle:fuel': {
        '@value': 'PETROL'
      },
      'vehicle:power': {
        '@value': 210
      },
      'vehicle:gearbox': {
        '@value': 'MANUAL_GEAR'
      },
      'vehicle:construction-date': {
        '@value': '1997-04-12'
      },
      'vehicle:cubic-capacity': {
        '@value': 3600
      },
      'vehicle:condition': {
        '@value': 'USED'
      },
      'vehicle:number-of-previous-owners': {
        '@value': 1
      },
      'vehicle:parking-assistants': [
        {'vehicle:parking-assistant': {'@key': 'FRONT_SENSORS'} },
        {'vehicle:parking-assistant': {'@key': 'REAR_SENSORS'} }
      ]
    },
    'vehicle:site-specifics': {
      'site-specifics:first-registration': {
        '@value': '1997-09'
      }
    }
  },
  'price:price': {
    '@type': 'FIXED',
    '@currency': 'EUR',
    'price:gross-prices': {
      'price:consumer-price-amount': {
        '@value': 32000
      }
    }
  }
};
