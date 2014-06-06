var builder = require('xmlbuilder');

module.exports = {

  /**
   *
   * @param input
   * @returns {string}
   */
  toXml: function(input) {

    var xml = builder.create('ad', {
      version: '1.0',
      encoding: 'UTF-8'
    });

    xml
      .att('xmlns:xs', 'http://www.w3.org/2001/XMLSchema-instance')
      .att('xmlns', 'http://services.mobile.de/schema/seller/seller-ad-1.1')
      .att('xmlns:vehicle', 'http://services.mobile.de/schema/seller/vehicle-1.0')
      .att('xmlns:site-specifics', 'http://services.mobile.de/schema/seller/site-specifics-1.0')
      .att('xmlns:price', 'http://services.mobile.de/schema/seller/price-1.0')
      .att('xmlns:schemaLocation', 'http://services.mobile.de/schema/seller/seller-ad-1.1 http://services.mobile.de/schema/seller/seller-ad-1.1.xsd');

    xml.ele(input);

    return xml.end({ pretty: true });
  }

};
