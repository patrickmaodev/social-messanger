const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    recipientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    messaget:{
        type:String,
        enum:('text','image')
    },
    message:String,
    imageUrl:String,
    timestamp:{
        type:Date,
        default:Date.now()
    }
})

const Message = mongoose.model('Message',messageSchema);
module.exports = Message;
