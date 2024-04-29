import {Message} from  '../models/message.Schema.js'
import {catchAsyncErrors} from '../middlewares/catchAsyncErrors.js'
import ErrorHandler from '../middlewares/errorMiddleware.js'

export const sendMessage = catchAsyncErrors(
    async(req,res ,next)=>{
        const { firstName, lastName, email, contact, message } = req.body;
    
        if(!firstName || !lastName || !email ||  !contact || !message){
            return next(new ErrorHandler("Please Fill Full Form",400));
        }
            await Message.create({firstName, lastName, email, contact, message});
            res.status(200).json({
                success:true,
                message:"Message send Successfully"
            })
    }
);

export const getMessages = catchAsyncErrors(async(req,res,next)=>{
    const messages = await Message.find();
    res.status(200).json({
        success:true,
        messages,
    });
    
})