const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

module.exports = {getClassifications}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1",[classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId};


//Step
/* ***************************
 *  Get one vehicle by inventory_id
 * ************************** */
async function getVehicleInfoByInventoryId(inventory_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory WHERE inv_id = $1",[inventory_id]
    )
    return data.rows
  } catch (error) {
    console.error("get vehicle info by id error " + error)
  }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const data = await pool.query(
        "INSERT INTO public.classification (classification_name) VALUES ($1) ",[classification_name]
    )
    return data.rows
  } catch (error) {
    console.error("Create classification error " + error)
  }
}

/* ***************************
 *  Add new inventory
 * ************************** */
async function addInventory(payload) {
  try {
    const data = await pool.query(
        "INSERT INTO public.inventory (" +
        "inv_make, inv_model, inv_description, inv_year, inv_color, inv_image, inv_thumbnail, inv_price, inv_miles, classification_id) " +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ",
        [payload.inv_make, payload.inv_model, payload.inv_description, payload.inv_year, payload.inv_color, payload.inv_image,
          payload.inv_thumbnail, payload.inv_price, payload.inv_miles, payload.classification_id
        ]
    )
    return data.rows
  } catch (error) {
    console.error("Create inventory error " + error)
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getVehicleInfoByInventoryId, addClassification, addInventory };

