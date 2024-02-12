const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name:{type: String, required: [true,'Please enter your name.']},
        age:{type: Number, required: [true,'Please enter your age.']},
        isSmoke:{type: Boolean, required: [true]},
        isDiabetic:{type: Boolean, required: [true]},
        incomePerAnnum: {type: Number, default: 0}
    },
    {
        timestamps: true
    }
);

// const users = new Schema({
//     name: { type: String },
//     age: { type: Number },
//     isSmoke: { type: Boolean },
//     isDiabetic: { type: Boolean },
//     incomePerAnnum: {type: Number, default: 0}
// });

const users = mongoose.model('User', userSchema);
module.exports = User;