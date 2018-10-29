const express = require('express');
const router = express.Router();
const { profilesController } = require('../app/controllers/profiles_controller');
const { groupsController } = require('../app/controllers/groups_controller');
const { postsController } = require('../app/controllers/posts_controller');

router.use('/profile', profilesController );
router.use('/groups', groupsController);
router.use('/post', postsController);

module.exports = {
    routes: router 
}