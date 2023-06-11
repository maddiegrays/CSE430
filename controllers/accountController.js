/* ***********************
 * Deliver the login view
 * ************************/
const utilities = require('../utilities')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")

async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ***********************
 * Deliver the register account view*/

async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword;
    let regResult;
    hashedPassword = await bcrypt.hashSync(account_password, 10)
    try {
        regResult = await accountModel.registerAccount(
          account_firstname,
          account_lastname,
          account_email,
          hashedPassword
        )

    } catch (error) {
          req.flash("notice", 'Sorry, there was an error processing the registration.')
          res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,

          })
    }


    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
       
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
       
      })
    }
  }


module.exports = {buildLogin, buildRegister, registerAccount}