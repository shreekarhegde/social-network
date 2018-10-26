const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Profile } = require('../models/profile');

const notificationSchema = new Schema({
    friendRequests: [{
        content:{
            type: String
        },
        isFriend: {
            type: Boolean,
            default: false
       }
       }
    ],
     birthdays:[ String ],
     tags: {
         type: String
     }
});

const Notification = mongoose.model('Notification', notificationSchema );

module.exports = {
    Notification, notificationSchema
}