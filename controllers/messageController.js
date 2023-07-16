
const utilities = require('../utilities')
const accountModel = require('../models/account-model')
const {getAccountById} = require("../models/account-model");
const {getAllUserUnreadMessageCount, getAllUserArchiveMessageCount, getAllUserMessage, getUserMessageById, messageAsRead, archiveMessage, deleteMessageById, getAllUserArchivedMessage, createMessage} = require("../models/message-model");
const env = require("dotenv").config()

async function buildInbox(req, res, next) {
    let nav = await utilities.getNav()
    let archive = await getAllUserArchiveMessageCount(parseInt(res.locals.accountData.account_id))
    let unread = await getAllUserMessage(parseInt(res.locals.accountData.account_id))
    res.render("message/inbox", {
        title: "Inbox",
        nav,
        unread,
        archived_message_count: archive.count,
        errors: null,
    })
}

async function buildNewMessage(req, res, next) {
    let nav = await utilities.getNav()
    let recipients = await utilities.buildMessageRecipientList(parseInt(res.locals.accountData.account_id))
    res.render("message/new-message", {
        title: "New Message",
        nav,
        select: recipients,
        //errors: null,
    })
}

async function buildReplyMessage(req, res, next) {
    let nav = await utilities.getNav()
    const message_id = parseInt(req.params.message_id)
    const user_id = parseInt(res.locals.accountData.account_id)
    const message = await getUserMessageById({user_id, message_id})
    res.render("message/reply-message", {
        title: "Reply Message",
        nav,
        message,
        errors: null,
    })
}

async function buildArchived(req, res, next) {
    let nav = await utilities.getNav()
    let archived = await getAllUserArchivedMessage(parseInt(req.params.account_id))
    res.render("message/archives", {
        title: "Archives",
        nav,
        archived,
        errors: null,
    })
}

async function buildReadMessage(req, res, next) {
    let nav = await utilities.getNav()
    const message_id = parseInt(req.params.message_id)
    const user_id = parseInt(res.locals.accountData.account_id)
    const message = await getUserMessageById({user_id, message_id})
    res.render("message/read", {
        title: message.message_subject,
        message,
        nav,
        errors: null,
    })
}

async function markMessageAsRead(req, res, next) {
    const message_id = parseInt(req.params.message_id)
    const user_id = parseInt(res.locals.accountData.account_id)
    const result = await messageAsRead({user_id, message_id})
    if(result) buildInbox(req, res, next);
    else {
        let nav = await utilities.getNav()
        const message = await getUserMessageById({user_id, message_id})
        req.flash(
            "notice",
            `Sorry, the message could not be updated`
        )
        res.render("message/read", {
            title: message.message_subject,
            message,
            nav,
            errors: null,
        })
    }
}

async function markMessageArchive(req, res, next) {
    const message_id = parseInt(req.params.message_id)
    const user_id = parseInt(res.locals.accountData.account_id)
    const result = await archiveMessage({user_id, message_id})
    if(result) buildInbox(req, res, next);
    else {
        let nav = await utilities.getNav()
        const message = await getUserMessageById({user_id, message_id})
        req.flash(
            "notice",
            `Sorry, the message could not be archived`
        )
        res.render("message/read", {
            title: message.message_subject,
            message,
            nav,
            errors: null,
        })
    }
}

async function deleteMessage(req, res, next) {
    const message_id = parseInt(req.params.message_id)
    const user_id = parseInt(res.locals.accountData.account_id)
    const result = await deleteMessageById({user_id, message_id})
    if(result) buildInbox(req, res, next);
    else {
        let nav = await utilities.getNav()
        const message = await getUserMessageById({user_id, message_id})
        req.flash(
            "notice",
            `Sorry, the message could not be deleted`
        )
        res.render("message/read", {
            title: message.message_subject,
            message,
            nav,
            errors: null,
        })
    }
}

/* ***************************
    * Create new message view
* ************************** */
async function createNewMessage(req, res, next) {
    const {
        recipient_id,
        sender_id,
        subject,
        message
    } = req.body;
    const result = await createMessage({
        recipient_id,
        sender_id,
        message,
        subject
    });
    console.log(result)
    if(result){
        req.flash(
            "info",
            `Congratulations, your message was sent successfully.`
        )
        buildInbox(req, res, next);
    }
    else {
        let nav = await utilities.getNav()
        req.flash(
            "notice",
            `Sorry, message sending failed`
        )

        res.render('message/new-message', {
            title: `New Message`,
            nav,
            subject,
            message,
            sender_id,
            recipient_id,
            errors: null
        })
    }
}

module.exports = {
    buildInbox,
    buildArchived,
    buildReadMessage,
    buildNewMessage,
    buildReplyMessage,
    markMessageAsRead,
    markMessageArchive,
    deleteMessage,
    createNewMessage,
}