const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0]?.classification_name ?? 'No'
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}



//step 
/* ***************************
 *  Deliver Item Detail view
 * ************************** */
invCont.buildByVehicleInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getVehicleInfoByInventoryId(inventory_id)
  const infoView = await utilities.buildVehicleInfoGrid(data)
  let nav = await utilities.getNav()
  res.render("./inventory/vehicle-info", {
    title: data[0]?.inv_make + " " + data[0]?.inv_model,
    nav,
    infoView,
  })
}

/* ***************************
 *  Management view
 * ************************** */
invCont.buildManagement = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Add new classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add new classification",
    nav,
    errors: null,
  })
}

invCont.createNewClassification = async function (req, res) {
  const { name } = req.body;
  const result = await invModel.addClassification(name);
  console.log(result)
  let nav = await utilities.getNav()
  req.flash(
      "info",
      `Congratulations, you\'ve created a new classification ${name}.`
  )
  res.redirect("/inv")
}

/* ***************************
 *  Add new classification view
 * ************************** */
invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classifications = await invModel.getClassifications();
  console.log(classifications.rows)
  res.render("inventory/add-inventory", {
    title: "Add new inventory",
    nav,
    classifications: classifications.rows,
    errors: null,
  })
}

/* ***************************
 *  Add new classification view
 * ************************** */
invCont.createNewInventory = async function (req, res) {
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_year,
    inv_color,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    classification_id
  } = req.body;
  const result = await invModel.addInventory({
    inv_make, inv_model, inv_description, inv_year, inv_color, inv_image,
    inv_thumbnail, inv_price, inv_miles, classification_id
  });
  console.log(result)
  let nav = await utilities.getNav()
  req.flash(
      "info",
      `Congratulations, you\'ve created a new inventory ${inv_make} ${inv_model}.`
  )
  res.redirect("/inv")
}

module.exports = invCont




