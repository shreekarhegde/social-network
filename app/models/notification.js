const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Profile } = require('../models/profile');

const notificationSchema = new Schema({
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile' 
    },
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
     birthdays:[ {
         type: Date
     }],
     tags: {
         type: String
     }
});

const Notification = mongoose.model('Notification', notificationSchema );

module.exports = {
    Notification, notificationSchema
}