const express = require('express');
const router = express.Router();
const controller = require("../appcontroller/controller");

router.route('/register').post(controller.register);
router.route('/login').post(controller.login);
router.route('/visualizations')
  .post(controller.addLocation)         // Add a new location
  .get(controller.getUserLocations)     // Fetch all locations
  .delete(controller.deleteLocation);   // Delete a location using the request body


module.exports = router;