var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    likes: {
        type: Number,
        default: 0
    },
    imageName: String,
    caption: String,
    //hashtags: String,
    imgPath: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    creator: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        username: String,
        profPic:{
            type: String,
            default: "/img/2.png"
        }
    }
}, { timestamps: true });

module.exports = mongoose.model("Postcontent", postSchema);