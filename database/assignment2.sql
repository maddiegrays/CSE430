--Insert Tony Stark
INSERT INTO account
(AdminFirstname, AdminLastname, AdminEmail, AdminPassword,)
VALUES
("Tony", "Stark", "tony@starkent.com", "Iam1ronM@n",);

--Update Hummer description
UPDATE inventory 
SET inv_description = REPLACE(inv_description, 'small interior', 'a huge interior');


--Select make and model
SELECT 
inv_make,
inv_model,
classification_name,
inventory.classification_id,
classification.classification_id
FROM 
inventory
INNER JOIN classification
ON inventory.classification_id = classification.classification_id
WHERE inventory.classification_id = 2;

--Images and Thumbnails
UPDATE inventory
SET inv_image = CONCAT('/images/vehicles/a-car-name.jpg', inv_image), inv_thumbnail = CONCAT('/images/vehicles/a-car-name.jpg', inv_thumbnail);
