import express from 'express';
import { deleteAppointment, getAllAppointments, postAppointment, updateAppointmentStatus } from '../controllers/appointment.Controller.js';
import {isAdminAuthenticated,isLitigantAuthenticated} from '../middlewares/auth.js'
const router = express.Router();


router.post("/post",isLitigantAuthenticated,postAppointment);
router.get("/getall",isAdminAuthenticated,getAllAppointments);
router.put("/update/:id",isAdminAuthenticated,updateAppointmentStatus);
router.delete("/delete/:id",isAdminAuthenticated,deleteAppointment);

export default router;
