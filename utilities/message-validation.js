const utilities = require('../utilities/index')
const accountModel = require("../models/account-model")
const messageModel = require("../models/message-model")
const { body, validationResult, param} = require("express-validator")
const validate = {}

/*  **********************************
 *  Create message validation Rules
 * ********************************* */
validate.createMessageRules = () => {
    return [
      body("recipient_id")
        .trim().isDecimal()
        .withMessage("Please provide a recipient id."),

    body("sender_id")
        .trim().isDecimal()
        .withMessage("Please provide a sender id."),

      body("subject")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a subject."),

    body("message")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Please provide a message."),
    ]
  }

/* ******************************
* Check create message validation Rules data and return errors
* ***************************** */
validate.checkCreateMessageData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let recipients = await utilities.buildMessageRecipientList(parseInt(res.locals.accountData.account_id))
        req.flash(
            "notice",
            `Sorry, message sending failed`
        )
        res.render('message/new-message',{
            title: "New Message",
            nav,
            errors,
            select: recipients,
        })
    }
    next()
}

/*  **********************************
 *  message id validation Rules
 * ********************************* */
validate.messageIdRules = () => {
    return [
        param("message_id")
            .trim().isDecimal()
            .withMessage("Please provide a message id."),
    ]
}

/*  **********************************
 *  account id validation Rules
 * ********************************* */
validate.accountIdRules = () => {
    return [
        param("account_id")
            .trim().isDecimal()
            .withMessage("Please provide an account id."),
    ]
}

/* ******************************
* Check id validation Rules data and return errors
* ***************************** */
validate.checkIdsForRead = async (req, res, next) => {
    let errors = []
    console.log(req.locals)
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("message/read", {
            title: 'Read message',
            nav,
            errors,
            message: { message_subject: 'Error'}
        })
    }
    next()
}



module.exports = validate