var Q = require('q'),
  _ = require('underscore'),
  fs = require('fs'),
  path = require('path'),
  mime = require('mime'),
  request = require('request'),
  errorCodes = require('./error-codes'),
  parseString = require('xml2js').parseString,
  Krawler = require('krawler');


/**
 * @param {string} token
 * @param {number?} sellerKey
 * @param {string} baseUrl
 * @constructor
 */
function MobileApi(token, sellerKey, baseUrl) {
  this.token_ = token;
  this.sellerKey_ = sellerKey;
  this.baseUrl_ = baseUrl || 'https://services.mobile.de/seller-api';

  this.krawler_ = new Krawler({
    parser: 'xml',
    headers: {
      'X-MOBILE-SELLER-TOKEN': token
    }
  });

  this.headers_ = {
    'Accept': 'application/xml,text/xml;q=0.9,*/*;q=0.8',
    'X-MOBILE-SELLER-TOKEN': this.token_
  };
}

/**
 * @type {string}
 * @private
 */
MobileApi.prototype.token_;

/**
 * @type {number}
 * @private
 */
MobileApi.prototype.sellerKey_;

/**
 * @type {string}
 * @private
 */
MobileApi.prototype.baseUrl_;

/**
 * @type {Krawler}
 * @private
 */
MobileApi.prototype.krawler_;

/**
 * @type {Object}
 * @private
 */
MobileApi.prototype.headers_;


/**
 * @returns {*}
 */
MobileApi.prototype.retrieveSellers = function () {
  var self = this,
    krawler = _.clone(this.krawler_);

  krawler.options_.headers['Content-Type'] = 'application/vnd.de.mobile.seller-v2.0+xml';

  return krawler
    .fetchUrl(self.baseUrl_ + '/sellers')
    .then(function (result) {
      return Q.resolve(result.data['seller:sellers']['seller:seller'] || []);
    });
};


/**
 * @returns {*}
 */
MobileApi.prototype.retrieveCurrentSeller = function () {
  var self = this,
    krawler = _.clone(this.krawler_);

  krawler.options_.headers['Content-Type'] = 'application/vnd.de.mobile.seller-v2.0+xml';

  return krawler
    .fetchUrl(self.baseUrl_ + '/sellers/' + self.sellerKey_)
    .then(function (result) {
      return Q.resolve(result.data['seller:seller']);
    });
};


/**
 * @param {number=} adId
 * @returns {*}
 */
MobileApi.prototype.retrieveAds = function (adId) {
  var self = this,
    krawler = _.clone(this.krawler_);

  krawler.options_.headers['Content-Type'] = 'application/vnd.de.mobile.seller-ad-v1.1+xml';

  if (adId) {

    return krawler
      .fetchUrl(self.baseUrl_ + '/sellers/' + self.sellerKey_ + '/ads/' + adId)
      .then(function (result) {
        return Q.resolve(result.data['seller-ad:ad']);
      });

  } else {

    return krawler
      .fetchUrl(self.baseUrl_ + '/sellers/' + self.sellerKey_ + '/ads')
      .then(function (result) {
        return Q.resolve(result.data['seller-ad:ads']['seller-ad:ad'] || []);
      });
  }
};


/**
 * @param {Object} ad
 * @returns {Q.promise}
 */
MobileApi.prototype.createAd = function (ad) {
  var self = this,
    deferred = Q.defer();

  var headers = _.clone(self.headers_);
  headers['Content-Type'] = 'application/vnd.de.mobile.seller-ad-v1.1+xml';

  request({
    method: 'POST',
    url: self.baseUrl_ + '/sellers/' + self.sellerKey_ + '/ads',
    body: ad,
    headers: headers
  }, function (err, response, body) {

    if (err) {
      deferred.reject(err);
      return;
    }

    if (response.statusCode == 400) {

      parseString(body, function (err, result) {
        if (err) {
          deferred.reject(err);
          return;
        }

        try {
          result = result['error:errors']['error:error'].map(function (i) {
            return errorCodes[i.$.key] || i.$.key;
          });

          deferred.reject(result);
        } catch (e) {
          deferred.reject(e);
        }

      });

      return;
    }

    if (response.statusCode == 404) {
      deferred.reject('You provided a wrong seller-key.');
      return;
    }

    if (response.statusCode != 201) {
      deferred.reject('Wrong response code: ' + response.statusCode);
      return;
    }

    try {
      var parts = response.headers.location.split('/');
      deferred.resolve(parts[parts.length - 1]);
    } catch (e) {
      deferred.reject(e);
    }
  });

  return deferred.promise;
};


/**
 * @param {number} adId
 * @param {Object} ad
 * @returns {Q.promise}
 */
