const express = require('express');
const router = express.Router();
const { Group } = require('../models/group');
const { Profile } = require('../models/profile');
const { authenticateUser } = require('../middlewares/authentication');
const _ = require('lodash');


//create group
router.post('/create_group', authenticateUser, (req, res) => {
    let body = _.pick(req.body, ['groupname', 'isPublic']);
    let group = new Group(body);
    group.save().then((group) => {
        res.send({notice:`successfully created the group ${group.groupname}`});
    });
});

//add member
router.post('/add_members/:id', authenticateUser, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['groupname']);
    let group = new Group(body);
    Profile.findByIdAndUpdate(id).then((profile) =>{
        Group.findOneAndUpdate({groupname: group.groupname}, {$push: { profiles: profile.username} }).then((member) => {
            res.send({
                notice: 'successfully added to the group'
            });
        });
    }).catch((err) => {
        res.send(err);
    });
});


module.exports = {
    groupsController: router
}