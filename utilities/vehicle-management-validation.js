const utilities = require('../utilities/index')
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model");
const validate = {}

/*  **********************************
 *  Add classification Data Validation Rules
 * ********************************* */
validate.addVehicleClassRules = () => {
    return [
        body("name")
            .trim()
            .isLength({ min: 3, max: 25 })
            .withMessage("Please provide a valid vehicle classification name."), // on error this message is sent.
    ]
}

/* ******************************
* Check data and return errors or continue to add vehicle classification
* ***************************** */
validate.checkAddVehicleClassData = async (req, res, next) => {
    const { name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Vehicle Management",
            nav,
            name
        })
        return
    }
    next()
}

/*  **********************************
 *  Add inventory Data Validation Rules
 * ********************************* */
validate.addInventoryRules = () => {
    return [

        body("inv_make")
            .trim()
            .isLength({ min: 3, max: 25 })
            .withMessage("Please provide a valid vehicle make."),
        body("inv_model")
            .trim()
            .isLength({ min: 3, max: 25 })
            .withMessage("Please provide a valid vehicle model."),
        body("inv_color")
            .trim()
            .isLength({ min: 3, max: 25 })
            .withMessage("Please provide a valid vehicle color."),
        body("inv_description")
            .trim()
            .isLength({ min: 10, max: 500 })
            .withMessage("Please provide a valid vehicle description."),
        body("inv_year")
            .trim()
            .isLength({ min: 4, max: 4 })
            .isNumeric()
            .withMessage("Please provide a valid vehicle year."),
        body("inv_image")
            .trim()
            .isSlug()
            .withMessage("Please provide a valid vehicle image path."),
        body("inv_thumbnail")
            .trim()
            .isSlug()
            .withMessage("Please provide a valid vehicle thumbnail path."),
        body("inv_miles")
            .trim()
            .isNumeric()
            .withMessage("Please provide a valid vehicle mileage."),
        body("inv_price")
            .trim()
            .isDecimal()
            .withMessage("Please provide a valid vehicle price."),
        body("classification_id")
            .trim()
            .isNumeric()
            .withMessage("Please provide a valid classification id."),
    ]
}

/*  **********************************
 *  Update inventory Data Validation Rules
 * ********************************* */
validate.updateInventoryRules = () => {
    return [

        body("inv_make")
            .trim()
            .isLength({ min: 3, max: 25 })
            .withMessage("Please provide a valid vehicle make."),
        body("inv_model")
            .trim()
            .isLength({ min: 3, max: 25 })
            .withMessage("Please provide a valid vehicle model."),
        body("inv_color")
            .trim()
            .isLength({ min: 3, max: 25 })
            .withMessage("Please provide a valid vehicle color."),
        body("inv_description")
            .trim()
            .isLength({ min: 10, max: 500 })
            .withMessage("Please provide a valid vehicle description."),
        body("inv_year")
            .trim()
            .isLength({ min: 4, max: 4 })
            .isNumeric()
            .withMessage("Please provide a valid vehicle year."),
        body("inv_image")
            .trim()
            .isSlug()
            .withMessage("Please provide a valid vehicle image path."),
        body("inv_thumbnail")
            .trim()
            .isSlug()
            .withMessage("Please provide a valid vehicle thumbnail path."),
        body("inv_miles")
            .trim()
            .isNumeric()
            .withMessage("Please provide a valid vehicle mileage."),
        body("inv_price")
            .trim()
            .isDecimal()
            .withMessage("Please provide a valid vehicle price."),
        body("classification_id")
            .trim()
            .isNumeric()
            .withMessage("Please provide a valid classification id."),
        body("inv_id")
            .trim()
            .isNumeric()
            .withMessage("Please provide a valid inventory id."),

    ]
}

/* ******************************
* Check data and return errors or continue to add add inventory
* ***************************** */
validate.checkAddInventoryData = async (req, res, next) => {
    const { name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const select = await utilities.buildClassificationList()
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            select
        })
        return
    }
    next()
}

/* ******************************
* Check data and return errors or continue to update inventory
* ***************************** */
validate.checkUpdateInventoryData = async (req, res, next) => {
    const { inv_id, inv_make, inv_model } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const inventory = await invModel.getVehicleInfoByInventoryId(parseInt(inv_id))
        console.log(inventory)
        const select = await utilities.buildClassificationList()
        const name = inv_make + ' ' + inv_model;
        res.render("inventory/edit-inventory", {
            errors,
            title: name,
            nav,
            select,
            inventory: null,
        })
        return
    }
    next()
}

module.exports = validate