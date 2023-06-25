const pool = require("../database/index")

/* *****************************
/*Register new account 
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }


  /* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address 
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* ***************************
 *  Update account information
 * ************************** */
async function updateAccountInformation(payload) {
  try {
    const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4"
    const data = await pool.query(
        sql,
        [payload.account_firstname, payload.account_lastname, payload.account_email, payload.account_id]
    )
    return data.rowCount
  } catch (error) {
    console.error("Update information error " + error)
  }
}

/* ***************************
 *  Update account password
 * ************************** */
async function updateAccountPassword(payload) {
  try {
    const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2"
    const data = await pool.query(
        sql,
        [payload.account_password, payload.account_id]
    )
    return data.rowCount
  } catch (error) {
    console.error("Update password error " + error)
  }
}

/* *****************************
* Return account data using id
* ***************************** */
async function getAccountById (account_id) {
  try {
    const result = await pool.query(
        'SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM public.account WHERE account_id = $1',
        [account_id])
    return result.rows[0]
  } catch (error) {
    console.log(error)
    return new Error("No matching account found")
  }
}
  module.exports = {
    registerAccount,
    checkExistingEmail,
    getAccountByEmail,
    updateAccountInformation,
    updateAccountPassword,
    getAccountById,
}