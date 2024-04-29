import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from 'jsonwebtoken';
import { User } from "../models/userSchema.js";

export const isAdminAuthenticated = catchAsyncErrors(async(req,res,next)=>{
    const token = req.cookies.adminToken;
    if(!token){
        return next(new ErrorHandler("Admin Not Authenticated",400));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY );
    req.user = await User.findById(decoded.id);
    if(req.user.role !== "Admin"){
        return next(new ErrorHandler(`${req.user.role} not authorized for this resource`,403));
    }
    next();
});

export const isLitigantAuthenticated = catchAsyncErrors(async(req,res,next)=>{
    const token = req.cookies.litigantToken;
    if(!token){
        return next(new ErrorHandler("Litigant Not Authenticated",400));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY );
    req.user = await User.findById(decoded.id);
    if(req.user.role !== "Litigant"){
        return next(new ErrorHandler(`${req.user.role} not authorized for this resource`,403));
    }
    next();
});

