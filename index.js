// Project Procedures Summary:
// Step 1: installs for package-lock.json, package.json, & dependencies
// 			1) npm install 2) npm init --y 3) npm install nodemon --save -dev 4) npm install express --save -dev 
// 			5) npm install sqlite3 6) npm install knex --save 
// 			7) Add "server": "nodemon index.js", "start": "node index" properties to the "scripts" object in the package.json file.
// Step 2: Set up server in index.js.
// Step 3: Set up welcome folder with welcome-router.js file and import / integrate into index.js (to manually test setup in Insomnia).
// Step 4: Set up knexfile.js. (noting that the filename, migrations, and seeds properties on the development object 
// 			determine the file structure that will be built out as dbs, migrations, and seeds are created).
// Step 5: Set up data/config.js.
// Step 6: Set up migrations folder with: npx knex migrate:make <desired '.db3'-filename> (e.g. <recipes> will produce recipes.db3).
// Step 7: Build data table(s) in migration file created in step 5. 
// Step 8: Create .db3 data-table file by running: npx knex migrate:latest (see Step 5 for .db3 file name)
// Step 9: Check out the newly-created .db3 table on TablePlus (SQL connection) (check both 'exports.up' and 'exports.down'
// 			function expressions with npx knex migrate:latest & npx knex migrate:rollback, respectively).
// Step 10: Import bcrypt (for use in the model file). < npm install bcryptjs >
// Step 11: Set up the users folder and users-model file and write out the helper functions that will be used in the router functions.
// Step 12: Set up the router to perform CRUD operations (using the helper functions from the model file(s) 
// 			and test out the endpoints on Insomnia (to register a user, log a user in, and get a list of users from the db).
// Step 13: Set up users-middelware file in users folder and write out restrict function (to restrict access to get users to authorized
// 			users that are logged in). 
// Step 14: Install express-session, < npm install express-session >, and import in index.js file for server.use call (this will allow
// 			for authorization without verification of user credentials upon every request to the server.)
// Step 15: Add < req.session.user = user > to users-router file (see users-router.js, line 60).
// Step 16: Add session check to users-middleware restrict function (see users-middleware.js, lines 34-38).
// Step 16: Add logout endpoint to router file (ends user sessions and therefore could not be added prior to the introdcution of 
// 			express-session).
// Step 17: Install connect-session-knex, < npm install connect-session-knex >, and import to index.js (this allows for session data to be 
//			stored in the database instead of in local memory).
// Step 18: Import config.js into index.js file, assigning it to a variable name "db" (see index.js, line 43), and add "store" property to
// 			the server.use(session...) call (see index.js, lines 53-56).

// users: 	(1) username: fulano, password: detal
//			(2) username: fulana, password: detaltambien
// 			(3) username: fulanito, password: detallito
// 			(4) username: fulanita, password: detallita

const express = require("express")
const welcomeRouter = require("./welcome/welcome-router")
const usersRouter = require("./users/users-router")
const session = require("express-session")
const KnexSessionStore = require("connect-session-knex")(session)
const db = require("./data/config")

const server = express()
const port = process.env.PORT || 3000

server.use(express.json())
server.use(session({
	resave: false, // avoid creating sessions that haven't changed
	saveUninitialized: false, // GDPR laws against setting cookies automatically
	secret: "keep it secret, keep it safe", // used to crytopgraphically sign the cookie
	store: new KnexSessionStore({
		knex: db, // configured instance of knex
		createtable: true, // if the table does not exist, it will create it automatically
	}),
}))

server.use(welcomeRouter)
server.use(usersRouter)

server.use((err, req, res, next) => {
	console.log(err)
	res.status(500).json({
		message: "Something went wrong",
	})
})

server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`)
})
