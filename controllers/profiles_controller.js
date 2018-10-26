const express = require('express');
const router = express.Router();
const { Profile } = require('../models/profile');
const { Group } = require('../models/group');
const _ = require('lodash');
const { validateID } = require('../middlewares/utilities');
const { authenticateUser } = require('../middlewares/authentication');


//visit profile
router.get('/:id', validateID, (req, res) => {
    let id = req.params.id;
    Profile.findById(id).then((account) => {
        res.send(account);
    }).catch((err) => {
        res.send(err);
    });
});


//create account
router.post('/create_account', (req, res) => {
    let body = _.pick(req.body, ['username', 'password', 'email', 'gender', 'country', 'DOB']);
    let profile = new Profile(body);
    profile.save().then((profile) => {
        return profile.generateToken();
    }).then((token) => {
        res.header('x-auth', token).send({
            profile: profile.shortInfo(),
            notice: 'successfully created account, welcome to facebook!'
        });
    }).catch((err) => {
        res.send(err);
    });
});

//add friend and make sure request is sent only once
router.post('/send_request/:id', validateID, authenticateUser, (req, res) => {
    let id = req.params.id;
    let username = req.locals.profile.username;
    //TODO- limiting request to one
    userId = req.locals.profile._id;
    let friendRequests = {
        content: `you have a friend request from ${username}`
    };
    Profile.findOneAndUpdate({ _id: id }, { $push: { notifications: { friendRequests } } }).then((user) => {
        Profile.findOneAndUpdate({ username: username }, { $push: { activity: `you sent a friend request to ${user.username}` } }).then((user) => {
            res.send(`request sent`);
        });
    }).catch((err) => {
        res.send(err);
    });
});

//accept_request
router.post('/accept_request/:id', authenticateUser, (req, res) => {
    let acceptorId = req.locals.profile._id;
    let acceptorName = req.locals.profile.username;
    let senderId = req.params.id;
    let body = _.pick(req.body, ['acceptRequest']);
    let permit = new Profile(body);
    
    let friendRequests = {
        content: `you and ${acceptorName} are now friends`,
        isFriend: permit.acceptRequest
    }
    if (permit.acceptRequest == true) {
        Profile.findByIdAndUpdate({ _id: senderId }, { notifications: { friendRequests }},{$push:{ friends: acceptorName }}).then((user) => {
            let senderName = user.username;
            let friendRequests = {
                content: `you and ${senderName} are now friends`,
                isFriend: permit.acceptRequest
            }
            Profile.findByIdAndUpdate({ _id: acceptorId }, { notifications: { friendRequests } },{$push:{ friends: senderName }}).then((user) => {
                res.send(`request accepted`);
            }).catch((err) => {
                res.send(err);
            });
        })
    }
});

//logout from the account
router.delete('/logout', authenticateUser, (req, res) => {
    let profile = req.locals.profile;
    let token = req.locals.token;
    let activeToken = profile.tokens.find(function (inDbToken) {
        return inDbToken.token == token;
    });
    profile.tokens.id(activeToken._id).remove();
    profile.save().then((profile) => {
        res.send({
            notice: 'successfully logged out'
        });
    }).catch((err) => {
        res.send(err);
    });
});



module.exports = {
    profilesController: router
}