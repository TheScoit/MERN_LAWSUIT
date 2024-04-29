import express from 'express';
import { getMessages, sendMessage } from '../controllers/message.Controller.js';
import {isAdminAuthenticated} from '../middlewares/auth.js'

const router = express.Router();
router.post("/send",sendMessage);
router.get("/getall",isAdminAuthenticated,getMessages)

export default router;