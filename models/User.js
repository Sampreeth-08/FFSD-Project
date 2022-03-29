const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const UserSchema=new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: "/img/dp.png"
    },
    followers: {
        type: Number,
        default: 0
    },
    following: {
        type: Number,
        default: 0
    },
    posts: {
        type: Number,
        default: 0
    },
    bio: {
        type: String,
        default: "Astronomy is the best"
    }
}, {timestamps: true});

let User=mongoose.model('User', UserSchema);
module.exports=User;