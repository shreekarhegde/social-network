const express = require('express');
const router = express.Router();
const { Post } = require('../models/post');
const { Profile } = require('../models/profile');
const _= require('lodash');
const { validateID } = require('../middlewares/utilities');
const { authenticateUser } = require('../middlewares/authentication');

//see posts
router.get('/posts', authenticateUser, (req,res) => {
    let id = req.locals.profile._id;
    Profile.findById(id).then((account) => {
        res.send(account.posts);
    }).catch((err) => {
        res.send(err);
    });
});

//add posts
router.post('/whats_on_your_mind', authenticateUser, (req, res) => {
    let id = req.locals.profile._id;
    let body = _.pick(req.body, ['textArea', 'comments', 'postedAt', 'likes', 'shares']);
    let post = new Post(body);
    post.profile = id;
    Profile.findByIdAndUpdate({_id: id}, {$push: {posts: post }}).then((response) => {
        post.save().then((rep) => {
        res.send(response);
    }).catch((err) => {
        res.send(err);
    });
});
});

//delete posts
router.delete('/delete/:id', authenticateUser, (req, res) => {
 let id = req.params.id;
 let profile = req.locals.profile;
 profile.posts.id(id).remove(); 
 profile.save().then((account) => {
     res.send('deleted the post');
 }).catch((err) => {
     res.send(err);
 });
});

module.exports = {
    postsController: router
}