const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invCont = {}

/* ***************************
 *  Build vehicles by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
  
}

/* ***************************
 *  Build Inventory view
 * ************************** */

invCont.buildByVehicleInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getVehicleInfoByInventorynId(inventory_id)
  const infoView = await utilities.buildVehicleInfoGrid(data)
  let nav = await utilities.getNav()
  res.render("./inventory/vehicle-info", {
    title: data[0]?.inv_make + " " + data[0]?.inv_model,
    nav,
    infoView,
  })
}





module.exports = invCont








