/*********************************
 * Message routes
*/
const express = require("express")
const router = new express.Router()
const messageController = require("../controllers/messageController")
const utilities = require("../utilities")
const msgValidate = require("../utilities/message-validation")

/*********************************
 * Create new message view
 **/
router.get("/new-view",
    utilities.checkLogin,
    utilities.checkUserAccountType,
    utilities.handleErrors(messageController.buildNewMessage)
)

/*********************************
 * Create new message handler
 **/
router.post("/create-new",
    utilities.checkLogin,
    utilities.checkUserAccountType,
    msgValidate.createMessageRules(),
    msgValidate.checkCreateMessageData,
    utilities.handleErrors(messageController.createNewMessage)
)


/*********************************
 * Create new reply handler
 **/
router.post("/create-reply",
    utilities.checkLogin,
    utilities.checkUserAccountType,
    msgValidate.createMessageRules(),
    msgValidate.checkCreateMessageData,
    utilities.handleErrors(messageController.createNewMessage)
)

/*********************************
 * Create reply message view
 **/
router.get("/reply/:message_id",
    utilities.checkLogin,
    utilities.checkUserAccountType,
    msgValidate.messageIdRules(),
    msgValidate.checkIdsForRead,
    utilities.handleErrors(messageController.buildReplyMessage)
)

/*********************************
 * List messages view
 **/
router.get("/inbox/:account_id",
    utilities.checkLogin,
    utilities.checkUserAccountType,
    msgValidate.accountIdRules(),
    msgValidate.checkIdsForRead,
    utilities.handleErrors(messageController.buildInbox)
)

/*********************************
 * Read messages view
 **/
router.get("/read/:message_id",
    utilities.checkLogin,
    utilities.checkUserAccountType,
    msgValidate.messageIdRules(),
    msgValidate.checkIdsForRead,
    utilities.handleErrors(messageController.buildReadMessage)
)

/*********************************
 * Read messages view
 **/
router.get("/mark-as-read/:message_id",
    utilities.checkLogin,
    utilities.checkUserAccountType,
    msgValidate.messageIdRules(),
    msgValidate.checkIdsForRead,
    utilities.handleErrors(messageController.markMessageAsRead)
)

/*********************************
 * Archive messages view
 **/
router.get("/archive/:message_id",
    utilities.checkLogin,
    utilities.checkUserAccountType,
    msgValidate.messageIdRules(),
    msgValidate.checkIdsForRead,
    utilities.handleErrors(messageController.markMessageArchive)
)

/*********************************
 * Delete messages view
 **/
router.get("/delete/:message_id",
    utilities.checkLogin,
    utilities.checkUserAccountType,
    msgValidate.messageIdRules(),
    msgValidate.checkIdsForRead,
    utilities.handleErrors(messageController.deleteMessage)
)

/*********************************
 * List archived messages view
 **/
router.get("/archived-messages/:account_id",
    utilities.checkLogin,
    utilities.checkUserAccountType,
    msgValidate.accountIdRules(),
    msgValidate.checkIdsForRead,
    utilities.handleErrors(messageController.buildArchived)
)

module.exports = router;