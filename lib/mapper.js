var builder = require('xmlbuilder');

module.exports = {

  /**
   * @param input
   * @returns {string}
   */
  vehicleToXml: function(input) {

    var xml = builder.create('ad', {
      version: '1.0',
      encoding: 'UTF-8'
    });

    xml
      .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
      .att('xmlns', 'http://services.mobile.de/schema/seller/seller-ad-1.1')
      .att('xmlns:vehicle', 'http://services.mobile.de/schema/seller/vehicle-1.0')
      .att('xmlns:site-specifics', 'http://services.mobile.de/schema/seller/site-specifics-1.0')
      .att('xmlns:price', 'http://services.mobile.de/schema/seller/price-1.0')
      .att('xsi:schemaLocation', 'http://services.mobile.de/schema/seller/seller-ad-1.1 http://services.mobile.de/schema/seller/seller-ad-1.1.xsd');

    xml.ele(input);

    return xml.end({ pretty: true });
  },


  /**
   * @param input
   * @returns {string}
   */
  sellerToXml: function(input) {

    var xml = builder.create('seller', {
      version: '1.0',
      encoding: 'UTF-8'
    });

    xml
      .att('xmlns', 'http://services.mobile.de/schema/common/seller-2.0')
      .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
      .att('xsi:schemaLocation', 'http://services.mobile.de/schema/common/seller-2.0 http://services.mobile.de/schema/common/seller-2.0.xsd');

    xml.ele(input);

    return xml.end({ pretty: true });
  }

};
