import {catchAsyncErrors} from '../middlewares/catchAsyncErrors.js'
import ErrorHandler from '../middlewares/errorMiddleware.js'
import { User } from '../models/userSchema.js';
import {generateToken} from '../utils/jwtToken.js'
import cloudinary from "cloudinary"

export const litigantRegister = catchAsyncErrors(async(req,res,next)=>{
    const { firstName , lastName , email , phone , password , gender, dob , role } = req.body;
    if(!firstName || !lastName || !email || !phone || !password || !gender || !dob || !role){
        return next(new ErrorHandler("Please Fill Full Form!",400));
    }

    let user = await User.findOne({email});
    if(user){
        return next(new ErrorHandler("User Already Registered!",400));
    }

    user = await User.create({firstName , lastName , email , phone , password , gender, dob , role});
    generateToken(user,"User Registered", 200, res)
});

export const login = catchAsyncErrors(async(req,res,next)=>{
    const {email, password, confirmPassword , role} = req.body;
    if(!email || !password || !confirmPassword || !role){
        return next(new ErrorHandler("Please fill full form ", 400))
    }

    if(password !== confirmPassword){
        return next(new ErrorHandler("Your password and Confirm Password donot match",400))
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("User not found",400))
    }


    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Password is wrong ,Please Enter correct password",400))
    }
    if(role !== user.role){
        return next(new ErrorHandler("User with this Role not Found",400))
    }
    generateToken(user,"User Logged in Successfully", 200, res)

});

export const addNewAdmin =  catchAsyncErrors(async(req,res,next)=>{
    const { firstName , lastName , email , phone , password , gender, dob } = req.body;

    if(!firstName || !lastName || !email || !phone || !password || !gender || !dob ){
        return next(new ErrorHandler("Please Fill Full Form!",400));
    }

    const isRegistered = await User.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} with this email already exists`));
    }

    const admin = await User.create({firstName , lastName , email , phone , password , gender, dob , role:"Admin"});
    res.status(200).json({
        success:true,
        message:"New Admin Registered",
    })
});

export const getAllAttorneys = catchAsyncErrors(async (req,res,next)=>{
    const Attorneys = await User.find({role:"Attorney"});
    res.status(200).json({
        success:true,
        Attorneys
    })
});

export const getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = req.user;
    res.status(200).json({
        success:true,
        user,
    });
});

export const loggedoutAdmin =  catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("adminToken", "" ,{
        httpOnly : true,
        expires: new Date(Date.now()),

    }).json({
        success:true,
        message:"Admin LoggedOut Successfully"
    });
});

export const loggedoutLitigant =  catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("litigantToken", "" ,{
        httpOnly : true,
        expires: new Date(Date.now()),

    }).json({
        success:true,
        message:"Litigant LoggedOut Successfully"
    });
});

export const addNewAttorney = catchAsyncErrors(async(req,res,next)=>{
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Attorney Avatar Required",400));
    }
    const {AttorneyAvatar} = req.files;
    const allowedFormats = ["image/png","image/jpg", "image/jpeg", "image/webp"];
    if(!allowedFormats.includes(AttorneyAvatar.mimetype)){
        return next(new ErrorHandler("File format not Supported",400));
    }

    const { firstName , lastName , email , phone , password , gender , dob  , AttorneyDepartment } = req.body;
    if((!firstName || !lastName || !email || !phone || !password || !gender || !dob || !AttorneyAvatar )){
        return next(new ErrorHandler("Please Fill Full Form",400));
    }
    const isRegistered = await User.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler(`${isRegistered.role} already exist with this email`,400));
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(AttorneyAvatar.tempFilePath);
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("Cloudinary Error : " , cloudinaryResponse.error || "Unknown Cloudinary Error" );
    }

    const Attorney = await User.create({
        firstName , lastName , email , phone , password , gender, dob  , AttorneyDepartment, role:"Attorney" , AttorneyAvatar:{ 
            public_id: cloudinaryResponse.public_id,
            url : cloudinaryResponse.secure_url,
        },
    });
    res.status(200).json({
        success:true,
        message : "New Attorney Registered",
        Attorney
    })
});