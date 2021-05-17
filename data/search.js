// function getSomething() {
//   return 'hello';
// }
// exports.getSomething = getSomething;

var unirest = require('unirest');

// const rapidKey = '58ae950b1bmsh14bcee45d107fe4p1b83e7jsne1cab43a1126'; // Elisha
const rapidKey = '7f2808d44dmshddd4871847ac607p11876cjsn70d14a52eb70'; // Marc

const resultArray = [];

async function getSearchResult(place, checkIn, checkOut, adults1, callback) {
  let hotels = [];

  var req = unirest('GET', 'https://hotels4.p.rapidapi.com/locations/search');

  req.query({
    query: place,
    locale: 'en_US',
  });

  req.headers({
    'x-rapidapi-key': rapidKey,
    'x-rapidapi-host': 'hotels4.p.rapidapi.com',
    useQueryString: true,
  });

  req.end(async function (result) {
    // console.log(result.body.suggestions[1].entities);
    // console.log(result);
    const hotel = result.body.suggestions[1].entities;
    if (hotel.length === 0) callback([]);
    const amountToShow = 2;
    for (let i = 0; i < amountToShow; i++) {
      console.log(hotel[i].destinationId);
      getPropertiesDetails(
        hotel[i].destinationId,
        checkIn,
        checkOut,
        adults1,
        function (myDataResponse) {
          hotels.push(myDataResponse);
          console.log(myDataResponse);
          console.log(hotels.length);
          if (hotels.length === amountToShow) callback(hotels);
        }
      );
    }

    //   .slice(-2)
    //   .forEach((entity) => {
    //     getPropertiesDetails(
    //       entity.destinationId,
    //       // checkIn,
    //       // checkOut,
    //       // adults1,
    //       function (myDataResponse) {
    //         // console.log(myDataResponse);
    //         hotels.push(myDataResponse);
    //         console.log(hotels);
    //         callback(hotels);
    //       }
    //     );
    //     // hotels.push(entity.destinationId);
    //   });
    // hotels = hotels;
    // console.log(hotel);
  });

  // .end(function (result) {
  //   hotels = hotels;
  //   callback(hotels);
  // });
}

exports.getSearchResult = getSearchResult;

async function getHotelsDetails(destinationId, checkIn, checkOut, adults1) {
  let finalResult = [];
  let hotels = await destinationId.forEach((hotel) => {
    const details = getPropertiesDetails(
      hotel,
      checkIn,
      checkOut,
      adults1,
      function (myDataResponse) {
        finalResult.push(myDataResponse);
      }
    );
  });
  finalResult = finalResult;
  console.log('finalResult: ' + finalResult);
  return finalResult;

  // let data = await unirest
  //   .get('https://hotels4.p.rapidapi.com/locations/search')
  //   .query({
  //     query: place,
  //     locale: 'en_US',
  //   })
  //   .headers({
  //     'x-rapidapi-key': rapidKey,
  //     'x-rapidapi-host': 'hotels4.p.rapidapi.com',
  //     useQueryString: true,
  //   })
  //   .end(function (result) {
  //     // console.log(result.body.suggestions[1].entities);
  //     const hotels = [];
  //     result.body.suggestions[1].entities.slice(-2).forEach(async (entity) => {
  //       hotels.push(entity.destinationId);
  //     });

  //     callback(hotels);
  //   });
}

exports.getHotelsDetails = getHotelsDetails;

