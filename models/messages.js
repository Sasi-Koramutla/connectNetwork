const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    subject: { type: String},
    body: { type: String, required: true },
    from: { type: String , required: true},
    to: { type: String , required: true},
},{timestamps: true});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;