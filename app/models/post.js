const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },
    textArea: [],
    likes: [{
        type: Number
    }],
    comments: [{
        type: String,
    }],
    shares: [{
        type: Number
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