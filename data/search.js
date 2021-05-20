var unirest = require('unirest');

const rapidKey = process.env.API_KEY;
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
    // if (result.error) callback(error);
    // if (result.error) console.log(error);
    if (result.error) throw new Error(result.error);
    const hotel = await result.body.suggestions[1].entities;
    if (hotel.length === 0) callback([]);
    const amountToShow = hotel.length < 3 ? hotel.length : 3;
    for (let i = 0; i < amountToShow; i++) {
      getPropertiesDetails(
        hotel[i].destinationId,
        checkIn,
        checkOut,
        adults1,
        function (myDataResponse) {
          hotels.push(myDataResponse);
          if (hotels.length === amountToShow) callback(hotels);
        }
      );
    }
  });
}

exports.getSearchResult = getSearchResult;

async function getPropertiesDetails(
  destinationId,
  checkIn,
  checkOut,
  adults1,
  callback
) {
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

  req.end(async function (res) {
    try {
      setTimeout(async function () {
        const result = await res.body;
        const images = await result.hotelImages.forEach(
          (image) => imageArray.push(image.baseUrl.replace('{size}', 'z')) // Result: the hotel/destinationId's
        );
        imageArray = imageArray;
      }, 500);
    } catch (error) {
      console.log(error);
    }
  });

  var req = unirest(
    'GET',
    'https://hotels4.p.rapidapi.com/properties/get-details'
  );
  setTimeout(function () {
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

    req.end(function (res) {
      if (result.error) throw new Error(result.error);
      const name = res.body.data.body.propertyDescription.name;
      const address =
        res.body.data.body.propertyDescription.address.fullAddress;
      const tagLine = res.body.data.body.propertyDescription.tagline[0];
      const rating = res.body.data.body.propertyDescription.starRating;
      let price;
      let priceInfo;
      let totalPrice;
      if (res.body.data.body.propertyDescription.featuredPrice) {
        price =
          res.body.data.body.propertyDescription.featuredPrice.currentPrice;
        priceInfo =
          res.body.data.body.propertyDescription.featuredPrice.priceInfo;
        totalPrice =
          res.body.data.body.propertyDescription.featuredPrice
            .totalPricePerStay;
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
    });
  }, 1000);
}

exports.getPropertiesDetails = getPropertiesDetails;
