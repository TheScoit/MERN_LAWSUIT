import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
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
    password:{
        type:String,
        required:true,
        minLength: [6,"Password must contain 6 Characters!"],
        select:false
    },
    role:{
        type:String,
        required:true,
        enum: ["Admin","Litigant","Attorney"],
    },

    attorneyDepartment:{
        type:String,
    },   
    AttorneyAvatar:{
        public_id:String,
        url:String
    },
});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};

userSchema.methods.generateJsonWebtoken = function(){
    return jwt.sign({
        id: this._id},
        process.env.JWT_SECRET_KEY,
        {expiresIn : process.env.JWT_EXPIRES},
    )
}



export const User = mongoose.model("User",userSchema);