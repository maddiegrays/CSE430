
/* ***********************
 * Require Statements
 *************************/

// This is the one shown in the video by prof  https://www.youtube.com/watch?v=KESjrocakuI
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config()
const app = express()
const baseController = require("./controllers/baseController") //Added a new require statement to bring the base controller into scope
const utilities = require("./utilities/")  // Added this line to bring the utilities into scope

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")


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