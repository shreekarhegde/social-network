const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },
    textArea: {
        type: String
    },
    likes: [{
        type: Number
    }],
    comments: [{
        type: String,
    }],
    postedAt: {
        type: Date,
        default: Date.now()
    }
});

let Post = mongoose.model('Post', postSchema);

module.exports = {
    Post, postSchema
}