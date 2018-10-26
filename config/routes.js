const express = require('express');
const router = express.Router();
const { profilesController } = require('../app/controllers/profiles_controller');
const { groupsController } = require('../app/controllers/groups_controller');

router.use('/profile', profilesController );
router.use('/groups', groupsController);

module.exports = {
    routes: router 
}