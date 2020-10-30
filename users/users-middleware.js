const bcrypt = require("bcryptjs")
const Users = require("./users-model")

function restrict() {
	// Create a middleware function that restricts routes to authorized users only.
	// It should get the username and password from the request headers.
	return async (req, res, next) => {
		try {
			// const { username, password } = req.headers
			// // make sure they values are not empty
			// if (!username || !password) {
			// 	return res.status(401).json({
			// 		message: "Invalid credentials"
			// 	})
			// }

			// const user = await Users.findBy({ username }).first()
			// if (!user) {
			// 	return res.status(401).json({
			// 		message: "Invalid credentials"
			// 	})
			// }

			// const passwordValid = await bcrypt.compare(password, user.password)
			// if (!passwordValid) {
			// 	return res.status(401).json({
			// 		message: "Invalid credentials"
			// 	})
			// }

			// The above commented-out code is unneccesary with the use of sessions

			// Only the session itself needs to be confirmed, as shown here.
			if (!req.session || !req.session.user) {
				return res.status(401).json({
					message: "You shall not pass!"
				})
			}
			// if everything is validated, we're good to go to next()...
			next()
		} catch (err) {
			next(err)
		}
	}
}

module.exports = {
	restrict,
}