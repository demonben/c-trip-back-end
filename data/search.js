// function getSomething() {
//   return 'hello';
// }
// exports.getSomething = getSomething;

var unirest = require('unirest');

const rapidKey = '58ae950b1bmsh14bcee45d107fe4p1b83e7jsne1cab43a1126'; // Elisha
// const rapidKey = '7f2808d44dmshddd4871847ac607p11876cjsn70d14a52eb70'; // Marc

const resultArray = [];

async function getSearchResult(place, checkIn, checkOut, adults1, callback) {
  let data = await unirest
    .get('https://hotels4.p.rapidapi.com/locations/search')
    .query({
      query: place,
      locale: 'en_US',
    })
    .headers({
      'x-rapidapi-key': rapidKey,
      'x-rapidapi-host': 'hotels4.p.rapidapi.com',
      useQueryString: true,
    })
    .end(function (result) {
      // console.log(result);
      // console.log(result.body.suggestions[1].entities);
      // result.body.suggestions[1].entities.forEach(
      //   (entity) =>
      //   getPropertiesDetails(entity.destinationId, checkIn, checkOut, adults)

      result.body.suggestions[1].entities
        .slice(-2)
        .forEach(
          async (entity) => {
            const hotel = await getPropertiesDetails(
              entity.destinationId,
              checkIn,
              checkOut,
              adults1,
              function (myDataResponse) {
                return myDataResponse;
              }
            );

            console.log(hotel);

            resultArray.push(hotel);
          }

          // array.slice(-5).forEach()

          // console.log(
          //   entity.destinationId
          // entity.name,
          // entity.latitude,
          // entity.latitude
          // )
          // Result: the hotel/destinationId's
        )
        .then(console.log(resultArray));

      console.log(resultArray);
    });
}

// await getPropertiesDetails(139009, checkIn, checkOut, adults1);
// return console.log({ result: resultArray });
// }

exports.getSearchResult = getSearchResult;

async function getPropertiesDetails(
  destinationId,
  checkIn,
  checkOut,
  adults1,
  callback
) {
  console.log(destinationId, checkIn, checkOut, adults1);
  let result = {};
  let imageArray = [];
  var req = unirest(
    'GET',
    'https://hotels4.p.rapidapi.com/properties/get-hotel-photos'
  );

  req.query({
    id: destinationId,
  });

  req.headers({
    'x-rapidapi-key': '58ae950b1bmsh14bcee45d107fe4p1b83e7jsne1cab43a1126',
    'x-rapidapi-host': 'hotels4.p.rapidapi.com',
    useQueryString: true,
  });

  // req.end(function (res) {
  //   if (res.error) throw new Error(res.error);

  //   console.log(res.body);
  // });

  req.end(function (res) {
    const images = res.body.hotelImages.forEach(
      (image) => imageArray.push(image.baseUrl.replace('{size}', 'z')) // Result: the hotel/destinationId's
    );

    // res.send({ images: images });
    imageArray = imageArray;
  });

  var req = unirest(
    'GET',
    'https://hotels4.p.rapidapi.com/properties/get-details'
  );

  req.query({
    id: destinationId.toString(),
    checkIn: checkIn,
    checkOut: checkOut,
    currency: 'USD',
    locale: 'en_US',
    adults1: adults1,
  });

  req.headers({
    'x-rapidapi-key': '58ae950b1bmsh14bcee45d107fe4p1b83e7jsne1cab43a1126',
    'x-rapidapi-host': 'hotels4.p.rapidapi.com',
    useQueryString: true,
  });

  //     res.on('data', function(data) {
  //         body += data;
  //     });
  //     res.on('end', function() {
  //         serverRes.writeHead(200, {'Content-Type': 'text/plain'});
  //         serverRes.end(body);
  //     });
  // });

  req.end(function (res) {
    if (res.error) throw new Error(res.error);
    result = {
      locationId: destinationId,
      name: res.body.data.body.propertyDescription.name,
      address: res.body.data.body.propertyDescription.address.fullAddress,
      tagLine: res.body.data.body.propertyDescription.tagline[0],
      rating: res.body.data.body.propertyDescription.starRating,
      price: res.body.data.body.propertyDescription.featuredPrice.currentPrice,
      priceInfo: res.body.data.body.propertyDescription.featuredPrice.priceInfo,
      totalPrice:
        res.body.data.body.propertyDescription.featuredPrice.totalPricePerStay,
      images: imageArray,
    };
    callback(result);
    console.log(result);
    // res.send(result);
    // resultArray.push(result);
  });
}

// async function getPropertiesPhotos() {

//   var req = unirest(
//     'GET',
//     'https://hotels4.p.rapidapi.com/properties/get-hotel-photos'
//   );

//   req.query({
//     id: '139009',
//   });

