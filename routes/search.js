const express = require('express');
const { getSearchResult } = require('../data/search');
const { auth } = require('../middlewares/auth');
const router = express.Router();

// search query: 127.0.0.1:5500/search?place=Jerusalem&checkIn=2021-06-01&checkOut=2021-06-03&adults1=1

router.get('/?', async (req, res) => {
  const { place, checkIn, checkOut, adults1 } = req.query;
  try {
    const hotels = getSearchResult(
      place,
      checkIn,
      checkOut,
      adults1,
      function (myDataResponse) {
        res.status(200).send({ results: myDataResponse });
      }
    );
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

module.exports = router;
