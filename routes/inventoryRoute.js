//Needed resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities");
const validate = require('../utilities/vehicle-management-validation')

/*********************************
 * Deliver management view*/
router.get('/', utilities.handleErrors(invController.buildManagement))

/*********************************
 * Deliver Add classification view*/
router.get('/add-classification', utilities.handleErrors(invController.buildAddClassification))

//Create new classification record
router.post('/add-classification', validate.addVehicleClassRules(), validate.checkAddVehicleClassData, utilities.handleErrors(invController.createNewClassification))

/*********************************
 * Add vehicle inventory Deliver & Add inventory view*/
router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventory))

 //Create new classification record
router.post('/add-inventory',validate.addInventoryRules(), validate.checkAddInventoryData, utilities.handleErrors(invController.createNewInventory))

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);


// Route to deliver the inventory detail view
router.get("/detail/:inventoryId", invController.buildByVehicleInventoryId);


module.exports = router;