//   req.headers({
//     'x-rapidapi-key': '58ae950b1bmsh14bcee45d107fe4p1b83e7jsne1cab43a1126',
//     'x-rapidapi-host': 'hotels4.p.rapidapi.com',
//     useQueryString: true,
//   });

//   // req.end(function (res) {
//   //   if (res.error) throw new Error(res.error);

//   //   console.log(res.body);
//   // });

//   req.end(function (res) {
//     const images = res.body.hotelImages.forEach(
//       (image) => imageArray.push(image.baseUrl.replace('{size}', 'z')) // Result: the hotel/destinationId's
//     );

//     // res.send({ images: images });
//     console.log(imageArray);
//     return images;
//   });
// }

const resultObjectTest = {
  results: [
    {
      locationId: 139009,
      name: 'The Inbal Jerusalem',
      address:
        'Liberty Bell Park, 3, Jabotinsky St., Jerusalem, 9214502, Israel',
      tagLine:
        '<b>Luxury hotel with full-service spa, connected to the convention center, near Jerusalem Great Synagogue</b>',
      rating: 5,
      price: { formatted: '$287', plain: 287 },
      priceInfo: 'nightly price per room',
      totalPrice: '(<strong>$574</strong> for 2 nights)',
      images: [
        'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/3e55f86d_z.jpg',
        'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/c50b8fb9_z.jpg',
        'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/a959563c_z.jpg',
        'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/f6d1907a_z.jpg',
        'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/8cd72c68_z.jpg',
        'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/0f80fecd_z.jpg',
        'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/be9d1046_z.jpg',
        'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/89e88e9e_z.jpg',
        'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/ab1dbbf7_z.jpg',
        'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/37025150_z.jpg',
      ],
    },

    {
      locationId: 139009,
      name: 'The Inbal2 Jerusalem',
      address:
        'Liberty Bell Park, 3, Jabotinsky St., Jerusalem, 9214502, Israel',
      tagLine:
        '<b>Luxury hotel with full-service spa, connected to the convention center, near Jerusalem Great Synagogue</b>',
      rating: 5,
      price: { formatted: '$287', plain: 287 },
      priceInfo: 'nightly price per room',
      totalPrice: '(<strong>$574</strong> for 2 nights)',
      images: [
        'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/3e55f86d_z.jpg',
        'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/c50b8fb9_z.jpg',
        'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/a959563c_z.jpg',
        'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/f6d1907a_z.jpg',
        'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/8cd72c68_z.jpg',
        'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/0f80fecd_z.jpg',
        'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/be9d1046_z.jpg',
        'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/89e88e9e_z.jpg',
        'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/ab1dbbf7_z.jpg',
        'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/37025150_z.jpg',
      ],
    },
  ],
};

