
/* ***********************
 * Require Statements
 *************************/
const session = require("express-session")
const pool = require('./database/')

const express = require("express")
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config()
const app = express()
const baseController = require("./controllers/baseController") //Added a new require statement to bring the base controller into scope
const utilities = require("./utilities/")  // Added this line to bring the utilities into scope
const bodyParser = require("body-parser")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})


/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"))


//Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

//Inventory routes
app.use("/inv", require("./routes/inventoryRoute"))

//Account Routes
app.use("/account", require("./routes/accountRoute"))



app.use(async (req, res, next) => {
  next({status: ''});
});



/* ***********************
* Express Error Handler
* Place after all other middleware
* Error Handling
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})