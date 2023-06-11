// Needed Resources 

/*********************************
 * Deliver the login view*/

const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

/*********************************
 * Deliver Login view*/
 
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Process the login attempt
router.post("/login", (req, res) => {res.status(200).send('login process')})

/*********************************
 * Deliver the register view*/
router.get("/register", utilities.handleErrors(accountController.buildRegister))

/*********************************
 * Login view
 * */
router.post("/register", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))


module.exports = router;