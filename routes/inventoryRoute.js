//Needed resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities");
const validate = require('../utilities/vehicle-management-validation')

/*********************************
 * Management view*/
router.get('/', utilities.checkUserAccountType, utilities.handleErrors(invController.buildManagement))

/*********************************
 * Add classification view*/
router.get('/add-classification', utilities.checkUserAccountType, utilities.handleErrors(invController.buildAddClassification))

//Create new classification record
router.post('/add-classification',utilities.checkUserAccountType, validate.addVehicleClassRules(), validate.checkAddVehicleClassData, utilities.handleErrors(invController.createNewClassification))

/*********************************
 * Add vehicle inventory view*/
router.get('/add-inventory', utilities.checkUserAccountType, utilities.handleErrors(invController.buildAddInventory))

 //Create new classification record
router.post('/add-inventory', utilities.checkUserAccountType, validate.addInventoryRules(), validate.checkAddInventoryData, utilities.handleErrors(invController.createNewInventory))

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);



// Route to deliver the inventory detail view
router.get("/detail/:inventoryId", invController.buildByVehicleInventoryId);


router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
//testing something real quick
//Edit inventory
router.get('/edit/:inventory_id', utilities.checkUserAccountType, utilities.handleErrors(invController.buildEditInventory))

//

//Update inventory
router.post('/update', utilities.checkUserAccountType, validate.updateInventoryRules(), validate.checkUpdateInventoryData, utilities.handleErrors(invController.updateInventory))

//Delete inventory view
router.get('/delete/:inventory_id', utilities.checkUserAccountType, utilities.handleErrors(invController.buildDeleteInventory))

//Delete inventory
router.post('/delete', utilities.checkUserAccountType, utilities.handleErrors(invController.deleteInventory))

module.exports = router;
