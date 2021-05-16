// function getSomething() {
//   return 'hello';
// }
// exports.getSomething = getSomething;

var unirest = require('unirest');

const rapidKey = '58ae950b1bmsh14bcee45d107fe4p1b83e7jsne1cab43a1126'; // Elisha
// const rapidKey = '7f2808d44dmshddd4871847ac607p11876cjsn70d14a52eb70'; // Marc

const resultArray = [];
const imageArray = [];

async function getSearchResult(place, checkIn, checkOut, adults) {
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
      result.body.suggestions[1].entities.forEach(
        (entity) =>
          console.log(
            entity.destinationId
            // entity.name,
            // entity.latitude,
            // entity.latitude
          ) // Result: the hotel/destinationId's
      );
    });
}

exports.getSearchResult = getSearchResult;

// async function getLocations(query) {
//   let data = await unirest
//     .get('https://hotels4.p.rapidapi.com/locations/search')
//     .query({
//       query: query,
//       locale: 'en_US',
//     })
//     .headers({
//       'x-rapidapi-key': '58ae950b1bmsh14bcee45d107fe4p1b83e7jsne1cab43a1126',
//       'x-rapidapi-host': 'hotels4.p.rapidapi.com',
//       useQueryString: true,
//     })
//     .end(function (result) {
//       console.log(result);
//       console.log(result.body.suggestions[1].entities);
//       result.body.suggestions[1].entities.forEach(
//         (entity) =>
//           console.log(
//             entity.destinationId,
//             entity.name,
//             entity.latitude,
//             entity.latitude
//           ) // Result: the hotel/destinationId's
//       );
//     });
// }

// async function getPropertiesDetails() {
//   var req = unirest(
//     'GET',
//     'https://hotels4.p.rapidapi.com/properties/get-details'
//   );

//   req.query({
//     id: '139009',
//     checkIn: '2021-06-01',
//     checkOut: '2021 -06-03',
//     currency: 'USD',
//     locale: 'en_US',
//     adults1: '1',
//   });

//   req.headers({
//     'x-rapidapi-key': '58ae950b1bmsh14bcee45d107fe4p1b83e7jsne1cab43a1126',
//     'x-rapidapi-host': 'hotels4.p.rapidapi.com',
//     useQueryString: true,
//   });

//   req.end(function (res) {
//     if (res.error) throw new Error(res.error);

//     console.log(res.body.data.body.propertyDescription.name); // name hotel
//     console.log(res.body.data.body.propertyDescription.address.fullAddress); // address
//     console.log(res.body.data.body.propertyDescription.tagline[0]); // tagline

//     console.log(res.body.data.body.propertyDescription.starRating); // rating
//     console.log(
//       res.body.data.body.propertyDescription.featuredPrice.currentPrice
//     ); // price hotel
//     console.log(res.body.data.body.propertyDescription.featuredPrice.priceInfo); // price info
//     console.log(
//       res.body.data.body.propertyDescription.featuredPrice.totalPricePerStay
//     ); // price info
//   });
// }

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
