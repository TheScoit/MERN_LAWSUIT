import mongoose from 'mongoose';
import validator from 'validator';

const messageSchema = new mongoose.Schema({
    firstName:{
        type:String,
        require: true,
        minLength : [3, "First name must contain at least 3 characters!"]
    },
    lastName:{
        type:String,
        require: true,
        minLength : [3, "First name must contain at least 3 characters!"]
    },
    email:{
        type:String,
        require: true,
        validate :[validator.isEmail,"Please Provide a Valid Email!"]
    },
    contact:{
        type: String,
        require: true,
        minLength : [10 , "Phone Number must contain 10 digits"],
        maxLength : [10 , "Phone Number must contain 10 digits"],
    },
    message:{
        type: String,
        require: true,
        minLength : [10 , "Message must contain at leat 10 characters"],
    },
});

export const Message = mongoose.model("Message",messageSchema);