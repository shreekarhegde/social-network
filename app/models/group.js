const mongoose = require('mongoose');
const { profileSchema } = require('../models/profile');
const { postSchema } = require('../models/post');

const Schema = mongoose.Schema;

const groupSchema = new Schema({
    groupname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 15
    },
    profiles: [],
    isPublic: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    posts: [ postSchema ]
});

let Group = mongoose.model('Group', groupSchema);

module.exports = {
    Group
}