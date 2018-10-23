const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    friendRequests: [{
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

const Notification = mongoose.model('notification', notificationSchema );

module.exports = {
    Notification, notificationSchema
}