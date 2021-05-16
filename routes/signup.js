const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user-model');

const router = express.Router();

// implement when the user sign up with google --> the email has to be in the DB

router.post("/", async (req, res, next) => {
	const { firstName, lastName, email, password, phoneNumber } = req.body;
    const emailAlreadyExists = await User.findOne({ email: email });

    if ( !firstName || !lastName || !email || !password ) {
        return res.status(400).send({
            success: false,
            error: "No user information provided",
        })
    }
    if ( emailAlreadyExists ) {
        return res.status(400).send({
            success: false,
            error: 'An account with this email address already exists. Please choose a different email address or try to log in instead.'
        })
    }

	const hashedPassword = await bcrypt.hash(password, 8);
	try {
		const newUser = await User.create({
			firstName,
			lastName,
			email,
			passwordHash: hashedPassword,
			phoneNumber,
		});
		console.log(newUser);
		res.send(newUser);
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
