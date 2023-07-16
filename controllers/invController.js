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
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationsSelect = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationsSelect,    //ADJUSTED      //Unit 5
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
  const select = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add new inventory",
    nav,
    select,
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


/* ***************************
 *  Return Inventory by Classification As JSON  Unit 5
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res) {
  const inventory_id = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav()
  const inventory = await invModel.getVehicleInfoByInventoryId(inventory_id)
  const select = await utilities.buildClassificationList()
  const name = inventory[0].inv_make + ' ' + inventory[0].inv_model;
  res.render("inventory/edit-inventory", {
    title: name,
    nav,
    select,
    inventory: inventory[0],
    errors: null,
  })
}

/* ***************************
    *  Update inventory
* ************************** */
invCont.updateInventory = async function (req, res) {
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
    classification_id,
    inv_id
  } = req.body;
  const result = await invModel.updateInventory({
    inv_make, inv_model, inv_description, inv_year, inv_color, inv_image,
    inv_thumbnail, inv_price, inv_miles, classification_id, inv_id
  });
  console.log(result)
  if(result){
    req.flash(
        "notice",
        `Congratulations, you\'ve updated inventory ${inv_make} ${inv_model}.`
    )
    res.redirect("/inv")
  }
  else {
    const select = await utilities.buildClassificationList()
    let nav = await utilities.getNav()
    const name = inv_make + ' ' +inv_model;
    req.flash(
        "notice",
        `Sorry, the insert failed`
    )
    res.status(501).render('inventory/edit-inventory', {
      title: `Edit ${name}`,
      nav,
      select,
      errors: null,
      inventory: {
        inv_id, inv_miles, inv_price, inv_thumbnail, inv_image, inv_year, inv_model,
        inv_description, inv_make, inv_color, classification_id
      }
    })
  }
}


/* ***************************
*  Build delete inventory view
* ************************** */
invCont.buildDeleteInventory = async function (req, res) {
  const inventory_id = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav()
  const inventory = await invModel.getVehicleInfoByInventoryId(inventory_id)
  const name = inventory[0].inv_make + ' ' + inventory[0].inv_model;
  res.render("inventory/delete-confirm", {
    title: name,
    nav,
    inventory: inventory[0],
    errors: null,
  })
}

/* ***************************
    *  Delete inventory
* ************************** */
invCont.deleteInventory = async function (req, res) {
  const inv_id = parseInt(req.body.inv_id);
  const result = await invModel.deleteInventoryById(inv_id);
  if(result){
    req.flash(
        "notice",
        `Congratulations, you\'ve deleted inventory.`
    )
    res.redirect("/inv")
  }
  else {
    req.flash(
        "notice",
        `Sorry, the delete failed`
    )
    res.redirect(`/inv/delete/${inv_id}`)
  }
}

module.exports = invCont




