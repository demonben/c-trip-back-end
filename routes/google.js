const express = require('express');
const User = require('../models/user-model');
const router = express.Router();

router.post("/", async (req, res, next) => {
	const { firstName, lastName, email } = req.body;
    const emailAlreadyExists = await User.findOne({ email: email });

    // if ( !firstName || !lastName || !email ) {
    //     return res.status(400).send({
    //         success: false,
    //         error: "No user information provided",
    //     })
    // }
    // if ( emailAlreadyExists ) {
    //     return res.status(400).send({
    //         message: 'An account with this email address already exists. The user is already in the DB'
    //     })
    // }

	try {
		const newUser = await User.create({
			firstName,
			lastName,
			email,
		});
		console.log(newUser);
		res.send({message: "user added", user: newUser});
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
