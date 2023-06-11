const invModel = require("../models/inventory-model")
const Util = {}


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
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

module.exports = Util


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
module.exports = Util