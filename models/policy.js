const mongoose = require('mongoose');
const policySchema = mongoose.Schema(
    {
        policyNum:{type: Number, required: [true]},
        premium:{type: Number, required: [true]},
        sumAssured:{type: Number, required: [true]},
        policyTerm:{type: String, required: [true]},
        policyFrequency: {type: String}
    },
    {
        timestamps: true
    }
);
const Policy = mongoose.model('Policy', policySchema);
module.exports = Policy;