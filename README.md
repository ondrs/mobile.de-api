# node Mobile.de API [![Build Status](https://travis-ci.org/ondrs/mobile.de-api.svg?branch=master)](https://travis-ci.org/ondrs/mobile.de-api)

Node.js promise based wrapper over Mobile.de API.

## How to install
```
npm install mobile.de-api
```

## Setup

```javascript
var Mobile = require('mobile.de-api'),
  MobileApi = Mobile.Api,
  Mapper = Mobile.Mapper,

var token = '****',
    sellerKey = 123;

var api = new MobileApi(token, sellerKey);
```

