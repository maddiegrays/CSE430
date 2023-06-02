// Needed Resources 

const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build registeration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Registration route
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login attempt
router.post(
    "/login",
    (req, res) => {
      res.status(200).send('login process')
    }
)  




module.exports = router;