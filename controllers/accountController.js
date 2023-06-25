/* ***********************
 *  Deliver the login view
 * ************************/
const utilities = require('../utilities')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {getAccountById} = require("../models/account-model");
const env = require("dotenv").config()

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



/* ***********************
 * Deliver the account Management view*/
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
      title: "Account Management",
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
 let hashedPassword
 try {
   // regular password and cost (salt is generated automatically)
   hashedPassword = await bcrypt.hashSync(account_password, 10)
 } catch (error) {
   req.flash("notice", 'Sorry, there was an error processing the registration.')
   res.status(500).render("account/register", {
     title: "Registration",
     nav,
     errors: null,
   })
 }


 const regResult = await accountModel.registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  hashedPassword
)


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


  /* ****************************************
 *  Process login request  Unit 5
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
       delete accountData.account_password
       const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
       res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
       return res.redirect("/account/")
   }
   else {
       req.flash("notice", "Please check your password and try again.")
       res.status(400).render("account/login", {
           title: "Login",
           nav,
           errors: null,
           account_email,
       })
       return
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

/* ***********************
* Build update account information view*/
async function buildUpdateAccountInformation(req, res, next) {
    const accountData = await getAccountById(parseInt(req.params.account_id));
    let nav = await utilities.getNav()
    res.render("account/update-view", {
        title: "Update Account Information",
        nav,
        errors: null,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_id: accountData.account_id,
    })
}

/* ***************************
*  Update account information
* ************************** */
updateAccountInformation = async function (req, res) {
    const {
        account_email,
        account_firstname,
        account_lastname,
        account_id
    } = req.body;
    const result = await accountModel.updateAccountInformation({
        account_email,
        account_firstname,
        account_lastname,
        account_id
    });
    console.log(result)
    if(result){
        let nav = await utilities.getNav()
        const accountData = await getAccountById(account_id);
        req.flash(
            "info",
            `Congratulations, you\'ve updated your account information.`
        )
        res.render('account/management', {
            title: `Account Management`,
            nav,
            accountData,
            errors:null
        })
    }
    else {
        let nav = await utilities.getNav()
        req.flash(
            "notice",
            `Sorry, the account information update failed`
        )
        res.render('account/update-view', {
            title: `Update account information`,
            nav,
            account_email,
            account_firstname,
            account_lastname,
            account_id
        })
    }
}

/* ***************************
*  Update account password
* ************************** */
updateAccountPassword = async function (req, res) {
    const {
        account_password,
        account_id
    } = req.body;
    const hashedPassword = await bcrypt.hashSync(account_password, 10)
    const result = await accountModel.updateAccountPassword({
        account_password: hashedPassword,
        account_id
    });
    console.log(result)
    if(result){
        let nav = await utilities.getNav()
        const accountData = await getAccountById(account_id);
        req.flash(
            "info",
            `Congratulations, you\'ve updated your password.`
        )
        res.render('account/management', {
            title: `Account Management`,
            nav,
            accountData,
            errors: null
        })
    }
    else {
        const accountData = await getAccountById(account_id);
        let nav = await utilities.getNav()
        req.flash(
            "notice",
            `Sorry, the account password update failed`
        )
        res.render('account/update-view', {
            title: `Update account information`,
            nav,
            ...accountData
        })
    }
}



module.exports = {
    buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, buildUpdateAccountInformation, updateAccountInformation, updateAccountPassword}