MobileApi.prototype.updateAd = function (adId, ad) {
  var self = this,
    deferred = Q.defer();

  var headers = _.clone(self.headers_);
  headers['Content-Type'] = 'application/vnd.de.mobile.seller-ad-v1.1+xml';

  request({
    method: 'PUT',
    url: self.baseUrl_ + '/sellers/' + self.sellerKey_ + '/ads/' + adId,
    body: ad,
    headers: headers
  }, function (err, response, body) {

    if (err) {
      deferred.reject(err);
      return;
    }

    if (response.statusCode == 400) {

      parseString(body, function (err, result) {
        if (err) {
          deferred.reject(err);
          return;
        }

        try {
          result = result['error:errors']['error:error'].map(function (i) {
            return errorCodes[i.$.key] || i.$.key;
          });
          deferred.reject(result);
        } catch (e) {
          deferred.reject(e);
        }

      });

      return;
    }

    if (response.statusCode == 404) {
      deferred.reject('You provided a wrong seller-key or a wrong ad-key.');
      return;
    }

    if (response.statusCode != 200) {
      deferred.reject('Wrong response code: ' + response.statusCode);
      return;
    }

    deferred.resolve(adId)
  });

  return deferred.promise;
};


/**
 * @param {number} adId
 * @returns {Q.promise}
 */
MobileApi.prototype.deleteAd = function (adId) {
  var self = this,
    deferred = Q.defer();

  var headers = _.clone(self.headers_);
  headers['Content-Type'] = 'application/vnd.de.mobile.seller-ad-v1.1+xml';

  request({
    method: 'DELETE',
    url: self.baseUrl_ + '/sellers/' + self.sellerKey_ + '/ads/' + adId,
    headers: headers
  }, function (err, response, body) {

    if (err) {
      deferred.reject(err);
      return;
    }

    if (response.statusCode == 404) {
      deferred.reject('The ad either has already been deleted or you provided a wrong seller-key or a wrong ad-key.');
      return;
    }

    if (response.statusCode != 200) {
      deferred.reject('Wrong response code: ' + response.statusCode);
      return;
    }

    deferred.resolve();
  });

  return deferred.promise;
};


/**
 * @param {number=} adId
 * @returns {*}
 */
MobileApi.prototype.getAllImagesUrls = function (adId) {
  var self = this,
    krawler = _.clone(this.krawler_);

  krawler.options_.headers['Content-Type'] = 'application/vnd.de.mobile.seller-ad-v1.1+xml';

  return krawler
    .fetchUrl(self.baseUrl_ + '/sellers/' + self.sellerKey_ + '/ads/' + adId + '/images')
    .then(function (result) {

      if (!result.data['seller-ad:images']['seller-ad:image']) {
        return Q.resolve([]);
      }

      try {
        result = result.data['seller-ad:images']['seller-ad:image'].map(function (i) {
          return i.$.ref;
        });

        return Q.resolve(result);

      } catch (e) {
        return Q.reject(e);
      }

    });

};


/**
 * @param {number} adId
 * @returns {Q.promise}
 */
MobileApi.prototype.deleteAllImages = function (adId) {
  var self = this,
    deferred = Q.defer();

  var headers = _.clone(self.headers_);
  headers['Content-Type'] = 'application/vnd.de.mobile.seller-ad-v1.1+xml';

  request({
    method: 'DELETE',
    url: self.baseUrl_ + '/sellers/' + self.sellerKey_ + '/ads/' + adId + '/images',
    headers: headers
  }, function (err, response, body) {

    if (err) {
      deferred.reject(err);
      return;
    }

    if (response.statusCode == 404) {
      deferred.reject('The ad either has already been deleted or you provided a wrong seller-key or a wrong ad-key.');
      return;
    }

    if (response.statusCode != 204) {
      deferred.reject('Wrong response code: ' + response.statusCode);
      return;
    }

    deferred.resolve();
  });

  return deferred.promise;
};


/**
 * @param {number} adId
 * @param {Array} images
 * @returns {Q.promise}
 */
MobileApi.prototype.uploadImages = function (adId, images) {
  var self = this,
    deferred = Q.defer(),
    data = [];

  var headers = _.clone(self.headers_);
  headers['Accept'] = 'application/vnd.de.mobile.seller-ad-v1.1+xml';
  headers['Content-Type'] = 'multipart/form-data';

  images.forEach(function (i) {
    data.push({
      'Content-Disposition': 'form-data; name="image"; filename="' + path.basename(i) + '"',
      'Content-Type': mime.lookup(i),
      'body': fs.readFileSync(i)
    });
  });

  request({
    method: 'PUT',
    url: self.baseUrl_ + '/sellers/' + self.sellerKey_ + '/ads/' + adId + '/images',
    headers: headers,
    multipart: data
  }, function (err, response, body) {

    if (err) {
      deferred.reject(err);
      return;
    }

    if (response.statusCode == 400) {

      parseString(body, function (err, result) {
        if (err) {
          deferred.reject(err);
          return;
        }

        try {
          result = result['error:errors']['error:error'].map(function (i) {
            return errorCodes[i.$.key] || i.$.key;
          });

          deferred.reject(result);
        } catch (e) {
          deferred.reject(e);
        }

      });

      return;
    }

    if (response.statusCode == 404) {
      deferred.reject('You provided a wrong seller-key or a wrong ad-key.');
      return;
    }

    if (response.statusCode != 200) {
      deferred.reject('Wrong response code: ' + response.statusCode);
      return;
    }

    parseString(body, function (err, result) {
      if (err) {
        deferred.reject(err);
        return;
      }

      try {
        deferred.resolve(result)
      } catch (e) {
        deferred.reject(e);
      }
    });

  });

  return deferred.promise;
};


module.exports = MobileApi;
