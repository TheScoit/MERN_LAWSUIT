import mongoose from 'mongoose';
import validator from 'validator';


const AppointmentSchema = new mongoose.Schema({
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
    phone:{
        type: String,
        require: true,
        minLength : [10 , "Phone Number must contain 10 digits"],
        maxLength : [10 , "Phone Number must contain 10 digits"],
    },
    dob:{
        type: Date,
        required: [true,"DOB is required"],
    },
    gender:{
        type:String,
        required:true,
        enum: ["Male","Female"],
    },
    Appointment_date:{
        type : String,
        required : true,
    },
    department:{
        type: String,
        required: true,
    },
    attorney:{
        firstName:{
            type: String,
            required: true,
        },
        lastName:{
            type: String,
            required: true,
        }
    },
    hasVisited:{
        type: Boolean,
        default: false,
    },
    AttorneyId:{
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    LitigantId:{
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    Address:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["Pending","Accepted","Rejected"],
        default:"Pending",
    }
});

export const Appointment = mongoose.model("Appointment",AppointmentSchema);