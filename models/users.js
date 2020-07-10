const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    username: {type: String, required: true, uniqe: true},
    zipcode: {type: Number},
    userConnections: [{connectionId: {type: String}, messages: {type: Array}}],
    img: { type: String},
    bmonth: { type: String},
    bday: { type: String}
},{timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;