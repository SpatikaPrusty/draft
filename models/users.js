const mongoose = require('mongoose');

const { schema } = mongoose;


const users = new schema({
    name: { type: String },
    age: { type: Number },
    isSmoke: { type: Boolean },
    isDiabetic: { type: Boolean },
    incomePerAnnum: {type: Number, default: 0}
});

module.exports = users;