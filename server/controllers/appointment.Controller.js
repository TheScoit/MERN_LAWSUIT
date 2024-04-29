import app from '../app.js';
import {catchAsyncErrors} from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../middlewares/errorMiddleware.js'
import { Appointment} from '../models/appointment.Schema.js'
import {User} from '../models/userSchema.js'

export const postAppointment = catchAsyncErrors(async(req,res,next)=>{
    const {
        firstName,
        lastName,
        email,
        phone,
        dob,
        gender,
        Appointment_date,
        attorneyDepartment,
        attorney_firstName,
        attorney_lastName,
        hasVisited,
        Address,
    } = req.body;

    if(
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !dob ||
        !gender ||
        !Appointment_date ||
        !attorneyDepartment ||
        !attorney_firstName ||
        !attorney_lastName ||
        !hasVisited ||
        !Address ){
            return next(new ErrorHandler("Please Fill Full Form",400));
    }

    const isConflict = await User.find({
        firstName : attorney_firstName,
        lastName : attorney_lastName,
        role:"Attorney",
        attorneyDepartment: department
    })
    if(!isConflict.length === 0){
        return next(new ErrorHandler("Attorney Not Found",404));
    }
    if(isConflict.length > 1){
        return next(new ErrorHandler("Attorney Conflict , Please Contact Through Email or Phone",404));
    }

    const AttorneyId = isConflict[0]._id;
    const LitigantId = req.User._id;
    const appointment = await Appointment.create({
        firstName,
        lastName,
        email,
        phone,
        dob,
        gender,
        Appointment_date,
        attorneyDepartment,
        attorney:{
            firstName:attorney_firstName,
            lastName:attorney_lastName,
        },   
        hasVisited,
        Address,
        AttorneyId,
        LitigantId,
    });
    res.status(200).json({
        success:true,
        message:"Appointment Sent Successfully",
    });
})


export const getAllAppointments = catchAsyncErrors(async(req,res,next)=>{
    const appointments = await Appointment.find();
    res.status(200).json({
        success:true,
        appointments,
    });
});

export const updateAppointmentStatus = catchAsyncErrors(async(req,res,next)=>{
    const {id} = req.params;
    let appointment = await Appointment.findById(id);
    if(!appointment){
        return next(new ErrorHandler("Appointment Not Found",404));
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body , {
        new : true,
        runValidators:true,
        useFindAndModify:false,
    });
    res.status(200).json({
        success:true,
        appointment,
        message:"Appointment Status Updated",
    });
});

export const deleteAppointment = catchAsyncErrors(async(req,res,next)=>{
    const {id} = req.params;
    let appointment = await Appointment.findById(id);
    if(!appointment){
        return next(new ErrorHandler("Appointment Not Found",404));
    }
    await appointment.deleteOne();
    res.status(200).json({
        success:true,
        message:"Appointment Deleted"
    })
})