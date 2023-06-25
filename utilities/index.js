const invModel = require("../models/inventory-model")
const accModel = require("../models/account-model")
const Util = {}
const jwt = require("jsonwebtoken") //Unit 5
const env = require("dotenv").config()    //Unit 5


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity  Unit 5
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
        req.flash("Please log in")
        res.clearCookie("jwt")
        return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
      next()
  }
 }


/* **************************************
* Build the classification view HTML
* ************************************ */

Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}



//Step

/* **************************************
* Build the vehicle info view HTML
* ************************************ */
Util.buildVehicleInfoGrid = async function(data){
  let infoView 
  if(data.length > 0){
    let vehicle = data[0]
    infoView = '<div class="flex-container">'
    infoView += '<div class="vehicle-image">'
    infoView += '<img src="' + vehicle.inv_image 
    +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
    +' on CSE Motors" />'
    infoView += '</div>'
    infoView += '<div class="vehicle-details">'
    infoView += '<h3 class="vehicle-make-model">' + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + '  ($' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + ')</h3>'
    infoView += '<div class="vehicle-specs">'
    infoView += '<p><strong>Mileage </strong>: ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>'
    infoView += '<p><strong>Color </strong>: ' + vehicle.inv_color + '</p>'
    infoView += '<p><strong>Year </strong>: ' + vehicle.inv_year + '</p>'
    infoView += '<p><strong>Make </strong>: ' + vehicle.inv_make + '</p>'
    infoView += '<p><strong>Model </strong>: ' + vehicle.inv_model + '</p>'
    infoView += '<p><strong>Drive train </strong>: All wheel drive</p>'
    infoView += '<p><strong>Description </strong>: ' + vehicle.inv_description + '</p>'
    infoView += '</div>'
    infoView += '</div>'
    infoView += '</div>'
  } else { 
    infoView += '<p class="notice">Sorry, no matching vehicle could be found for the supplied id.</p>'
  }
  return infoView
}

/***************************************
    * Build the classification list view HTML
* ************************************ */

Util.buildClassificationList = async function(){
  let classification = await invModel.getClassifications()
  let list
  if(classification.length > 0){
    list = '<select id="classificationList" name="classification_id">'
    classification.forEach(item => {
      list += '<option value="' + item.classification_id +'">'
      list += item.classification_name
      list += '</option>'
    })
    list += '</select>'
  } else {
    list += '<p class="notice">No classification.</p>'
  }
  return list
}

/* ****************************************
 *  Check Login  Unit 5
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Middleware to Check user account type
 * ************************************ */
Util.checkUserAccountType = (req, res, next) => {
  if (['Admin', 'Employee'].includes(res.locals.accountData.account_type)) {
    next()
  } else {
    req.flash("notice", "Only Admins and Employees are allowed to visit this route.")
    return res.redirect("/account")
  }
}

Util.checkExistingEmail = async (req, res, next) => {
  const account_email = req.body.account_email;
  const result = await accModel.checkExistingEmail(account_email)
  // if(result < 1 || (result === 1 && req.body.account_email === res.locals.accountData.account_email)){
  //   next()
  // }
  if(result < 1){
    next()
  }
  else {
    req.flash("notice", "Email already exists.")
    return res.redirect("/account/update-information")
  }
}

/* ****************************************
* Middleware to check token validity  Unit 5
**************************************** */
Util.logout = (req, res, next) => {
  if (req.cookies.jwt) {
    res.locals.accountData = null
    res.locals.loggedin = 0
    req.flash("Logged out")
    res.clearCookie("jwt")
    return res.redirect("/")
  }
}

module.exports = Util