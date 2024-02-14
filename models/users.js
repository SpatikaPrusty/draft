const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
        name:{type: String, required: [true,'Please enter your name.']},
        age:{type: Number, required: [true,'Please enter your age.']},
        gender:{type:String, required: [false]},
        isSmoke:{type: Boolean, required: [true]},
        isDiabetic:{type: Boolean, required: [true]},
        incomePerAnnum: {type: Number, default: 0},
        mail: {type: String, required: [true]},
        password: {type: String, required: [true]}
    },
    {
        timestamps: true
    }
);
userSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        this.password = bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});
const users = mongoose.model('User', userSchema);
module.exports = users;