async function getPropertiesDetails(
  destinationId,
  checkIn,
  checkOut,
  adults1,
  callback
) {
  // console.log(destinationId, checkIn, checkOut, adults1);

  let searchResult = [];
  let imageArray = [];
  var req = unirest(
    'GET',
    'https://hotels4.p.rapidapi.com/properties/get-hotel-photos'
  );

  req.query({
    id: destinationId,
  });

  req.headers({
    'x-rapidapi-key': rapidKey,
    'x-rapidapi-host': 'hotels4.p.rapidapi.com',
    useQueryString: true,
  });

  // req.end(function (res) {
  //   if (res.error) throw new Error(res.error);

  //   console.log(res.body);
  // });

  req.end(async function (res) {
    console.log('images for ' + destinationId);
    // console.log(res.body.hotelImages);
    const images = await res.body.hotelImages.forEach(
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
    'x-rapidapi-key': rapidKey,
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

    const name = res.body.data.body.propertyDescription.name;
    const address = res.body.data.body.propertyDescription.address.fullAddress;
    const tagLine = res.body.data.body.propertyDescription.tagline[0];
    const rating = res.body.data.body.propertyDescription.starRating;
    let price;
    let priceInfo;
    let totalPrice;
    console.log(res.body.data.body.propertyDescription.featuredPrice);
    if (res.body.data.body.propertyDescription.featuredPrice) {
      price = res.body.data.body.propertyDescription.featuredPrice.currentPrice;
      priceInfo =
        res.body.data.body.propertyDescription.featuredPrice.priceInfo;
      totalPrice =
        res.body.data.body.propertyDescription.featuredPrice.totalPricePerStay;
    } else {
      price = 'no result';
      priceInfo = 'no result';
      totalPrice = 'no result';
    }
    result = {
      locationId: destinationId,
      name: name,
      address: address,
      tagLine: tagLine,
      rating: rating,
      price: price,
      priceInfo: priceInfo,
      totalPrice: totalPrice,
      images: imageArray,
    };
    searchResult = result;
    callback(searchResult);
    // console.log(result);
    // res.send(result);
    // resultArray.push(result);
  });
}
exports.getPropertiesDetails = getPropertiesDetails;

// result.body.suggestions[1].entities;
// console.log(result);
// console.log(result.body.suggestions[1].entities);
// result.body.suggestions[1].entities.forEach(
//   (entity) =>
//   getPropertiesDetails(entity.destinationId, checkIn, checkOut, adults)

// result.body.suggestions[1].entities
//   .slice(-2)
//   .forEach(
//     async (entity) => {
//       const hotel = await getPropertiesDetails(
//         entity.destinationId,
//         checkIn,
//         checkOut,
//         adults1,
//         function (myDataResponse) {
//           return myDataResponse;
//         }
//       );

//       console.log(hotel);

//       resultArray.push(hotel);
//     }

//     // array.slice(-5).forEach()

//     // console.log(
//     //   entity.destinationId
//     // entity.name,
//     // entity.latitude,
//     // entity.latitude
//     // )
//     // Result: the hotel/destinationId's
//   )
//   .then(console.log(resultArray));
// callback(result);
// console.log(resultArray);
//     });
// }

// await getPropertiesDetails(139009, checkIn, checkOut, adults1);
// return console.log({ result: resultArray });
// }

async function testFunction(test, callback) {
  console.log(test);
  const test2 = { name: 'test' };
  callback(test2);
}

exports.testFunction = testFunction;

// async function getPropertiesDetails(
//   destinationId,
//   checkIn,
//   checkOut,
//   adults1,
//   callback
// ) {
//   console.log(destinationId, checkIn, checkOut, adults1);

//   let imageArray = [];
//   var req = unirest(
//     'GET',
//     'https://hotels4.p.rapidapi.com/properties/get-hotel-photos'
//   );

//   req.query({
//     id: destinationId,
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
//     imageArray = imageArray;
//   });

//   var req = unirest(
//     'GET',
//     'https://hotels4.p.rapidapi.com/properties/get-details'
//   );

//   req.query({
//     id: destinationId.toString(),
//     checkIn: checkIn,
//     checkOut: checkOut,
//     currency: 'USD',
//     locale: 'en_US',
//     adults1: adults1,
//   });

//   req.headers({
//     'x-rapidapi-key': '58ae950b1bmsh14bcee45d107fe4p1b83e7jsne1cab43a1126',
//     'x-rapidapi-host': 'hotels4.p.rapidapi.com',
//     useQueryString: true,
//   });

//   //     res.on('data', function(data) {
//   //         body += data;
//   //     });
//   //     res.on('end', function() {
//   //         serverRes.writeHead(200, {'Content-Type': 'text/plain'});
//   //         serverRes.end(body);
//   //     });
//   // });

//   req.end(function (res) {
//     if (res.error) throw new Error(res.error);
//     result = {
//       locationId: destinationId,
//       name: res.body.data.body.propertyDescription.name,
//       address: res.body.data.body.propertyDescription.address.fullAddress,
//       tagLine: res.body.data.body.propertyDescription.tagline[0],
//       rating: res.body.data.body.propertyDescription.starRating,
//       // price: res.body.data.body.propertyDescription.featuredPrice.currentPrice,
//       // priceInfo: res.body.data.body.propertyDescription.featuredPrice.priceInfo,
//       // totalPrice:
//       // res.body.data.body.propertyDescription.featuredPrice.totalPricePerStay,
//       images: imageArray,
//     };
//     callback(result);
//     // console.log(result);
//     // res.send(result);
//     // resultArray.push(result);
//   });
// }
// exports.getPropertiesDetails = getPropertiesDetails;

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

const testtt = [
  {
    locationId: '577877',
    name: 'Paamonim Jerusalem Hotel',
    address: '4 King George Street, Jerusalem, 9422904, Israel',
    tagLine: '<b>City-center hotel, steps from Ben Yehuda Street </b>',
    rating: 0,
    price: { formatted: '$111', plain: 111 },
    priceInfo: 'nightly price per room',
    totalPrice: '(<strong>$223</strong> for 2 nights)',
    images: [
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/d3479f4d_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/24ac465d_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/80d81aa3_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/67a5f023_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/759cf448_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/9f52e771_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/31fd99e7_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/fc038bd3_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/76d1487c_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/6b04f798_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/cf2604b3_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/c0916b3b_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/b79ea7f1_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/ed245c83_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/0cf1fc34_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/3be70026_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/9762f00b_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/756ad1d6_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/b8429001_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/2d7ad534_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/379ba9d2_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/947aacc9_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/717d9e66_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/9b5ad805_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/6e878420_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/f5d559c0_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/9b593eb9_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/1f591514_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/18d400e8_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/5ae84645_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/55bf0869_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/3be14489_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/b6677555_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/00033b62_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/1c346222_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/7ff7d637_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/2949eb63_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/1d384906_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/382252a0_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/1f4f4e4b_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/47c55202_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/0808f1ff_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/84e67eeb_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/457c8a61_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/a406cd1e_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/f6151447_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/722d6d7b_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/e81e2500_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/1ea8d2d1_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/ac4d566a_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/e9148c97_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/cec7fd5f_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/5d9fde7e_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/1d713a3a_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/66fc4649_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/e64436bf_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/8698ccf4_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/29a3eb01_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/6184605b_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/6c1f0a0c_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/ab29fd8f_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/81da11d5_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/c4352bdf_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/b4dac98e_z.jpg',
    ],
  },
][
  ({
    locationId: '577877',
    name: 'Paamonim Jerusalem Hotel',
    address: '4 King George Street, Jerusalem, 9422904, Israel',
    tagLine: '<b>City-center hotel, steps from Ben Yehuda Street </b>',
    rating: 0,
    price: { formatted: '$111', plain: 111 },
    priceInfo: 'nightly price per room',
    totalPrice: '(<strong>$223</strong> for 2 nights)',
    images: [
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/d3479f4d_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/24ac465d_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/80d81aa3_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/67a5f023_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/759cf448_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/9f52e771_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/31fd99e7_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/fc038bd3_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/76d1487c_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/6b04f798_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/cf2604b3_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/c0916b3b_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/b79ea7f1_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/ed245c83_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/0cf1fc34_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/3be70026_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/9762f00b_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/756ad1d6_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/b8429001_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/2d7ad534_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/379ba9d2_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/947aacc9_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/717d9e66_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/9b5ad805_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/6e878420_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/f5d559c0_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/9b593eb9_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/1f591514_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/18d400e8_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/5ae84645_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/55bf0869_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/3be14489_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/b6677555_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/00033b62_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/1c346222_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/7ff7d637_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/2949eb63_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/1d384906_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/382252a0_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/1f4f4e4b_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/47c55202_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/0808f1ff_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/84e67eeb_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/457c8a61_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/a406cd1e_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/f6151447_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/722d6d7b_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/e81e2500_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/1ea8d2d1_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/ac4d566a_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/e9148c97_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/cec7fd5f_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/5d9fde7e_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/1d713a3a_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/66fc4649_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/e64436bf_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/8698ccf4_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/29a3eb01_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/6184605b_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/6c1f0a0c_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/ab29fd8f_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/81da11d5_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/c4352bdf_z.jpg',
      'https://exp.cdn-hotels.com/hotels/15000000/14710000/14708200/14708123/b4dac98e_z.jpg',
    ],
  },
  {
    locationId: '139009',
    name: 'The Inbal Jerusalem',
    address: 'Liberty Bell Park, 3, Jabotinsky St., Jerusalem, 9214502, Israel',
    tagLine:
      '<b>Luxury hotel with full-service spa, connected to the convention center, near Jerusalem Great Synagogue\n' +
      '</b>',
    rating: 5,
    price: { formatted: '$289', plain: 289 },
    priceInfo: 'nightly price per room',
    totalPrice: '(<strong>$577</strong> for 2 nights)',
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
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/03e43d87_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/2ead37d7_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/ab0b751b_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/0abfe5a3_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/d323bef6_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/0ee910f8_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/1f3b83c4_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/6163c51c_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/1db18050_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/9bad63bc_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/bb4a4949_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/f05de4c9_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/8c220407_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/63e1116d_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/83b19da5_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/5050fd08_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/69f52c98_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/3362248d_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/8472d58d_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/3ec919d5_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/08eef763_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/89711eb1_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/192c0355_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/114694d1_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/d4e1020c_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/fc5e65cc_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/0451dfaf_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/9b585029_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/9d58e5d7_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/cc0fa48d_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/91d34d11_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/2d7a2e3f_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/23823a9f_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/96515740_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/baf49f74_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/5652a6c6_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/4c890583_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/16307e43_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/a819095d_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/f6f357b5_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/b306b59f_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/29f2fe0d_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/90bc12f7_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/bde3007e_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/129d41b2_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/405529f1_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/1b07a944_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/56b5892d_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/aee01aab_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/4c063eef_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/8ddae461_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/d566cf1e_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/826d24c0_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/3ee8ceed_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/d5d38118_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/25bbfae1_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/3c5504f9_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/5590f9c9_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/2df33a93_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/2af28d83_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/bf26fdd7_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/adaa9085_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/7a61d499_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/2dac0c53_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/8c7ea37c_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/0f81fec1_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/da6e09b4_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/88521ad5_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/bfdf7675_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/41a74801_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/f1a41b4d_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/5e6bae89_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/ce5ccc6d_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/3e905aaf_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/0ef98220_z.jpg',
      'https://exp.cdn-hotels.com/hotels/1000000/20000/16400/16366/c1f4c010_z.jpg',
    ],
  })
];

