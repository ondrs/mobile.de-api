var MobileApi = require(__dirname + '/../lib/index'),
  Mapper = require(__dirname + '/../lib/mapper'),
  expect = require('chai').expect,
  fs = require('fs');


// Obviously we need to set our credentials

var token = 'E3arEATxgnGlA3GH5LNync1mh38GSS0QnChDB3W82Uq9nSfdjVeh4XC62IHJ77f55i2rtbfGW432h61dI3nQDL7r4huJsX18dw2sKn59ZK7ZF8R8IdOk576PUdSyX3CI4rSG1T0AzHYU04u96KcWvaVqn8By7i5sYUy0r6To5aJaJzv6id4MCVe1LL9LCrh3bZg9tFZA6yH4IgHedvHDOw1odtFsGZ77s5X321TXCxvQO6o64B4iB8H8Kex6Yum',
  url = 'http://sandbox.mobile.de/seller-api',
  sellerKey = 167;


var api = new MobileApi(token, url);

describe('Mobile.de API tests', function () {


  it('should retrieve list of sellers', function (done) {

    api
      .retrieveSellers()
      .then(function (result) {
        expect(result).to.be.an('Array');
        done();
      }, function (err) {
        done(err);
      });
  });


  it('should fetch single seller', function (done) {

    api
      .retrieveSellers(sellerKey)
      .then(function (result) {
        expect(result).to.be.an('object');
        done();
      }, function (err) {
        done(err);
      });
  });


  it('should retrieve list of ads', function (done) {

    api
      .retrieveAds(sellerKey)
      .then(function (result) {
        expect(result).to.be.an('Array');
        done();
      }, function (err) {
        done(err);
      });
  });


  describe('Ad manipulation', function () {

    var adId;
    this.timeout(10000);

    beforeEach(function (done) {

      var xml = fs.readFileSync(__dirname + '/data/ad.xml', 'utf8');

      api
        .createAd(sellerKey, xml)
        .then(function (result) {
          adId = result;
          done();
        }, function (err) {
          done(err);
        });
    });

    afterEach(function (done) {

      api
        .deleteAd(sellerKey, adId)
        .then(function (result) {
          done();
        }, function (err) {
          done(err);
        });
    });


    it('should get a single ad', function (done) {

      api
        .retrieveAds(sellerKey, adId)
        .then(function (result) {
          expect(result).to.be.an('object');
          done();
        }, function (err) {
          done(err);
        });
    });


    it('should update the ad', function (done) {

      var xml = fs.readFileSync(__dirname + '/data/ad.xml', 'utf8');

      api
        .updateAd(sellerKey, adId, xml)
        .then(function (result) {
          done();
        }, function (err) {
          done(err);
        });
    });


    it('should upload images', function (done) {

      var images = [
        __dirname + '/data/1.jpg',
        __dirname + '/data/2.jpg',
        __dirname + '/data/3.jpg'
      ];

      api
        .uploadImages(sellerKey, adId, images)
        .then(function (result) {
          done();
        }, function (err) {
          done(err);
        });
    });


    it('should get images urls', function (done) {

      api
        .getAllImagesUrls(sellerKey, adId)
        .then(function (result) {
          expect(result).to.be.an('Array');
          done();
        }, function (err) {
          done(err);
        });
    });


    it('should delete all images', function (done) {

      api
        .deleteAllImages(sellerKey, adId)
        .then(function (result) {
          done();
        }, function (err) {
          done(err);
        });
    });


  });


});



describe('Mapper tests', function() {

  var ad = require(__dirname + '/data/ad.js');

  it('should map object to an xml', function() {
    var xml = Mapper.toXml(ad);
    console.log(xml);
    expect(xml).to.be.a('string');
  });

});