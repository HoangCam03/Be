const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        name:{type: String, require: true,unique: true},
        image: { type: String, require:true},
        type:{type: String, require:true},
        price:{type: Number,require:true},
        countInStock:{type: Number, require:true},
        rating:{type: Number, require:true},
        sold:{type: Number, require:true},
        discount:{type: Number, require:true},
        description:{type: String},
    },
    {
        timestamps: true,
    }
);
const User = mongoose.model("Product", userSchema);
module.exports = User;