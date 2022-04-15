const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types
//const { required } = require('nodemon/lib/config');

const Schema = mongoose.Schema;

// const PostSchema = new Schema({
//     content: { type: String, trim: true },
//     postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
//     pinned: Boolean
// }, { timestamps: true });

const PostSchema = new Schema({
    likes: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: "/img/4.jpg"
    },
    caption: {
        type: String,
        required: true
    },
    hashtags: {
        type: String,
        required: true
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    username: {
        type: String,
        required: true
    },
    profile_image: {
        type: String,
        required: true
    }
}, { timestamps: true });

let Post = mongoose.model('Post', PostSchema);
module.exports = Post;