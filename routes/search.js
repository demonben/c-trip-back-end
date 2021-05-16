const express = require('express');
const { getSearchResult } = require('../data/search');
const { checkIfAdmin } = require('../data/users');
const { upload } = require('../middlewares/multipart');
const { auth } = require('../middlewares/auth');
const { uploadToCloudinary } = require('../lib/cloudinary');
const fs = require('fs');
const S = require('fluent-json-schema').default;
const validateBody = require('../middlewares/validation');
const router = express.Router();

function isAdmin(req, res, next) {
  const userId = req.user.id;
  const admin = checkIfAdmin(userId);
  if (!admin) {
    res.status(403).send({
      message: 'Only administrators can perform this action',
    });
    return;
  }
  next();
}

router.get('/?', async (req, res) => {
  const { place, checkIn, checkOut, adults } = req.query;
  // const { status } = req.body;
  console.log(place, checkIn, checkOut, adults);
  const results = await getSearchResult(place, checkIn, checkOut, adults);
  res.status(200).send({ searchResult: results });
});

//Frontend:
// const onSubmit = async (event) => {
//   event.preventDefault();
//   const searchQuery = `place=${searchByPlace}&checkIn=${searchByCheckIn}&checkOut=${searchByCheckOut}&adults=${searchByAdults}`;

//   try {
//     const search = await searchPets(searchQuery, auth.token);
//     setSearchPerformed(true);
//     setSearchResult(search.searchResult);
//   } catch (error) {
//     console.log(error);
//   }
// };

// const NewPetValidationSchema = S.object()
//   .prop('name', S.string().minLength(1).required())
//   .prop('type', S.string().minLength(1).required())
//   .prop('breed', S.string())
//   .prop('height', S.number().minimum(0))
//   .prop('weight', S.number().minimum(0))
//   .prop('image', S.object())
//   .prop('hypoallergenic', S.boolean())
//   .prop('diet', S.string())
//   .prop('bio', S.string())
//   .prop('picture_url', S.string())
//   .valueOf();

// router.post(
//   '/',
//   auth,
//   isAdmin,
//   // validateBody(NewPetValidationSchema), // For some reason, this is not working :-(
//   async (req, res, next) => {
//     const {
//       name,
//       type,
//       breed,
//       color,
//       height,
//       weight,
//       hypoallergenic,
//       diet,
//       bio,
//       picture_url,
//     } = req.body;
//     try {
//       await createPet(
//         name,
//         type,
//         breed,
//         color,
//         height,
//         weight,
//         hypoallergenic,
//         diet,
//         bio,
//         picture_url
//       );
//       res.status(201);
//       res.send({
//         pet: {
//           name,
//           type,
//           breed,
//           color,
//           height,
//           weight,
//           hypoallergenic,
//           diet,
//           bio,
//           picture_url,
//         },
//       });
//     } catch (err) {
//       next(err);
//     }
//   }
// );

// 4
router.post(
  '/picture_url',
  auth,
  isAdmin,
  upload.single('image'),
  async (req, res) => {
    const result = await uploadToCloudinary(req.file.path);
    fs.unlinkSync(req.file.path);
    res.status(201).send({ picture_url: result.secure_url });
  }
);

module.exports = router;