const objectTest = {
  status: 'success',
  result: [
    {
      id: 'QbnNNurJWh',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.667654Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 24,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: ['targetTemperature'],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: 'awZB3vVckq',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.667736Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 23,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: ['fanLevel'],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: 'epwtjDNj3d',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.667778Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 23,
        temperatureUnit: 'C',
        fanLevel: 'strong',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: [],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: 'bQ9CmZRhRH',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.667817Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 23,
        temperatureUnit: 'C',
        fanLevel: 'strong',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: [],
      reason: 'ExternalIrCommand',
      failureReason: null,
    },
    {
      id: '2Snnkf3kjD',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.667855Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 23,
        temperatureUnit: 'C',
        fanLevel: 'strong',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: ['fanLevel'],
      reason: 'ExternalIrCommand',
      failureReason: null,
    },
    {
      id: 'LpjDBeNfZy',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.667890Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 23,
        temperatureUnit: 'C',
        fanLevel: 'low',
      },
      changedProperties: [],
      reason: 'ScheduledCommand',
      failureReason: null,
    },
    {
      id: 'hjhutowhnc',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.667926Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 23,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: ['on'],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: '8wHdgjNzG8',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.667962Z', secondsAgo: 0 },
        on: false,
        mode: 'cool',
        targetTemperature: 23,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: ['on'],
      reason: 'ScheduledCommand',
      failureReason: null,
    },
    {
      id: 'CnRiHZKDeU',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.667997Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 23,
        temperatureUnit: 'C',
        fanLevel: 'low',
      },
      changedProperties: ['targetTemperature'],
      reason: 'ScheduledCommand',
      failureReason: null,
    },
    {
      id: '3ozMEf3moJ',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.668032Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 25,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: [],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: 'V58GzDmdrx',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.668069Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 25,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: [],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: '9Vbu3Vm4fA',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.668105Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 25,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: ['on'],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: '7i38iXvdSc',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.668141Z', secondsAgo: 0 },
        on: false,
        mode: 'cool',
        targetTemperature: 25,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: [],
      reason: 'ExternalIrCommand',
      failureReason: null,
    },
    {
      id: '6U4YpUQLhY',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.668178Z', secondsAgo: 0 },
        on: false,
        mode: 'cool',
        targetTemperature: 25,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: ['on'],
      reason: 'ExternalIrCommand',
      failureReason: null,
    },
    {
      id: 'HgHg8wvyA7',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.668215Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 25,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: ['targetTemperature'],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: '8QzDEyCoY9',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.668252Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 24,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: ['targetTemperature'],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: 'NQKqmiKuDG',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.668303Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 25,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: [],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: '4QzWavE9aE',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.668370Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 25,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: ['on'],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: 'ehCawXdcdt',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.668415Z', secondsAgo: 0 },
        on: false,
        mode: 'cool',
        targetTemperature: 25,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: ['on'],
      reason: 'ScheduledCommand',
      failureReason: null,
    },
    {
      id: 'eLWPQ6mB3j',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.668456Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 25,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: [],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: 'eTboHjgcEz',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.668496Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 25,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: [],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: '8X4P4mHgnt',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.668533Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 25,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: [],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: 'ETgNJhqQnE',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.668569Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 25,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: ['targetTemperature'],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: 'jPSU9EAKDG',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.668605Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 24,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: ['fanLevel'],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: 'dh6k8SHAtD',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.668641Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 24,
        temperatureUnit: 'C',
        fanLevel: 'strong',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: ['on'],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: 'PrKAeYQRWF',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.668678Z', secondsAgo: 0 },
        on: false,
        mode: 'cool',
        targetTemperature: 24,
        temperatureUnit: 'C',
        fanLevel: 'strong',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: [],
      reason: 'ExternalIrCommand',
      failureReason: null,
    },
    {
      id: 'B742vU4wes',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.668715Z', secondsAgo: 0 },
        on: false,
        mode: 'cool',
        targetTemperature: 24,
        temperatureUnit: 'C',
        fanLevel: 'strong',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: [],
      reason: 'ScheduledCommand',
      failureReason: null,
    },
    {
      id: 'njhELUjy9r',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.668760Z', secondsAgo: 0 },
        on: false,
        mode: 'cool',
        targetTemperature: 24,
        temperatureUnit: 'C',
        fanLevel: 'strong',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: ['fanLevel'],
      reason: 'ExternalIrCommand',
      failureReason: null,
    },
    {
      id: '8GD9gZVkok',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.668824Z', secondsAgo: 0 },
        on: false,
        mode: 'cool',
        targetTemperature: 24,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: ['on'],
      reason: 'ExternalIrCommand',
      failureReason: null,
    },
    {
      id: 'AExwq7dwgb',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.668886Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 24,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: ['on'],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: 'KEurSP5adY',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.668940Z', secondsAgo: 0 },
        on: false,
        mode: 'cool',
        targetTemperature: 24,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: ['on'],
      reason: 'ScheduledCommand',
      failureReason: null,
    },
    {
      id: '4LG6MJE4tV',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.668979Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 24,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: [],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: 'TcsNF6s5mj',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.669021Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 24,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: ['on'],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: '55sicSYzYT',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.669064Z', secondsAgo: 0 },
        on: false,
        mode: 'cool',
        targetTemperature: 24,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: ['on'],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: 'UWEGuCTjUQ',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.669114Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 24,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: [],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: 'cBxfEyKcVb',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.669154Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 24,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: ['on'],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: 'juJKD6WLMP',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.669193Z', secondsAgo: 0 },
        on: false,
        mode: 'cool',
        targetTemperature: 24,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: [],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: '6WeVeYTmqU',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.669229Z', secondsAgo: 0 },
        on: false,
        mode: 'cool',
        targetTemperature: 24,
        temperatureUnit: 'C',
        fanLevel: 'low',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: ['fanLevel'],
      reason: 'UserRequest',
      failureReason: null,
    },
    {
      id: 'QCaUPNMLuY',
      status: 'Failed',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.669267Z', secondsAgo: 0 },
        on: true,
        mode: 'cool',
        targetTemperature: 24,
        temperatureUnit: 'C',
        fanLevel: 'medium',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: [],
      reason: 'UserRequest',
      failureReason: 'Timeout',
    },
    {
      id: 'kbtYc44qZr',
      status: 'Success',
      acState: {
        timestamp: { time: '2021-05-16T11:17:21.669315Z', secondsAgo: 0 },
        on: false,
        mode: 'cool',
        targetTemperature: 24,
        temperatureUnit: 'C',
        fanLevel: 'medium',
        swing: 'stopped',
        horizontalSwing: 'stopped',
        light: 'on',
      },
      changedProperties: ['on'],
      reason: 'UserRequest',
      failureReason: null,
    },
  ],
  moreResults: true,
};