const asdf = {
  term: 'Jerusaldem',
  moresuggestions: 25,
  autoSuggestInstance: null,
  trackingID: '60a2d3deeedfb3d3a32783913326e156',
  misspellingfallback: false,
  suggestions: [
    {
      group: 'CITY_GROUP',
      entities: [
        {
          geoId: '1727',
          destinationId: '1633057',
          landmarkCityDestinationId: null,
          type: 'CITY',
          redirectPage: 'DEFAULT_PAGE',
          latitude: 31.78056207219521,
          longitude: 35.21307484443473,
          searchDetail: null,
          caption: 'Jerusalem, Israel',
          name: 'Jerusalem',
        },
        {
          geoId: '553248633981712548',
          destinationId: '10873726',
          landmarkCityDestinationId: null,
          type: 'NEIGHBORHOOD',
          redirectPage: 'DEFAULT_PAGE',
          latitude: 31.779857122285307,
          longitude: 35.21713715893853,
          searchDetail: null,
          caption:
            'Jerusalem City Centre, Jerusalem, Jerusalem District, Israel',
          name: 'Jerusalem City Centre',
        },
        {
          geoId: '6261673',
          destinationId: '1767644',
          landmarkCityDestinationId: null,
          type: 'NEIGHBORHOOD',
          redirectPage: 'DEFAULT_PAGE',
          latitude: 31.77809958780794,
          longitude: 35.2321948616151,
          searchDetail: null,
          caption: 'Old City, Jerusalem, Jerusalem District',
          name: 'Old City',
        },
        {
          geoId: '6004059',
          destinationId: '1808983',
          landmarkCityDestinationId: null,
          type: 'CITY',
          redirectPage: 'DEFAULT_PAGE',
          latitude: 31.77535575598083,
          longitude: 35.23304290002579,
          searchDetail: null,
          caption: 'Jewish Quarter, Jerusalem, Jerusalem District',
          name: 'Jewish Quarter',
        },
        {
          geoId: '553248635964998432',
          destinationId: '12484461',
          landmarkCityDestinationId: null,
          type: 'NEIGHBORHOOD',
          redirectPage: 'DEFAULT_PAGE',
          latitude: 31.778961951148734,
          longitude: 35.22008482978834,
          searchDetail: null,
          caption: 'Mamilla, Jerusalem, Jerusalem District, Israel',
          name: 'Mamilla',
        },
        {
          geoId: '553248634382974174',
          destinationId: '10919130',
          landmarkCityDestinationId: null,
          type: 'CITY',
          redirectPage: 'DEFAULT_PAGE',
          latitude: -33.97705126211297,
          longitude: 137.71450253438917,
          searchDetail: null,
          caption: 'Jerusalem, South Australia, Australia',
          name: 'Jerusalem',
        },
        {
          geoId: '3000453159',
          destinationId: '10425155',
          landmarkCityDestinationId: null,
          type: 'CITY',
          redirectPage: 'DEFAULT_PAGE',
          latitude: 39.851742,
          longitude: -81.092331,
          searchDetail: null,
          caption: 'Jerusalem, Ohio, United States of America',
          name: 'Jerusalem',
        },
        {
          geoId: '553248635976392090',
          destinationId: '12527621',
          landmarkCityDestinationId: null,
          type: 'CITY',
          redirectPage: 'DEFAULT_PAGE',
          latitude: 41.37676849999999,
          longitude: -71.51755749999998,
          searchDetail: null,
          caption:
            'Jerusalem, South Kingstown, Rhode Island, United States of America',
          name: 'Jerusalem',
        },
        {
          geoId: '6144457',
          destinationId: '1696356',
          landmarkCityDestinationId: null,
          type: 'CITY',
          redirectPage: 'DEFAULT_PAGE',
          latitude: 31.817947672921875,
          longitude: 35.11080402535929,
          searchDetail: null,
          caption:
            "Ma'ale Hachamisha, Mateh Yehuda, Jerusalem District, Israel",
          name: "Ma'ale Hachamisha",
        },
        {
          geoId: '553248635964996642',
          destinationId: '11411088',
          landmarkCityDestinationId: null,
          type: 'NEIGHBORHOOD',
          redirectPage: 'DEFAULT_PAGE',
          latitude: 31.741029338773664,
          longitude: 35.21869921847562,
          searchDetail: null,
          caption: 'Ramat Rachel, Jerusalem, Jerusalem District, Israel',
          name: 'Ramat Rachel',
        },
      ],
    },
    { group: 'HOTEL_GROUP', entities: [] },
    {
      group: 'LANDMARK_GROUP',
      entities: [
        {
          geoId: '6167116',
          destinationId: '1720696',
          landmarkCityDestinationId: '1633057',
          type: 'LANDMARK',
          redirectPage: 'DEFAULT_PAGE',
          latitude: 31.775852,
          longitude: 35.217281,
          searchDetail: null,
          caption:
            'Jerusalem Great Synagogue, Jerusalem, Jerusalem District, Israel',
          name: 'Jerusalem Great Synagogue',
        },
        {
          geoId: '553248621561088098',
          destinationId: '10447378',
          landmarkCityDestinationId: '699178',
          type: 'LANDMARK',
          redirectPage: 'DEFAULT_PAGE',
          latitude: 32.074720614276885,
          longitude: 34.7645598930899,
          searchDetail: null,
          caption: 'Jerusalem Beach, Tel Aviv, Tel Aviv District, Israel',
          name: 'Jerusalem Beach',
        },
        {
          geoId: '553248621532390616',
          destinationId: '10603041',
          landmarkCityDestinationId: '1633057',
          type: 'LANDMARK',
          redirectPage: 'DEFAULT_PAGE',
          latitude: 31.774411,
          longitude: 35.222045,
          searchDetail: null,
          caption:
            'Jerusalem International YMCA, Jerusalem, Jerusalem District, Israel',
          name: 'Jerusalem International YMCA',
        },
      ],
    },
    {
      group: 'TRANSPORT_GROUP',
      entities: [
        {
          geoId: '6262219',
          destinationId: '1767974',
          landmarkCityDestinationId: null,
          type: 'TRAIN_STATION',
          redirectPage: 'DEFAULT_PAGE',
          latitude: 31.747945,
          longitude: 35.188565,
          searchDetail: null,
          caption:
            'Jerusalem Malha Station, Jerusalem, Jerusalem District, Israel',
          name: 'Jerusalem Malha Station',
        },
        {
          geoId: '6182035',
          destinationId: '1728087',
          landmarkCityDestinationId: null,
          type: 'METRO_STATION',
          redirectPage: 'DEFAULT_PAGE',
          latitude: 31.81939,
          longitude: 35.240048,
          searchDetail: null,
          caption: "Yekuti'el Adam Station, Jerusalem, Jerusalem District",
          name: "Yekuti'el Adam Station",
        },
      ],
    },
  ],
  geocodeFallback: false,
};
