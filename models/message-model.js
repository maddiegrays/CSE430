const pool = require("../database/index")

/* *****************************
/*Create new message
* *************************** */
async function createMessage(payload){
    try {
      const sql = "INSERT INTO message (message_subject, message_body, message_from, message_to) VALUES ($1, $2, $3, $4)"
      const data = await pool.query(sql, [payload.subject, payload.message, payload.sender_id, payload.recipient_id])
      return data.rowCount
    } catch (error) {
      console.log(error.message)
    }
}

/* ***************************
 *  Read Message
 * ************************** */
async function messageAsRead(payload) {
  try {
    const sql = "UPDATE public.message SET message_read = $1 WHERE message_to = $2 AND message_id = $3"
    const data = await pool.query(
        sql,
        [true, payload.user_id, payload.message_id]
    )
    return data.rowCount
  } catch (error) {
    console.error("Read message error " + error)
  }
}

/* ***************************
 *  Archive Message
 * ************************** */
async function archiveMessage(payload) {
  try {
    const sql = "UPDATE public.message SET message_archived = $1 WHERE message_to = $2 AND message_id = $3"
    const data = await pool.query(
        sql,
        [true, payload.user_id, payload.message_id]
    )
    return data.rowCount
  } catch (error) {
    console.error("Read message error " + error)
  }
}

/* ***************************
 *  Delete message
 * ************************** */
async function deleteMessageById(payload) {
  const sql = "DELETE FROM public.message WHERE message_id = $1 AND message_to = $2"
  try {
    const data = await pool.query(
        sql,[payload.message_id, payload.user_id]
    )
    return data
  } catch (error) {
    console.error("delete message error " + error)
  }
}

/* **********************
*   Get all user message
* **********************/
async function getAllUserMessage(user_id){
  try {
    const sql = "SELECT * FROM message INNER JOIN account ON message_from = account.account_id WHERE message_to = $1 AND message_archived = $2 ORDER BY message_created DESC"
    const email = await pool.query(sql, [user_id, false])
    return email.rows
  } catch (error) {
    console.error("Read all message error " + error)
  }
}

/* **********************
*   Get user message by id
* **********************/
async function getUserMessageById(payload){
  try {
    const sql = "SELECT * FROM message INNER JOIN account ON message_from = account.account_id WHERE message_to = $1 AND message_id = $2"
    const email = await pool.query(sql, [payload.user_id, payload.message_id])
    return email.rows[0]
  } catch (error) {
    console.error("Read message error " + error)
  }
}

/* **********************
*   Get all user unread message count
* **********************/
async function getAllUserUnreadMessageCount(user_id){
  try {
    const sql = "SELECT COUNT(message_id) FROM message WHERE message_to = $1 AND message_archived = $2 AND message_read = $3"
    const email = await pool.query(sql, [user_id, false, false])
    return email.rows[0]
  } catch (error) {
    console.error("Count unread message error " + error)
  }
}

/* **********************
*   Get all user archived message
* **********************/
async function getAllUserArchivedMessage(user_id){
  try {
    const sql = "SELECT * FROM message INNER JOIN account ON message_from = account.account_id WHERE message_to = $1 AND message_archived = $2 ORDER BY message_created DESC"
    const email = await pool.query(sql, [user_id, true])
    return email.rows
  } catch (error) {
    console.error("Read all archived message error " + error)
  }
}

/* **********************
*   Get user archived message by id
* **********************/
async function getUserArchivedMessageById(payload){
  try {
    const sql = "SELECT * FROM message INNER JOIN account ON message_from = account.account_id WHERE message_to = $1 AND message_id = $2 AND message_archived = $3"
    const email = await pool.query(sql, [payload.user_id, payload.message_id, true])
    return email.rows[0]
  } catch (error) {
    console.error("Read message error " + error)
    return error.message
  }
}

/* **********************
*   Get all user archive message count
* **********************/
async function getAllUserArchiveMessageCount(user_id){
  try {
    const sql = "SELECT COUNT(message_id) FROM message WHERE message_to = $1 AND message_archived = $2"
    const email = await pool.query(sql, [user_id, true])
    return email.rows[0]
  } catch (error) {
    console.error("Count archived message error " + error)
    return error.message
  }
}

/* **********************
*   Get all users
* **********************/
async function getAllUsers(user_id){
  try {
    const sql = "SELECT * FROM account WHERE account_id != $1"
    const email = await pool.query(sql, [user_id])
    return email.rows
  } catch (error) {
    console.error("Get all user error " + error)
    return error.message
  }
}

  module.exports = {
    createMessage,
    deleteMessageById,
    messageAsRead,
    archiveMessage,
    getAllUserMessage,
    getAllUserArchivedMessage,
    getAllUserUnreadMessageCount,
    getAllUserArchiveMessageCount,
    getUserMessageById,
    getUserArchivedMessageById,
    getAllUsers
}