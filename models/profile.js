const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { groupSchema } = require('../models/group');
const { Notification, notificationSchema } = require('../models/notification');


const Schema = mongoose.Schema;

const profileSchema = new Schema({
    username: {
        type: String,
        minlength: 3,
        maxlength: 20,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: function () {
                return 'invalid email format'
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 128
    },
    tokens: [{
        token: {
            type: String
        }
    }],
    posts: {
        type: String,
        minlength: 1
    },
    friends: [Object],
    activity: [],
    groups: [],
    gender: {
        type: String,
        required: true
    },
    country: {
        required: true,
        type: String
    },
    DOB: {
        type: String,
        required: true
    },
    notifications: {
        type: Schema.Types.ObjectId,
        ref: 'Notifications'
    }
});

profileSchema.pre('save', function (next) {
    let profile = this;
    bcrypt.genSalt(10).then((salt) => {
        bcrypt.hash(profile.password, salt).then((hashed) => {
            profile.password = hashed;
            next();
        });
    });
});

profileSchema.methods.generateToken = function (next) {
    let profile = this;
    let tokenData = {
        _id: profile.id
    };
    let token = jwt.sign(tokenData, 'supersecret');
    profile.tokens.push({
        token
    });

    return profile.save().then(() => {
        return token;
    })
}



//instance method
profileSchema.methods.shortInfo = function () {
    let info = {
        _id: this._id,
        username: this.username,
        email: this.email
    }
    return info;
};

profileSchema.statics.findByToken = function (token) {
    let Profile = this;
    let tokenData;
    try {
        tokenData = jwt.verify(token, 'supersecret');
    } catch (e) {
        return Promise.reject(e);
    }
    return Profile.findOne({
        '_id': tokenData._id,
        'tokens.token': token
    }).then((profile) => {
        if (profile) {
            return Promise.resolve(profile);
        } else {
            return Promise.reject(profile);
        }
    });
};


const Profile = mongoose.model('Profile', profileSchema);


module.exports = {
    Profile, profileSchema
}